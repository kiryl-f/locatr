import { ResultMessage } from '../common/ResultMessage/ResultMessage';
import { FAKE_RESULTS, REGIONS } from './consts';
import styles from './PixelMap.module.scss';
import { useEffect, useState } from 'react';

export default function PixelMap() {
  const [cursorPos, setCursorPos] = useState(REGIONS[0]);
  const [regionIndex, setRegionIndex] = useState(0);
  const [moveCount, setMoveCount] = useState(0);

  const [showResult, setShowResult] = useState(false);
  const [resultText, setResultText] = useState('');
  const [resultPoints, setResultPoints] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRegionIndex((prev) => {
        const next = (prev + 1) % REGIONS.length;
        const newMoveCount = moveCount + 1;
        setMoveCount(newMoveCount);

        if (newMoveCount % 3 === 0) {
          const result = FAKE_RESULTS[Math.floor(Math.random() * FAKE_RESULTS.length)];
          setResultText(result.text);
          setResultPoints(result.points);
          setShowResult(true);
        }

        return next;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [moveCount]);

  useEffect(() => {
    setCursorPos(REGIONS[regionIndex]);
  }, [regionIndex]);

  return (
    <div className={styles.mapContainer}>
      <div className={styles.map} />
      <div
        className={styles.cursor}
        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
      />
      {showResult && (
        <ResultMessage
          message={resultText}
          points={resultPoints}
          onFinish={() => setShowResult(false)}
        />
      )}
    </div>
  );
}
