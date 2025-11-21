import { gql } from '@apollo/client';

export const GET_MY_GAMES = gql`
  query GetMyGames($limit: Int) {
    myGames(limit: $limit) {
      id
      region
      mode
      totalScore
      completed
      createdAt
      rounds {
        roundNumber
        distance
        points
        locationName
      }
    }
  }
`;
