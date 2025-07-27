import { useEffect, useRef, useState } from 'react';

export const useGameTimer = (enabled: boolean, onTimeout: () => void) => {
  const [timer, setTimer] = useState<number>(30);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    setTimer(30);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [enabled, onTimeout]);

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return { timer, stop };
};
