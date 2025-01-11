'use client';

import { useEffect } from 'react';

export function initialFlip(revealTime: number, 
  setFlipAll: React.Dispatch<React.SetStateAction<boolean>>,
  setStartTimer: React.Dispatch<React.SetStateAction<boolean>>) {
  useEffect(() => {
    const timer = setTimeout(() => {
      setFlipAll(true); // Set the cards to be flipped after revealTime
      setTimeout(() => {
        setStartTimer(true); // Start the timer after the cards are flipped
      }, 1000);
    }, revealTime);

    // Clean up timer on component unmount or when revealTime changes
    return () => clearTimeout(timer);
  }, [revealTime, setFlipAll, setStartTimer]);
}