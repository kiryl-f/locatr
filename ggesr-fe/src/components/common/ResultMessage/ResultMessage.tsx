import React, { useEffect, useState } from 'react';
import styles from './ResultMessage.module.scss';

type ResultMessageProps = {
  message: string;
  points: number;
  onFinish: () => void;
  duration?: number;
  actualLocation?: string; 
};

export const ResultMessage: React.FC<ResultMessageProps> = ({ message, points, onFinish, duration, actualLocation }) => {
  const [animatedPoints, setAnimatedPoints] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    // Animate points incrementally
    interval = setInterval(() => {
      setAnimatedPoints((prev) => {
        if (prev < points) return prev + 1;
        clearInterval(interval);
        return points;
      });
    }, 10);

    // Auto-close only if duration is provided
    if (duration) {
      timeout = setTimeout(() => {
        onFinish();
      }, duration);
    }

    return () => {
      clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [points, duration, onFinish]);

  return (
    <div className={styles.overlay}>
      <div className={styles.messageBox}>
        <p>{message}</p>
        <p className={styles.points}>+{animatedPoints} points</p>

        {!duration && (
          <button className={styles.closeButton} onClick={onFinish}>
            Continue
          </button>
        )}

        {actualLocation 
          ?
            <p>{`Actual location: ${actualLocation}`}</p>
          : 
            <p>Loading actual location...</p>
        }
      </div>
    </div>
  );
};
