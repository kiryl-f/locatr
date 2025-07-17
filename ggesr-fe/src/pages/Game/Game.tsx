import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { StreetView } from '../../components/StreetView/StreetView';
import { GuessMap } from '../../components/GuessMap/GuessMap';
import { haversineDistance } from '../../utils/distance';
import { RegionPicker } from '../../components/RegionPicker/RegionPicker';
import React, { useEffect, useRef } from 'react';

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
  const [searchParams] = useSearchParams();
  const initialRegion = (searchParams.get('region') as  'europe' | 'usa') || 'europe';
  const initialMode = (searchParams.get('mode') as 'classic' | 'timed') || 'classic';

  const [region, setRegion] = useState<'europe' | 'usa'>(initialRegion);
  const [mode] = useState<'classic' | 'timed'>(initialMode);
  const [guessCoords, setGuessCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [timer, setTimer] = useState<number>(30); // 30 seconds for timed mode
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch one random image from backend (you can pass region or omit)
  const { loading, error, data, refetch } = useQuery(GET_RANDOM_IMAGE, {
    variables: { region },
    fetchPolicy: 'network-only', // Always fetch fresh data on mount/refetch
  });

  // Timer effect for timed mode
  useEffect(() => {
    if (mode !== 'timed' || distance !== null) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    setTimer(30);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, data?.randomImage?.id, distance]);

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
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleAutoSubmit = () => {
    if (distance !== null) return;
    if (guessCoords && actualCoords) {
      handleSubmit();
    } else {
      setDistance(-1); // Indicate no guess was made
    }
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleNext = () => {
    setGuessCoords(null);
    setDistance(null);
    refetch(); // Fetch a new random image for next round
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRegion = e.target.value as 'europe' | 'usa';
    setRegion(newRegion);
    setGuessCoords(null);
    setDistance(null);
    refetch({ region: newRegion });
  };

  if (loading) return <p className={styles.centeredMessage}>Loading location...</p>;
  if (error || !data?.randomImage)
    return <p className={styles.centeredMessage}>Error loading image</p>;

  return (
    <div>
      <RegionPicker region={region} onChange={handleRegionChange} />
      <StreetView imageKey={data.randomImage.id} />
      <div className={styles.guessMapContainer}>
        {mode === 'timed' && distance === null && (
          <div style={{ fontSize: '1.5rem', color: 'red', marginBottom: '1rem' }}>
            ⏰ {timer}s
          </div>
        )}
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
          {distance === -1 ? (
            <span>Time's up! No guess submitted.</span>
          ) : (
            <span>You were <strong>{'\u00A0'}{distance.toFixed(2)}{'\u00A0'} km</strong> away!</span>
          )}
        </p>
      )}
    </div>
  );
};
