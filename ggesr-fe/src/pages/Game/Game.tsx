import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

import { StreetView } from '../../components/StreetView/StreetView';
import { GuessMap } from '../../components/GuessMap/GuessMap';
import { RegionPicker } from '../../components/RegionPicker/RegionPicker';

import { useGameRound } from '../../hooks/useGameRound';
import { useGameTimer } from '../../hooks/useGameTimer';

import styles from './Game.module.scss';
import { GameControls } from '../../components/Game/GameControls/GameControls';

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

  const initialRegion = (searchParams.get('region') as 'europe' | 'usa') || 'europe';
  const initialMode = (searchParams.get('mode') as 'classic' | 'timed') || 'classic';

  const [region, setRegion] = React.useState<'europe' | 'usa'>(initialRegion);
  const [mode] = React.useState<'classic' | 'timed'>(initialMode);

  const { loading, error, data, refetch } = useQuery(GET_RANDOM_IMAGE, {
    variables: { region },
    fetchPolicy: 'network-only',
  });

  const actualCoords = data?.randomImage
    ? { lat: data.randomImage.lat, lng: data.randomImage.lng }
    : null;

  const {
    guessCoords,
    distance,
    handleGuess,
    handleSubmit,
    handleAutoSubmit,
    handleNext,
  } = useGameRound(actualCoords, refetch);

  const { timer, stop } = useGameTimer(
    mode === 'timed' && distance === null,
    () => {
      handleAutoSubmit();
    }
  );

  React.useEffect(() => {
    if (distance !== null) stop();
  }, [distance, stop]);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRegion = e.target.value as 'europe' | 'usa';
    setRegion(newRegion);
    handleNext(); // Reset state and refetch
  };

  if (loading) return <p className={styles.centeredMessage}>Loading location...</p>;
  if (error || !data?.randomImage)
    return <p className={styles.centeredMessage}>Error loading image</p>;

  return (
    <div>
      <RegionPicker region={region} onChange={handleRegionChange} />
      <StreetView imageKey={data.randomImage.id} />

      <div className={styles.guessMapContainer}>
        <GuessMap onGuess={handleGuess} />
        <GameControls
          guessCoords={guessCoords}
          distance={distance}
          onSubmit={handleSubmit}
          onNext={handleNext}
          showTimer={mode === 'timed'}
          timer={timer}
        />
      </div>

      {distance !== null && (
        <p className={styles.distanceMessage}>
          {distance === -1 ? (
            <span>Time's up! No guess submitted.</span>
          ) : (
            <span>You were <strong>{distance.toFixed(2)} km</strong> away!</span>
          )}
        </p>
      )}
    </div>
  );
};
