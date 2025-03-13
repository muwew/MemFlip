'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {useScore} from '../context/scoreContext';

const images = {
    Choice1: '/images/choice1/c7.png',
    Choice2: '/images/choice2/c7.png',
    Choice3: '/images/choice3/c7.png',
};

export default function Stage5Page() {
    const searchParams = useSearchParams();
    const choice = searchParams.get('choice');
    const { scores } = useScore();
    const gameMode = scores.mode?.gameMode; // Get gameMode directly from the ScoreContext
    const imageSrc = images[choice as 'Choice1' | 'Choice2' | 'Choice3'] ?? images['Choice1'];

    // Default grid size: easy mode
    let gridSize = 3; // 3x3 grid

    if (gameMode === 'hard') {
        gridSize = 4; // 4x4 grid
    }

    const tileSize = 100 / gridSize; // Percentage size of each tile
    const totalTiles = gridSize * gridSize - 1; // 8 tiles + 1 empty space

    const [tiles, setTiles] = useState<(number | null)[]>([]);
    const [emptyIndex, setEmptyIndex] = useState<number>(totalTiles); // Bottom-right is empty initially
    const [moves, setMoves] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true);
    const [resets, setResets] = useState(0);
    const router = useRouter();

    useEffect(() => {
        generateSolvablePuzzle();
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

    function shuffleArray(array: number[]): number[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function countInversions(array: number[]): number {
        let inversions = 0;
        for (let i = 0; i < array.length; i++) {
            for (let j = i + 1; j < array.length; j++) {
                if (array[i] !== null && array[j] !== null && array[i] > array[j]) {
                    inversions++;
                }
            }
        }
        return inversions;
    }

    function isSolvable(array: (number | null)[]): boolean {
        const flatTiles = array.filter((tile) => tile !== null) as number[]; // Exclude the empty space
        const inversions = countInversions(flatTiles);

        if (gridSize % 2 === 1) {
            // Odd grid size: solvable if inversions are even
            return inversions % 2 === 0;
        } else {
            // Even grid size: consider the empty tile's position
            const emptyRowFromBottom = gridSize - Math.floor(array.indexOf(null) / gridSize);
            return (
                (inversions % 2 === 0 && emptyRowFromBottom % 2 === 1) || // Even inversions + odd row
                (inversions % 2 === 1 && emptyRowFromBottom % 2 === 0)    // Odd inversions + even row
            );
        }
    }

    function generateSolvablePuzzle() {
        let shuffledTiles: (number | null)[];
        do {
            const tilesArray = shuffleArray([...Array(totalTiles).keys()]);
            shuffledTiles = [...tilesArray, null]; // Add the empty space
        } while (!isSolvable(shuffledTiles)); // Ensure the puzzle is solvable
        setTiles(shuffledTiles);
        setEmptyIndex(totalTiles);
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
        generateSolvablePuzzle();
        setResets((prevResets) => prevResets + 1);
        setMoves(0);
        setElapsedTime(0);
        setCompleted(false);
        setStartTime(Date.now());
    };

    const handleContinue = () => {
        setShowInstructions(false);
        setStartTime(Date.now());
    };

    // Navigate to the scoreboard page
    const {updateScore} = useScore();
    const handleNext = () => {
        updateScore('stage5', {timeTaken: elapsedTime, moves: moves, resets: resets, conceded: false});
        router.push(`/scoreboard?choice=${choice}`);
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            {/* Instructions Modal */}
            {showInstructions && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg text-center relative">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Stage 5: Instructions</h2>
                        <p className="text-gray-700 mb-6">
                            In stage 5, an image will be shown in a {gridSize}x{gridSize} grid with one empty space. 
                            Your task is to slide the tiles to rearrange them in the correct order.
                        </p>
                        <button
                            onClick={handleContinue}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            <h1 className="text-2xl font-bold mb-4 text-gray-800">Stage 5: Sliding Tile Puzzle</h1>
            {completed ? (
                <div className="text-center">
                    <p className="text-lg text-green-600 mb-4">Congratulations! You solved the puzzle!</p>
                    <p className="text-gray-700 mb-2">Time Taken: {elapsedTime} seconds</p>
                    <p className="text-gray-700 mb-4">Moves: {moves}</p>
                    <button
                        onClick={handleNext}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
                    >
                        Continue
                    </button>
                </div>
            ) : (
                <div>
                    <div className="relative w-[500px] h-[500px] border">
                        {tiles.map((tile, index) => {
                            const row = Math.floor(index / gridSize);
                            const col = index % gridSize;

                            return (
                                <div
                                    key={index}
                                    className={`absolute flex items-center justify-center border bg-gray-200 cursor-pointer transition-transform duration-300 ${
                                        tile === null ? 'bg-gray-400' : ''
                                    }`}
                                    onClick={() => handleTileClick(index)}
                                    style={{
                                        width: `${tileSize}%`,
                                        height: `${tileSize}%`,
                                        transform: `translate(${col * 100}%, ${row * 100}%)`,
                                        backgroundImage: tile !== null ? `url(${imageSrc})` : undefined,
                                        backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                                        backgroundPosition:
                                            tile !== null
                                                ? `${
                                                      (tile % gridSize) * (100 / (gridSize - 1))
                                                  }% ${(Math.floor(tile / gridSize) * (100 / (gridSize - 1)))}%`
                                                : undefined,
                                    }}
                                >
                                    {/* Number label in the top-right corner */}
                                    {tile !== null && (
                                        <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                            {tile + 1}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-gray-700 mt-4">Moves: {moves}</p>
                    <p className="text-gray-700">Time: {elapsedTime} seconds</p>
                    <button
                        onClick={handleReset}
                        className="mt-4 px-6 py-3 bg-gray-400 text-white rounded-lg shadow-lg hover:bg-gray-500"
                    >
                        Reset
                    </button>

                    <button

                    onClick={() => {
                        if (window.confirm("Are you sure you want to concede? This will be marked as the puzzle not being completed. However, this won't affect your study results.")) {
                            updateScore('stage5', { timeTaken: elapsedTime, moves: moves, resets: resets, conceded: true });
                            router.push(`/scoreboard?choice=${choice}`);
                        }
                    }}
                    className="mt-4 ml-2 px-6 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700"
                    >
                        Concede
                    </button>
                    </div>
            )}
        </div>
    );
}
