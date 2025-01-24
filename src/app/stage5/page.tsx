'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const images = {
    Choice1: '/images/choice1/c7.png',
    Choice2: '/images/choice2/c7.png',
    Choice3: '/images/choice3/c7.png',
};

export default function Stage5Page() {
    const searchParams = useSearchParams();
    const choice = searchParams.get('choice');
    const imageSrc = images[choice as 'Choice1' | 'Choice2' | 'Choice3'] ?? images['Choice1'];

    const gridSize = 3; // 3x3 grid
    const totalTiles = gridSize * gridSize - 1; // 8 tiles + 1 empty space

    const [tiles, setTiles] = useState<(number | null)[]>([]);
    const [emptyIndex, setEmptyIndex] = useState<number>(totalTiles); // Bottom-right is empty initially
    const [moves, setMoves] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const shuffledTiles = shuffleArray([...Array(totalTiles).keys()]);
        setTiles([...shuffledTiles, null]); // Add the empty space
        setStartTime(Date.now());
    }, []);

    useEffect(() => {
        if (!completed) {
            const timer = setInterval(() => {
                if (startTime) {
                    setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [startTime, completed]);

    function shuffleArray(array: number[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const handleTileClick = (index: number) => {
        const validMoves = getValidMoves(emptyIndex);

        if (validMoves.includes(index)) {
            const newTiles = [...tiles];
            newTiles[emptyIndex] = newTiles[index];
            newTiles[index] = null;

            setTiles(newTiles);
            setEmptyIndex(index);
            setMoves((prevMoves) => prevMoves + 1);

            if (checkWin(newTiles)) {
                setCompleted(true);
            }
        }
    };

    const getValidMoves = (emptyIndex: number) => {
        const row = Math.floor(emptyIndex / gridSize);
        const col = emptyIndex % gridSize;
        const moves = [];

        if (row > 0) moves.push(emptyIndex - gridSize);
        if (row < gridSize - 1) moves.push(emptyIndex + gridSize);
        if (col > 0) moves.push(emptyIndex - 1);
        if (col < gridSize - 1) moves.push(emptyIndex + 1);

        return moves;
    };

    const checkWin = (tiles: (number | null)[]) => {
        for (let i = 0; i < totalTiles; i++) {
            if (tiles[i] !== i) return false;
        }
        return true;
    };

    const handleReset = () => {
        const shuffledTiles = shuffleArray([...Array(totalTiles).keys()]);
        setTiles([...shuffledTiles, null]);
        setEmptyIndex(totalTiles);
        setCompleted(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Stage 5: Sliding Tile Puzzle</h1>
            {completed ? (
                <div className="text-center">
                    <p className="text-lg text-green-600 mb-4">Congratulations! You solved the puzzle!</p>
                    <p className="text-gray-700 mb-2">Time Taken: {elapsedTime} seconds</p>
                    <p className="text-gray-700 mb-4">Moves: {moves}</p>
                    <button
                        onClick={handleReset}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
                    >
                        Play Again
                    </button>
                </div>
            ) : (
                <div>
                    <div className="grid grid-cols-3 gap-2 w-[300px] h-[300px]">
                        {tiles.map((tile, index) => (
                            <div
                                key={index}
                                className={`w-full h-full flex items-center justify-center border ${
                                    tile === null ? 'bg-gray-400' : 'bg-white-200'
                                } cursor-pointer`}
                                onClick={() => handleTileClick(index)}
                                style={
                                    tile !== null
                                        ? {
                                              backgroundImage: `url(${imageSrc})`,
                                              backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                                              backgroundPosition: `${
                                                  (tile % gridSize) * (100 / (gridSize - 1))
                                              }% ${(Math.floor(tile / gridSize) * (100 / (gridSize - 1)))}%`,
                                              width: '100%',
                                              height: '100%',
                                          }
                                        : { width: '100%', height: '100%' }
                                }
                            />
                        ))}
                    </div>
                    <p className="text-gray-700 mt-4">Moves: {moves}</p>
                    <p className="text-gray-700">Time: {elapsedTime} seconds</p>
                    <button
                        onClick={handleReset}
                        className="mt-4 px-6 py-3 bg-gray-400 text-white rounded-lg shadow-lg hover:bg-gray-500"
                    >
                        Reset
                    </button>
                </div>
            )}
        </div>
    );
}
