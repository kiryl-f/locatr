import { gql } from '@apollo/client';

export const SUBMIT_ROUND = gql`
  mutation SubmitRound(
    $sessionId: ID!
    $roundNumber: Int!
    $guessLat: Float!
    $guessLng: Float!
    $distance: Float!
    $points: Int!
    $locationName: String
  ) {
    submitRound(
      sessionId: $sessionId
      roundNumber: $roundNumber
      guessLat: $guessLat
      guessLng: $guessLng
      distance: $distance
      points: $points
      locationName: $locationName
    ) {
      id
      currentRound
      totalScore
      rounds {
        roundNumber
        guessLat
        guessLng
        distance
        points
        locationName
      }
    }
  }
`;
