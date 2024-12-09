'use client';

import { useEffect } from 'react';

export function initialFlip(revealTime: number, setFlipAll: React.Dispatch<React.SetStateAction<boolean>>) {
  useEffect(() => {
    const timer = setTimeout(() => {
      setFlipAll(true); // Set the cards to be flipped after revealTime
    }, revealTime);

    // Clean up timer on component unmount or when revealTime changes
    return () => clearTimeout(timer);
  }, [revealTime, setFlipAll]);
}