import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';

import { StreetView } from '../../components/StreetView/StreetView';
import { GuessMap } from '../../components/GuessMap/GuessMap';

import { useGameTimer } from '../../hooks/useGameTimer';
import { useGameSessionStore } from '../../stores/gameSessionStore';

import styles from './Game.module.scss';
import { GameControls } from '../../components/Game/GameControls/GameControls';
import { START_GAME } from '../../graphql/mutations/startGame';
import { SUBMIT_ROUND } from '../../graphql/mutations/submitRound';
import { LOCATION_NAME_BY_COORDS } from '../../graphql/queries/getLocationNameByCoords';
import type { AvaliableRegion } from '../../types/regions';
import type { GameMode } from '../../types/gameModes';
import { ResultMessage } from '../../components/common/ResultMessage/ResultMessage';
import { calculatePoints } from '../../utils/pointsByDistance';
import haversine from 'haversine-distance';

export const Game: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { session, setSession, getCurrentRound } = useGameSessionStore();

  const initialRegion = (searchParams.get('region') as AvaliableRegion) || 'europe';
  const initialMode = (searchParams.get('mode') as GameMode) || 'classic';

  const [guessCoords, setGuessCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [points, setPoints] = useState<number | null>(null);

  const [startGame, { loading: startingGame }] = useMutation(START_GAME);
  const [submitRound] = useMutation(SUBMIT_ROUND);

  const currentRound = getCurrentRound();
  const actualCoords = currentRound
    ? { lat: currentRound.actualLat, lng: currentRound.actualLng }
    : null;

  const { data: locationData } = useQuery(LOCATION_NAME_BY_COORDS, {
    variables: {
      lat: actualCoords?.lat ?? 0,
      lon: actualCoords?.lng ?? 0,
    },
    skip: !actualCoords || distance === null,
    fetchPolicy: 'network-only',
  });

  const { timer, stop } = useGameTimer(
    initialMode === 'timed' && distance === null && !!session,
    () => {
      handleAutoSubmit();
    }
  );

  useEffect(() => {
    if (!session) {
      initializeGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeGame = async () => {
    try {
      const { data } = await startGame({
        variables: { region: initialRegion, mode: initialMode },
      });
      if (data?.startGame) {
        setSession(data.startGame);
      }
    } catch (error) {
      console.error('Failed to start game:', error);
    }
  };

  const handleGuess = (lat: number, lng: number) => {
    setGuessCoords({ lat, lng });
  };

  const handleSubmit = async () => {
    if (!guessCoords || !actualCoords || !session || !currentRound) return;

    const dist = haversine(
      { lat: guessCoords.lat, lon: guessCoords.lng },
      { lat: actualCoords.lat, lon: actualCoords.lng }
    ) / 1000;

    const calculatedPoints = calculatePoints(dist);
    setDistance(dist);
    setPoints(calculatedPoints);
    stop();

    try {
      const { data } = await submitRound({
        variables: {
          sessionId: session.id,
          roundNumber: currentRound.roundNumber,
          guessLat: guessCoords.lat,
          guessLng: guessCoords.lng,
          distance: dist,
          points: calculatedPoints,
          locationName: locationData?.locationNameByCoords || null,
        },
      });

      if (data?.submitRound) {
        setSession(data.submitRound);
      }
    } catch (error) {
      console.error('Failed to submit round:', error);
    }
  };

  const handleAutoSubmit = async () => {
    if (!actualCoords || !session || !currentRound) return;

    const randomGuess = {
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180,
    };
    setGuessCoords(randomGuess);

    const dist = haversine(
      { lat: randomGuess.lat, lon: randomGuess.lng },
      { lat: actualCoords.lat, lon: actualCoords.lng }
    ) / 1000;

    const calculatedPoints = 0;
    setDistance(dist);
    setPoints(calculatedPoints);

    try {
      const { data } = await submitRound({
        variables: {
          sessionId: session.id,
          roundNumber: currentRound.roundNumber,
          guessLat: randomGuess.lat,
          guessLng: randomGuess.lng,
          distance: dist,
          points: calculatedPoints,
          locationName: locationData?.locationNameByCoords || null,
        },
      });

      if (data?.submitRound) {
        setSession(data.submitRound);
      }
    } catch (error) {
      console.error('Failed to submit round:', error);
    }
  };

  const handleNext = () => {
    if (!session) return;

    if (session.currentRound >= 5) {
      navigate('/summary');
    } else {
      setGuessCoords(null);
      setDistance(null);
      setPoints(null);
    }
  };

  if (startingGame || !session || !currentRound) {
    return <p className={styles.centeredMessage}>Loading game...</p>;
  }

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.roundIndicator}>
          Round {session.currentRound} / 5
        </div>
        <div className={styles.scoreIndicator}>
          Score: {session.totalScore.toLocaleString()}
        </div>
      </div>

      <StreetView imageKey={currentRound.imageId} />

      <div className={`${styles.guessMapContainer} ${initialMode === 'timed' ? styles.timed : ''}`}>
        <GuessMap
          onGuess={handleGuess}
          guessCoords={guessCoords}
          actualCoords={actualCoords}
          showLine={distance !== null}
        />
        <GameControls
          guessCoords={guessCoords}
          distance={distance}
          onSubmit={handleSubmit}
          showTimer={initialMode === 'timed'}
          timer={timer}
        />
      </div>

      {distance !== null && points !== null && (
        <ResultMessage
          message={`You were ${distance.toFixed(1)} km away!`}
          points={points}
          onFinish={handleNext}
          actualLocation={locationData?.locationNameByCoords || ''}
        />
      )}
    </div>
  );
};
