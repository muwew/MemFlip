'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MenuPage() {
  const router = useRouter();

  const handleChoice = (choice: string) => {
    router.push(`/stage1?choice=${choice}`)
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-6 text-blue-800">Welcome to MemFlip!</h1>
      <div className="space-y-4">
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

        {/* <Link href="/gameplay">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700">
            Start Game
          </button>
        </Link> */}
        <button className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg shadow-lg hover:bg-gray-400">
          Exit
        </button>
      </div>
    </div>
  );
}
