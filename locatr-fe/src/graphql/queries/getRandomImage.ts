// src/graphql/queries/getRandomImage.ts
import { gql } from '@apollo/client';

export const GET_RANDOM_IMAGE = gql`
  query RandomImage($region: String) {
    randomImage(region: $region) {
      id
      lat
      lng
      region
      country
    }
  }
`;
