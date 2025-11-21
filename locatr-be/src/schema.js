import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Image {
    id: ID!
    lat: Float!
    lng: Float!
    country: String
    region: String
  }

  type Round {
    roundNumber: Int!
    imageId: String!
    actualLat: Float!
    actualLng: Float!
    guessLat: Float
    guessLng: Float
    distance: Float
    points: Int
    locationName: String
  }

  type GameSession {
    id: ID!
    region: String!
    mode: String!
    rounds: [Round!]!
    currentRound: Int!
    totalScore: Int!
    completed: Boolean!
    createdAt: String!
  }

  type PlayerStats {
    totalGames: Int!
    totalRounds: Int!
    averageScore: Float!
    bestScore: Int!
    averageDistance: Float!
    totalPoints: Int!
    gamesByRegion: [RegionStats!]!
  }

  type RegionStats {
    region: String!
    gamesPlayed: Int!
    averageScore: Float!
  }

  type LeaderboardEntry {
    id: ID!
    username: String!
    score: Int!
    region: String!
    mode: String!
    createdAt: String!
  }

  type Query {
    images(region: String, country: String, count: Int = 1): [Image!]!
    randomImage(region: String): Image
    locationNameByCoords(lat: Float!, lon: Float!): String
    gameSession(id: ID!): GameSession
    playerStats: PlayerStats!
    leaderboard(region: String, mode: String, limit: Int = 10): [LeaderboardEntry!]!
  }

  type Mutation {
    startGame(region: String!, mode: String!): GameSession!
    submitRound(
      sessionId: ID!
      roundNumber: Int!
      guessLat: Float!
      guessLng: Float!
      distance: Float!
      points: Int!
      locationName: String
    ): GameSession!
    completeGame(sessionId: ID!, username: String): LeaderboardEntry
  }
`;
