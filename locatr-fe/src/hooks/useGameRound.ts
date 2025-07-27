import { useState } from 'react';
import { haversineDistance } from '../utils/distance';

export const useGameRound = (actualCoords: { lat: number; lng: number } | null, refetch: () => void) => {
  const [guessCoords, setGuessCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  const handleGuess = (lat: number, lng: number) => {
    setGuessCoords({ lat, lng });
  };

  const handleSubmit = () => {
    if (!guessCoords || !actualCoords) return;

    const d = haversineDistance(
      actualCoords.lat,
      actualCoords.lng,
      guessCoords.lat,
      guessCoords.lng
    );
    setDistance(d);
  };

  const handleAutoSubmit = () => {
    if (distance !== null) return;
    if (guessCoords && actualCoords) {
      handleSubmit();
    } else {
      setDistance(-1);
    }
  };

  const handleNext = () => {
    setGuessCoords(null);
    setDistance(null);
    refetch();
  };

  return {
    guessCoords,
    distance,
    handleGuess,
    handleSubmit,
    handleAutoSubmit,
    handleNext,
  };
};
