import { gql } from '@apollo/client';

export const COMPLETE_GAME = gql`
  mutation CompleteGame($sessionId: ID!, $username: String) {
    completeGame(sessionId: $sessionId, username: $username) {
      id
      username
      score
      region
      mode
      createdAt
    }
  }
`;
