import Link from 'next/link';

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-6 text-blue-800">Welcome to MemFlip!</h1>
      <div className="space-y-4">
        <Link href="/gameplay">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700">
            Start Game
          </button>
        </Link>
        <button className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg shadow-lg hover:bg-gray-400">
          Exit
        </button>
      </div>
    </div>
  );
}
