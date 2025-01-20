'use client';

import {useState, useEffect, useRef } from 'react';
import { generateGrid } from './generateGrid';
import { initialFlip } from './initialFlip';
import ExitButton from './exit-button';
import Card from './card';
import { CardState, handleCardFlip } from './flipLogic';
import Timer from './timer';
import { useSearchParams, useRouter } from 'next/navigation';

export default function GameplayPage() {
  const router = useRouter();

  const numPairs = 6; // Number of pairs of cards
  const revealTime = 2000; // Time to reveal all cards at the beginning
  const timeLimit = 15; // Total time in seconds
  const [matchedPairs, setMatchedPairs] = useState(0); // Initially all cards not matched
  const [disabled, setDisabled] = useState(false); // Initially all cards not disabled
  const [isGameOver, setIsGameOver] = useState(false); // Initially game not over
  const [timeLeft, setTimeLeft] = useState(timeLimit); // Track remaining time

  // Generate grid only once when the component mounts
  const [gridItems, setGridItems] = useState<number[]>([]);
  const [cardStates, setCardStates] = useState<CardState[]>([]);
  const [flippedCards, setFlippedCards] = useState<{index: number, image: number}[]>([]);

  const images = {
    Choice1: [
        { src: '/images/choice1/c1.png', caption: 'Tonga' },
        { src: '/images/choice1/c2.png', caption: 'Somalia' },
        { src: '/images/choice1/c3.png', caption: 'Bulgaria' },
        { src: '/images/choice1/c4.png', caption: 'Vietnam' },
        { src: '/images/choice1/c5.png', caption: 'Madagascar' },
        { src: '/images/choice1/c6.png', caption: 'Canada' },
    ],
    Choice2: [
        { src: '/images/choice2/c1.png', caption: 'Marill' },
        { src: '/images/choice2/c2.png', caption: 'Charizard' },
        { src: '/images/choice2/c3.png', caption: 'Bellsprout' },
        { src: '/images/choice2/c4.png', caption: 'Skuntank' },
        { src: '/images/choice2/c5.png', caption: 'Turtonator' },
        { src: '/images/choice2/c6.png', caption: 'Glalie' },
    ],

    Choice3: [
        { src: '/images/choice3/c1.png', caption: 'Architect' },
        { src: '/images/choice3/c2.png', caption: 'Advocate' },
        { src: '/images/choice3/c3.png', caption: 'Consul' },
        { src: '/images/choice3/c4.png', caption: 'Entertainer' },
        { src: '/images/choice3/c5.png', caption: 'Mediator' },
        { src: '/images/choice3/c6.png', caption: 'Logistician' },
    ],
  };
  const searchParams = useSearchParams();
  const choice = searchParams.get('choice'); // Get the selected choice from query params
  const choiceImages = images[choice as 'Choice1' | 'Choice2' | 'Choice3'] ?? images['Choice1']; 


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

  const matchedPairsRef = useRef(matchedPairs);
  useEffect(() => {
    matchedPairsRef.current = matchedPairs;
  }, [matchedPairs]);

  // End game condition
  const checkEndGame = (reason: string, matchedPairs :number, router: ReturnType<typeof useRouter>) => {
    setIsGameOver(true);
    if(reason === 'time'){
      window.alert(`Time's up! You matched ${matchedPairs} pairs.`);
    } else if (reason === 'win'){
      window.alert(`Congratulations! You matched all pairs in ${timeLimit-timeLeft} seconds.`);
    }
    router.push(`/stage2?choice=${choice}`)
  };

  useEffect(() => {
    if(matchedPairs === numPairs){
      checkEndGame('win', matchedPairs, router);
    }
  }, [matchedPairs, numPairs,isGameOver]);

  const handleTimeUp = () => {
    if(!isGameOver){
      console.log("Current matches: ", matchedPairsRef.current)
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
        />
      )}

      {/* Gameplay Grid */}
      <main className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 p-10 place-content-center"
      style ={{
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
            index={index}
            image={choiceImage.src}
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
