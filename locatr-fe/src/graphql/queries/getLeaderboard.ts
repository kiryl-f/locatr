import { gql } from '@apollo/client';

export const GET_LEADERBOARD = gql`
  query GetLeaderboard($region: String, $mode: String, $limit: Int) {
    leaderboard(region: $region, mode: $mode, limit: $limit) {
      id
      username
      score
      region
      mode
      createdAt
    }
  }
`;
