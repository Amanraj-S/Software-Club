import { useState, useEffect, useRef } from 'react';

export function useExamTimer(initialSeconds, onTimeExpired, isActive = true) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const onTimeExpiredRef = useRef(onTimeExpired);
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    onTimeExpiredRef.current = onTimeExpired;
  }, [onTimeExpired]);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  // Handle immediate expiration if initialSeconds <= 0 on mount/restore
  useEffect(() => {
    if (isActive && initialSeconds <= 0 && !hasExpiredRef.current) {
      hasExpiredRef.current = true;
      if (onTimeExpiredRef.current) {
        onTimeExpiredRef.current();
      }
    }
  }, [isActive, initialSeconds]);

  // Countdown timer loop
  useEffect(() => {
    if (!isActive || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!hasExpiredRef.current) {
            hasExpiredRef.current = true;
            if (onTimeExpiredRef.current) {
              onTimeExpiredRef.current();
            }
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
    const safeSecs = Math.max(0, secondsLeft);
    const hours = Math.floor(safeSecs / 3600);
    const mins = Math.floor((safeSecs % 3600) / 60);
    const secs = safeSecs % 60;

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
