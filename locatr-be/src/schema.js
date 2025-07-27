import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Image {
    id: ID!
    lat: Float!
    lng: Float!
    country: String
    region: String
  }

  type Query {
    images(region: String, country: String, count: Int = 1): [Image!]!
    randomImage(region: String): Image
    locationNameByCoords(lat: Float!, lon: Float!): String
  }
`;
