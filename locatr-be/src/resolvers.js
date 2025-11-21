import { readFileSync } from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const images = JSON.parse(
  readFileSync(path.join(process.cwd(), 'src/data', 'images.json'), 'utf-8')
);

export const resolvers = {
  Query: {
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

    playerStats: async () => {
      const sessions = await prisma.gameSession.findMany({
        where: { completed: true },
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
    startGame: async (_, { region, mode }) => {
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
          completed: false
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

    completeGame: async (_, { sessionId, username }) => {
      const session = await prisma.gameSession.findUnique({
        where: { id: sessionId },
        include: { rounds: true }
      });

      if (!session) {
        throw new Error('Session not found');
      }

      await prisma.gameSession.update({
        where: { id: sessionId },
        data: { completed: true }
      });

      if (username) {
        const entry = await prisma.leaderboardEntry.create({
          data: {
            sessionId,
            username,
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
