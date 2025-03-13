'use client';

import { useEffect, useState } from 'react';

export function useInitialFlip(revealTime: number) {
  const [flipAll, setFlipAll] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFlipAll(true); // Flip all cards
      setTimeout(() => {
        setIsTimerActive(true); // Start the timer after a short delay
      }, 200); 
    }, revealTime);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [revealTime]);

  return { flipAll, isTimerActive };
}
