import styles from './ResultMessage.module.scss';
import { useEffect, useState } from 'react';

interface Props {
  message: string;
  points: number;
  duration?: number; // in ms
  onFinish: () => void;
}

export const ResultMessage = ({ message, points, duration = 2500, onFinish }: Props) => {
  const [displayedPoints, setDisplayedPoints] = useState(0);

  useEffect(() => {
    let current = 0;
    const steps = points;
    const intervalTime = steps > 0 ? 2000 / steps : 2000;

    const interval = setInterval(() => {
      current += 1;
      setDisplayedPoints(current);
      if (current >= points) clearInterval(interval);
    }, intervalTime);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      onFinish();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [points, duration, onFinish]);

  return (
    <div className={styles.overlay}>
      <div className={styles.messageBox}>
        <div>{message}</div>
        <div className={styles.points}>+{displayedPoints} pts</div>
      </div>
    </div>
  );
};
