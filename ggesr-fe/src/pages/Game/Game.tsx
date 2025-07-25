import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useApolloClient } from '@apollo/client';

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
import { calculatePoints } from '../../utils/pointsByDistance';
import { LOCATION_NAME_BY_COORDS } from '../../graphql/queries/getLocationNameByCoords';

export const Game: React.FC = () => {
  const client = useApolloClient();
  const [searchParams] = useSearchParams();

  const initialRegion = (searchParams.get('region') as AvaliableRegion) || 'europe';
  const initialMode = (searchParams.get('mode') as GameMode) || 'classic';

  const [region, setRegion] = useState<AvaliableRegion>(initialRegion);
  const [mode] = useState<GameMode>(initialMode);
  const [actualCoords, setActualCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [shouldFetchLocation, setShouldFetchLocation] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_RANDOM_IMAGE, {
    variables: { region },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (data?.randomImage) {
      setActualCoords({ lat: data.randomImage.lat, lng: data.randomImage.lng });
      setShouldFetchLocation(false); // reset on new round
    }
  }, [data]);

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

  const { data: locationData } = useQuery(LOCATION_NAME_BY_COORDS, {
    variables: {
      lat: actualCoords?.lat ?? 0,
      lon: actualCoords?.lng ?? 0,
    },
    skip: !shouldFetchLocation || !actualCoords,
    fetchPolicy: 'network-only',
  });

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRegion = e.target.value as AvaliableRegion;
    setRegion(newRegion);
    handleNext();
  };

  const handleGuessSubmit = () => {
    handleSubmit();
    stop();
    if (actualCoords) {
      setShouldFetchLocation(true); // trigger reverse geocode query
    }
  };

  const handleNextWithReset = () => {
    handleNext();
    setShouldFetchLocation(false); // prevent query on next round
    client.cache.evict({ fieldName: 'locationNameByCoords' });
  };

  if (loading) return <p className={styles.centeredMessage}>Loading location...</p>;
  if (error || !data?.randomImage)
    return <p className={styles.centeredMessage}>Error loading image</p>;

  return (
    <div>
      <RegionPicker region={region} onChange={handleRegionChange} />
      <StreetView imageKey={data.randomImage.id} />

      <div className={`${styles.guessMapContainer} ${mode === 'timed' ? styles.timed : ''}`}>
        <GuessMap
          onGuess={handleGuess}
          guessCoords={guessCoords}
          actualCoords={actualCoords}
          showLine={distance !== null}
        />
        <GameControls
          guessCoords={guessCoords}
          distance={distance}
          onSubmit={handleGuessSubmit}
          onNext={handleNextWithReset}
          showTimer={mode === 'timed'}
          timer={timer}
        />
      </div>

      {distance !== null && (
        <ResultMessage
          message={`You were ${distance.toFixed(1)} km away!`}
          points={calculatePoints(distance)}
          onFinish={handleNextWithReset}
          actualLocation={locationData?.locationNameByCoords || ''}
        />
      )}
    </div>
  );
};
