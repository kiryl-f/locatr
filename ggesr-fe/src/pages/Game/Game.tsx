import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { StreetView } from '../../components/StreetView/StreetView';
import { GuessMap } from '../../components/GuessMap/GuessMap';
import { RegionPicker } from '../../components/RegionPicker/RegionPicker';

import { useGameRound } from '../../hooks/useGameRound';
import { useGameTimer } from '../../hooks/useGameTimer';

import styles from './Game.module.scss';
import { GameControls } from '../../components/Game/GameControls/GameControls';
import { GET_RANDOM_IMAGE } from '../../graphql/queries/getRandomImage';
import type { AvaliableRegion } from '../../types/regions';
import type { GameMode } from '../../types/gameModes';
import { ResultMessage } from '../../components/common/ResultMessage/ResultMessage';


export const Game: React.FC = () => {
  const [searchParams] = useSearchParams();

  const initialRegion = (searchParams.get('region') as AvaliableRegion) || 'europe';
  const initialMode = (searchParams.get('mode') as GameMode) || 'classic';

  const [region, setRegion] = useState<AvaliableRegion>(initialRegion);
  const [mode] = useState<GameMode>(initialMode);

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

  useEffect(() => {
    if (distance !== null) stop();
  }, [distance, stop]);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRegion = e.target.value as AvaliableRegion;
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
        <ResultMessage
          message={`You were ${distance.toFixed(1)} km away!`}
          points={123}
          onFinish={() => {
            handleNext();
          }}
        />
      )}
    </div>
  );
};
