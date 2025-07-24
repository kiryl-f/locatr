import { gql, useQuery } from '@apollo/client';

export const LOCATION_NAME_BY_COORDS = gql`
  query locationNameByCoords($lat: Float!, $lon: Float!) {
    locationNameByCoords(lat: $lat, lon: $lon)
  }
`;
