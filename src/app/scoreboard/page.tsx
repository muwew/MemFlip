'use client';

import { useScore } from '../context/scoreContext';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

function ScoreboardContents() {
    const { scores } = useScore();
    const router = useRouter();

    const handleNext = () => {
        router.push('/final');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Overall Scoreboard</h1>
            <div className="w-full max-w-md text-gray-800">

                <div className="border-b py-2">
                    <h2 className="font-semibold text-gray-800">Player details</h2>
                    <p>Name: {scores.playerName?.name}</p>
                    <p>Matriculation Number: {scores.matrixNumber?.mNumber}</p>
                </div>

                {/* Display Game Mode */}
                <div className="border-b py-2">
                    <h2 className="font-semibold text-gray-800">Game Mode</h2>
                    <p>{scores.mode?.gameMode ? (scores.mode.gameMode === 'easy' ? 'Mode 1' : 'Mode 2') : 'N/A'}</p>
                </div>

                <div className="border-b py-2">
                    <h2 className="font-semibold text-gray-800">Stage 1</h2>
                    <p>Time Taken: {scores.stage1?.timeTaken} seconds</p>
                    <p>Pairs Matched: {scores.stage1?.pairsMatched}</p>
                </div>
                <div className="border-b py-2">
                    <h2 className="font-semibold text-gray-800">Stage 2</h2>
                    <p>Time Taken: {scores.stage2?.timeTaken} seconds</p>
                </div>
                <div className="border-b py-2">
                    <h2 className="font-semibold text-gray-800">Stage 3</h2>
                    <p>Correct Answers: {scores.stage3?.correctAnswers}</p>
                </div>
                <div className="border-b py-2">
                    <h2 className="font-semibold text-gray-800">Stage 4</h2>
                    <p>Correct Positions: {scores.stage4?.correctPositions}%</p>
                </div>
                <div className="py-2">
                    <h2 className="font-semibold text-gray-800">Stage 5</h2>
                    <p>Time Taken: {scores.stage5?.timeTaken} seconds</p>
                    <p>Moves: {scores.stage5?.moves}</p>
                    <p>Resets: {scores.stage5?.resets}</p>
                    <p>Concedes: {scores.stage5?.conceded  ? (scores.stage5?.conceded === true ? 'true' : 'false'): 'false'}</p>
                </div>

                <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

export default function ScoreboardPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            < ScoreboardContents/>
        </Suspense>
    );
}