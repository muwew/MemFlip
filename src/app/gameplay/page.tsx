'use client';

import {useState, useEffect } from 'react';
import { generateGrid } from './generateGrid';
import { initialFlip } from './initialFlip';
import ExitButton from './exit-button';
import Card from './card';
import { init } from 'next/dist/compiled/webpack/webpack';

export default function GameplayPage() {
  const numPairs = 10; // Number of pairs of cards
  const revealTime = 2000; // Time to reveal all cards at the beginning

  // Generate grid only once when the component mounts
  const [gridItems, setGridItems] = useState<number[]>([]);
  useEffect(() => {
    setGridItems(generateGrid(numPairs));
  }, [numPairs]);

  // Start with cards revealed
  const[flipAll, setFlipAll] = useState(false);

  // Call initialFlip when the component mounts
  initialFlip(revealTime, setFlipAll);

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
      <section className="bg-red-500 h-2 my-4">
        <div id="timer-bar" className="bg-green-500 h-full w-1/2"></div>
      </section>

      {/* Gameplay Grid */}
      <main className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 p-10 place-content-center"
      style ={{
        gridTemplateColumns: "repeat(7, minmax(60px, 1fr))",
        gridTemplateRows: 'repeat(autofill, minmax(60px, 1fr))',
      }}>
        {gridItems.map((image, index) => (
          <Card key={index} image={image} allFlipped={flipAll}/>
        ))}
      </main>
    </div>
  );
}
