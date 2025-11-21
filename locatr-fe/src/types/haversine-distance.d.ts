declare module 'haversine-distance' {
  interface Coordinates {
    lat: number;
    lon: number;
  }

  function haversine(pointA: Coordinates, pointB: Coordinates): number;
  
  export default haversine;
}
