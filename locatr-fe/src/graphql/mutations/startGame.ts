import { gql } from '@apollo/client';

export const START_GAME = gql`
  mutation StartGame($region: String!, $mode: String!) {
    startGame(region: $region, mode: $mode) {
      id
      region
      mode
      currentRound
      totalScore
      completed
      rounds {
        roundNumber
        imageId
        actualLat
        actualLng
      }
    }
  }
`;
