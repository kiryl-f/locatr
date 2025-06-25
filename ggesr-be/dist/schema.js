"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const apollo_server_1 = require("apollo-server");
exports.typeDefs = (0, apollo_server_1.gql) `
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
  }
`;
