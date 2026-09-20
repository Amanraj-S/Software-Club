import { useState, useEffect, useRef } from 'react';

export function useExamTimer(initialSeconds, onTimeExpired, isActive = true) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const onTimeExpiredRef = useRef(onTimeExpired);

  useEffect(() => {
    onTimeExpiredRef.current = onTimeExpired;
  }, [onTimeExpired]);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isActive || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimeExpiredRef.current) {
            onTimeExpiredRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, secondsLeft]);

  // Format time as HH:MM:SS or MM:SS
  const formatTime = () => {
    const hours = Math.floor(secondsLeft / 3600);
    const mins = Math.floor((secondsLeft % 3600) / 60);
    const secs = secondsLeft % 60;

    const pad = (n) => String(n).padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  const getWarningState = () => {
    if (secondsLeft <= 60) return 'CRITICAL'; // <= 1 min
    if (secondsLeft <= 300) return 'DANGER';  // <= 5 min
    if (secondsLeft <= 600) return 'WARNING'; // <= 10 min
    return 'NORMAL';
  };

  return {
    secondsLeft,
    formattedTime: formatTime(),
    warningState: getWarningState(),
    setSecondsLeft
  };
}
