'use client';

import {useState, useEffect } from 'react';
import { generateGrid } from './generateGrid';
import { initialFlip } from './initialFlip';
import ExitButton from './exit-button';
import Card from './card';
import { CardState, handleCardFlip } from './flipLogic';
import Timer from './timer';

export default function GameplayPage() {
  const numPairs = 6; // Number of pairs of cards
  const revealTime = 2000; // Time to reveal all cards at the beginning
  const timeLimit = 30; // Total time in seconds
  const [matchedPairs, setMatchedPairs] = useState(0); // Initially all cards not matched
  const [disabled, setDisabled] = useState(false); // Initially all cards not disabled
  const [isGameOver, setIsGameOver] = useState(false); // Initially game not over

  // Generate grid only once when the component mounts
  const [gridItems, setGridItems] = useState<number[]>([]);
  const [cardStates, setCardStates] = useState<CardState[]>([]);
  const [flippedCards, setFlippedCards] = useState<{index: number, image: number}[]>([]);

  useEffect(() => {
    setGridItems(generateGrid(numPairs));
  }, [numPairs]);

  // Initialize card states
  useEffect(() => {
    setCardStates(gridItems.map(() => ({flipped: false, matched: false, vibrating: false})));
  }, [gridItems]);

  // Start with cards revealed
  const[flipAll, setFlipAll] = useState(false);
  // Call initialFlip when the component mounts
  initialFlip(revealTime, setFlipAll);

  useEffect(() => {
    if(flipAll){
      setCardStates((prevCardStates) =>
        prevCardStates.map((card) => ({...card, flipped: true}))
      );
    }
  }, [flipAll]);

  // End game condition
  const checkEndGame = (reason: string) => {
    setIsGameOver(true);
    if(reason === 'time'){
      window.alert(`Time's up! You matched ${matchedPairs} pairs.`);
    } else if (reason === 'win'){
      window.alert(`Congratulations! You matched all pairs in ${timeLimit} seconds.`);
    }
  };

  useEffect(() => {
    if(matchedPairs === numPairs){
      checkEndGame('win');
    }
  }, [matchedPairs, numPairs,isGameOver]);

  const handleTimeUp = () => {
    if(!isGameOver){
      checkEndGame('time');
    }
  };


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Taskbar */}
      <header className="flex justify-between items-center bg-gray-300 px-6 py-4 shadow">
        <div className="flex items-center">
          <img src="https://via.placeholder.com/50" alt="MemFlip" className="rounded-full" />
          <h1 className="ml-4 text-xl font-bold text-gray-700">MemFlip</h1>
        </div>
        <div className="text-xl font-semibold text-gray-700">Score: 0</div> 
        <ExitButton />
      </header>

      {/* Timer */}
      {!isGameOver && (
        <Timer timeLimit={timeLimit} onTimeUp={handleTimeUp} isGameOver={isGameOver} />
      )}

      {/* Gameplay Grid */}
      <main className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 p-10 place-content-center"
      style ={{
        gridTemplateColumns: "repeat(7, minmax(60px, 1fr))",
        gridTemplateRows: 'repeat(autofill, minmax(60px, 1fr))',
      }}>
        {gridItems.map((image, index) => (
          <Card 
          key={index} 
          index={index}
          image={image}
          {...cardStates[index]}
          allFlipped={flipAll}
          disabled={disabled}
          onFlip={() => handleCardFlip(
            index,
            image,
            flippedCards,
            setFlippedCards,
            cardStates,
            setCardStates,
            matchedPairs,
            setMatchedPairs,
            disabled,
            setDisabled,
          )}
          />
        ))}
      </main>
    </div>
  );
}
