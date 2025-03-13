'use client';

import { useState, useEffect, useRef } from 'react';
import { generateGrid } from './generateGrid';
import { useInitialFlip } from './useInitialFlip';
import ExitButton from './exit-button';
import Card from './card';
import { CardState, handleCardFlip } from './flipLogic';
import Timer from './timer';
import { useSearchParams, useRouter } from 'next/navigation';
import { images } from '../resources/choiceImage';
import { useScore } from '../context/scoreContext';

export default function GameplayPage() {
  const router = useRouter();

  const numPairs = 6; // Number of pairs of cards
  const [matchedPairs, setMatchedPairs] = useState(0); // Initially all cards not matched
  const [disabled, setDisabled] = useState(false); // Initially all cards not disabled
  const [isGameOver, setIsGameOver] = useState(false); // Initially game not over
  // const [isTimerActive, setIsTimerActive] = useState(false); 

  // Generate grid only once when the component mounts
  const [gridItems, setGridItems] = useState<number[]>([]);
  const [cardStates, setCardStates] = useState<CardState[]>([]);
  const [flippedCards, setFlippedCards] = useState<{ index: number, image: number }[]>([]);

  const searchParams = useSearchParams();
  const choice = searchParams.get('choice'); // Get the selected choice from query params
  const { scores } = useScore();
  const gameMode = scores.mode?.gameMode; // Get gameMode directly from the ScoreContext
  const choiceImages = images[choice as 'Choice1' | 'Choice2' | 'Choice3'] ?? images['Choice1'];

  // Default reveal time and time limit: easy mode
  let revealTime = 2000; // Time to reveal all cards at the beginning
  let timeLimit = 15; // Total time in seconds

  if (gameMode === 'hard') {
    revealTime = 2000;
    timeLimit = 10;
  }
  const [timeLeft, setTimeLeft] = useState(timeLimit); // Track remaining time

  useEffect(() => {
    setGridItems(generateGrid(numPairs));
  }, [numPairs]);

  // Initialize card states
  useEffect(() => {
    setCardStates(gridItems.map(() => ({ flipped: false, matched: false, vibrating: false })));
  }, [gridItems]);

  // Start with cards revealed
  // const [flipAll, setFlipAll] = useState(false);
  // Call initialFlip when component mounts
  const { flipAll, isTimerActive } = useInitialFlip(revealTime);


  useEffect(() => {
    if (flipAll) {
      setCardStates((prevCardStates) =>
        prevCardStates.map((card) => ({ ...card, flipped: true }))
      );
    }
  }, [flipAll]);

  const matchedPairsRef = useRef(matchedPairs);
  useEffect(() => {
    matchedPairsRef.current = matchedPairs;
  }, [matchedPairs]);

  // End game condition
  const { updateScore } = useScore();
  const checkEndGame = (reason: string, matchedPairs: number, router: ReturnType<typeof useRouter>) => {
    setIsGameOver(true);

    const timeTaken = timeLimit - timeLeft; // Calculate time taken
    console.log("Time left: ", timeLeft);
    console.log("Time taken: ", timeTaken);
    if (reason === 'time') {
      window.alert(`Time's up! You matched ${matchedPairs} pairs.`);
      // Update score
      updateScore('stage1', { pairsMatched: matchedPairs, timeTaken: timeLimit });
    } else if (reason === 'win') {
      window.alert(`Congratulations! You matched all pairs in ${timeTaken} seconds.`);
      // Update score
      updateScore('stage1', { pairsMatched: matchedPairs, timeTaken: timeTaken });
    }

    // Redirect to next stage
    router.push(`/stage2?choice=${choice}`);
  };

  useEffect(() => {
    if (matchedPairs === numPairs) {
      checkEndGame('win', matchedPairs, router);
    }
  }, [matchedPairs, numPairs, isGameOver]);

  const handleTimeUp = () => {
    if (!isGameOver) {
      console.log("Current matches: ", matchedPairsRef.current);
      setIsGameOver(true); // Ensure game stops immediately
      checkEndGame('time', matchedPairsRef.current, router);
    }
  };

  const handleTimeUpdate = (remainingTime: number) => {
    setTimeLeft(remainingTime); // Update `timeLeft` in parent state
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Taskbar */}
      <header className="flex justify-between items-center bg-gray-300 px-6 py-4 shadow">
        <div className="flex items-center">
          <img src="https://via.placeholder.com/50" alt="MemFlip" className="rounded-full" />
          <h1 className="ml-4 text-xl font-bold text-gray-700">MemFlip</h1>
        </div>
        <div className="text-xl font-semibold text-gray-700">Score: {matchedPairs}</div>
        <ExitButton />
      </header>

      {/* Timer */}
      {!isGameOver && (
        <Timer timeLimit={timeLimit}
          onTimeUp={handleTimeUp}
          isGameOver={isGameOver}
          onTimeUpdate={handleTimeUpdate}
          isTimerActive={isTimerActive}
        />
      )}

      {/* Gameplay Grid */}
      <main className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 p-10 place-content-center"
        style={{
          gridTemplateColumns: "repeat(7, minmax(60px, 1fr))",
          gridTemplateRows: 'repeat(autofill, minmax(60px, 1fr))',
        }}>
        {gridItems.map((item, index) => {
          const imageIndex = item - 1; // Convert one-based to zero-based index
          const choiceImage = choiceImages[imageIndex]; // Get the corresponding image object

          // Defensive check to avoid accessing undefined images
          if (!choiceImage) {
            console.error(`Image not found for grid item: ${item}`);
            return null;
          }

          return (
            <Card
              key={index}
              image={choiceImage.src}
              caption={choiceImage.caption}
              {...cardStates[index]}
              allFlipped={flipAll}
              disabled={disabled}
              onFlip={() =>
                handleCardFlip(
                  index,
                  item, // Pass the actual grid item (not index)
                  flippedCards,
                  setFlippedCards,
                  cardStates,
                  setCardStates,
                  matchedPairs,
                  setMatchedPairs,
                  disabled,
                  setDisabled,
                )
              }
            />
          );
        })}
      </main>
    </div>
  );
}
