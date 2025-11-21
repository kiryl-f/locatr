import { readFileSync } from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from './auth/password.js';
import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from './auth/jwt.js';

const prisma = new PrismaClient();

const images = JSON.parse(
  readFileSync(path.join(process.cwd(), 'src/data', 'images.json'), 'utf-8')
);

export const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) return null;
      
      const dbUser = await prisma.user.findUnique({
        where: { id: user.userId },
      });
      
      return dbUser;
    },

    images: (_, { region, country, count }) => {
      let filtered = images;

      if (region) {
        filtered = filtered.filter(img => img.region === region);
      }
      if (country) {
        filtered = filtered.filter(img => img.country === country);
      }

      const shuffled = filtered.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    },

    locationNameByCoords: async (_, { lat, lon }) => {
      console.log(`Reverse geocoding for: ${lat}, ${lon}`);
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;

      const fetchWithRetry = async (retries = 3, delayMs = 1000) => {
        try {
          const response = await fetch(url);

          if (!response.ok) throw new Error(`Failed to fetch location, status: ${response.status}`);

          const data = await response.json();
          return `${data.address.city ||
            data.address.village ||
            data.address.state ||
            data.address.state_district ||
            data.address.road}, ${data.address.country}` || 'Unknown location';
        } catch (err) {
          if (retries > 0) {
            console.warn(`Fetch failed, retrying... (${retries} left)`, err.message);
            await new Promise((r) => setTimeout(r, delayMs));
            return fetchWithRetry(retries - 1, delayMs * 2);
          } else {
            throw err;
          }
        }
      };

      try {
        return await fetchWithRetry();
      } catch (err) {
        console.error('Reverse geocode failed after retries:', err);
        return 'Unknown location';
      }
    },

    randomImage: (_, { region }) => {
      const filtered = region
        ? images.filter(img => img.region === region)
        : images;

      if (!filtered.length) return null;

      return filtered[Math.floor(Math.random() * filtered.length)];
    },

    gameSession: async (_, { id }) => {
      const session = await prisma.gameSession.findUnique({
        where: { id },
        include: { rounds: { orderBy: { roundNumber: 'asc' } } }
      });
      return session;
    },

    playerStats: async (_, __, { user }) => {
      const where = { completed: true };
      if (user) {
        where.userId = user.userId;
      }
      
      const sessions = await prisma.gameSession.findMany({
        where,
        include: { rounds: true }
      });

      if (sessions.length === 0) {
        return {
          totalGames: 0,
          totalRounds: 0,
          averageScore: 0,
          bestScore: 0,
          averageDistance: 0,
          totalPoints: 0,
          gamesByRegion: []
        };
      }

      const totalGames = sessions.length;
      const totalRounds = sessions.reduce((sum, s) => sum + s.rounds.length, 0);
      const totalPoints = sessions.reduce((sum, s) => sum + s.totalScore, 0);
      const bestScore = Math.max(...sessions.map(s => s.totalScore));
      const averageScore = totalPoints / totalGames;

      const allRounds = sessions.flatMap(s => s.rounds);
      const roundsWithDistance = allRounds.filter(r => r.distance !== null);
      const averageDistance = roundsWithDistance.length > 0
        ? roundsWithDistance.reduce((sum, r) => sum + r.distance, 0) / roundsWithDistance.length
        : 0;

      const regionMap = {};
      sessions.forEach(s => {
        if (!regionMap[s.region]) {
          regionMap[s.region] = { count: 0, totalScore: 0 };
        }
        regionMap[s.region].count++;
        regionMap[s.region].totalScore += s.totalScore;
      });

      const gamesByRegion = Object.entries(regionMap).map(([region, data]) => ({
        region,
        gamesPlayed: data.count,
        averageScore: data.totalScore / data.count
      }));

      return {
        totalGames,
        totalRounds,
        averageScore,
        bestScore,
        averageDistance,
        totalPoints,
        gamesByRegion
      };
    },

    leaderboard: async (_, { region, mode, limit = 10 }) => {
      const where = {};
      if (region) where.region = region;
      if (mode) where.mode = mode;

      const entries = await prisma.leaderboardEntry.findMany({
        where,
        orderBy: { score: 'desc' },
        take: limit
      });

      return entries;
    }
  },

  Mutation: {
    register: async (_, { email, username, password }, { res }) => {
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (existingUser) {
        throw new Error('User with this email or username already exists');
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
        },
      });

      // Generate tokens
      const accessToken = generateAccessToken(user.id, user.email);
      const refreshToken = generateRefreshToken();

      // Store refresh token in database
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: getRefreshTokenExpiry(),
        },
      });

      // Set cookies
      res.cookie('accessToken', accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
      res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt.toISOString(),
        },
        message: 'Registration successful',
      };
    },

    login: async (_, { email, password }, { res }) => {
      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Verify password
      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        throw new Error('Invalid email or password');
      }

      // Generate tokens
      const accessToken = generateAccessToken(user.id, user.email);
      const refreshToken = generateRefreshToken();

      // Store refresh token in database
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: getRefreshTokenExpiry(),
        },
      });

      // Set cookies
      res.cookie('accessToken', accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
      res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt.toISOString(),
        },
        message: 'Login successful',
      };
    },

    logout: async (_, __, { req, res }) => {
      const refreshToken = req.cookies?.refreshToken;

      if (refreshToken) {
        // Delete refresh token from database
        await prisma.refreshToken.deleteMany({
          where: { token: refreshToken },
        });
      }

      // Clear cookies
      res.clearCookie('accessToken', { path: '/' });
      res.clearCookie('refreshToken', { path: '/' });

      return true;
    },

    refreshToken: async (_, __, { req, res }) => {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        throw new Error('No refresh token provided');
      }

      // Find refresh token in database
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!storedToken) {
        throw new Error('Invalid refresh token');
      }

      // Check if token is expired
      if (new Date() > storedToken.expiresAt) {
        await prisma.refreshToken.delete({
          where: { id: storedToken.id },
        });
        throw new Error('Refresh token expired');
      }

      // Generate new access token
      const accessToken = generateAccessToken(storedToken.user.id, storedToken.user.email);

      // Set new access token cookie
      res.cookie('accessToken', accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);

      return true;
    },

    startGame: async (_, { region, mode }, { user }) => {
      const filtered = region ? images.filter(img => img.region === region) : images;
      
      if (!filtered.length) {
        throw new Error(`No images available for region: ${region}`);
      }

      const session = await prisma.gameSession.create({
        data: {
          region,
          mode,
          currentRound: 1,
          totalScore: 0,
          completed: false,
          userId: user?.userId || null,
        }
      });

      // Pre-generate 5 rounds
      for (let i = 1; i <= 5; i++) {
        const randomImage = filtered[Math.floor(Math.random() * filtered.length)];
        await prisma.round.create({
          data: {
            sessionId: session.id,
            roundNumber: i,
            imageId: randomImage.id,
            actualLat: randomImage.lat,
            actualLng: randomImage.lng
          }
        });
      }

      const sessionWithRounds = await prisma.gameSession.findUnique({
        where: { id: session.id },
        include: { rounds: { orderBy: { roundNumber: 'asc' } } }
      });

      return sessionWithRounds;
    },

    submitRound: async (_, { sessionId, roundNumber, guessLat, guessLng, distance, points, locationName }) => {
      await prisma.round.update({
        where: {
          sessionId_roundNumber: {
            sessionId,
            roundNumber
          }
        },
        data: {
          guessLat,
          guessLng,
          distance,
          points,
          locationName
        }
      });

      const session = await prisma.gameSession.findUnique({
        where: { id: sessionId },
        include: { rounds: true }
      });

      const totalScore = session.rounds
        .filter(r => r.points !== null)
        .reduce((sum, r) => sum + r.points, 0);

      const updatedSession = await prisma.gameSession.update({
        where: { id: sessionId },
        data: {
          totalScore,
          currentRound: roundNumber < 5 ? roundNumber + 1 : 5
        },
        include: { rounds: { orderBy: { roundNumber: 'asc' } } }
      });

      return updatedSession;
    },

    completeGame: async (_, { sessionId, username }, { user }) => {
      const session = await prisma.gameSession.findUnique({
        where: { id: sessionId },
        include: { rounds: true, user: true }
      });

      if (!session) {
        throw new Error('Session not found');
      }

      await prisma.gameSession.update({
        where: { id: sessionId },
        data: { completed: true }
      });

      // Use authenticated user's username if available, otherwise use provided username
      const displayUsername = user 
        ? (await prisma.user.findUnique({ where: { id: user.userId } }))?.username
        : username;

      if (displayUsername) {
        const entry = await prisma.leaderboardEntry.create({
          data: {
            sessionId,
            userId: user?.userId || null,
            username: displayUsername,
            score: session.totalScore,
            region: session.region,
            mode: session.mode
          }
        });
        return entry;
      }

      return null;
    }
  }
};
