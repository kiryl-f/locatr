import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { StreetView } from '../StreetView/StreetView';
import { GuessMap } from '../GuessMap/GuessMap';
import { haversineDistance } from '../../utils/distance';

import styles from './Game.module.scss';

// GraphQL query to fetch one random image (optionally by region)
const GET_RANDOM_IMAGE = gql`
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

export const Game = () => {
  const [guessCoords, setGuessCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  // Fetch one random image from backend (you can pass region or omit)
  const { loading, error, data, refetch } = useQuery(GET_RANDOM_IMAGE, {
    variables: { region: 'europe' }, // You can make this dynamic or remove region
    fetchPolicy: 'network-only', // Always fetch fresh data on mount/refetch
  });

  const actualCoords = data?.randomImage
    ? { lat: data.randomImage.lat, lng: data.randomImage.lng }
    : null;

  const handleGuess = (lat: number, lng: number) => {
    setGuessCoords({ lat, lng });
  };

  const handleSubmit = () => {
    if (!guessCoords || !actualCoords) {
      console.log('Missing coordinates');
      return;
    }
    const d = haversineDistance(actualCoords.lat, actualCoords.lng, guessCoords.lat, guessCoords.lng);
    setDistance(d);
  };

  const handleNext = () => {
    setGuessCoords(null);
    setDistance(null);
    refetch(); // Fetch a new random image for next round
  };

  if (loading) return <p className={styles.centeredMessage}>Loading location...</p>;
  if (error || !data?.randomImage)
    return <p className={styles.centeredMessage}>Error loading image</p>;

  return (
    <div>
      <StreetView imageKey={data.randomImage.id} />
      <div className={styles.guessMapContainer}>
        <GuessMap onGuess={handleGuess} />
        <button onClick={handleSubmit} disabled={!guessCoords || distance !== null}>
          Submit Guess
        </button>
        {distance !== null && (
          <button onClick={handleNext} style={{ marginLeft: '1rem' }}>
            Next Image
          </button>
        )}
      </div>
      {distance !== null && (
        <p className={styles.distanceMessage}>
          You were <strong>{distance.toFixed(2)} km</strong> away!
        </p>
      )}
    </div>
  );
};
