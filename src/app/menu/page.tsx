'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useScore } from '../context/scoreContext'; // Import the score context

export default function MenuPage() {
  const router = useRouter();
  const { updateScore } = useScore(); // Get the updateScore function from context

  const [gameMode, setGameMode] = useState<string | null>(null);

  const handleModeSelection = (mode: string) => {
    setGameMode(mode);
    updateScore('mode', { gameMode: mode }); // Store mode in the score context
  };

  const handleChoice = (choice: string) => {
    if (!gameMode) return;
    router.push(`/instructions?choice=${choice}`);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-6 text-blue-800">Welcome to MemFlip!</h1>

      {!gameMode ? (
        <div className="space-y-4">
          <button
            onClick={() => handleModeSelection('easy')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-300"
          >
            Mode 1
          </button>

          <button
            onClick={() => handleModeSelection('hard')}
            className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-300"
          >
            Mode 2
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-lg font-semibold text-gray-700 mb-4">
            Selected Mode: <span className="text-blue-600">{gameMode === 'easy' ? 'Mode 1' : 'Mode 2'}</span>
          </p>

          <button
            onClick={() => handleChoice('Choice1')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700"
          >
            Choice 1
          </button>

          <button
            onClick={() => handleChoice('Choice2')}
            className="px-6 py-3 bg-yellow-600 text-white rounded-lg shadow-lg hover:bg-yellow-700"
          >
            Choice 2
          </button>

          <button
            onClick={() => handleChoice('Choice3')}
            className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700"
          >
            Choice 3
          </button>

          <button
            onClick={() => setGameMode(null)}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-600"
          >
            Back to Mode Selection
          </button>

          <button className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg shadow-lg hover:bg-gray-400">
            Exit
          </button>
        </div>
      )}
    </div>
  );
}
