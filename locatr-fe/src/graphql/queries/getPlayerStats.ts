import { gql } from '@apollo/client';

export const GET_PLAYER_STATS = gql`
  query GetPlayerStats {
    playerStats {
      totalGames
      totalRounds
      averageScore
      bestScore
      averageDistance
      totalPoints
      gamesByRegion {
        region
        gamesPlayed
        averageScore
      }
    }
  }
`;
