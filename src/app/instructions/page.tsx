'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

function InstructionsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const choice = searchParams.get('choice'); // Get the selected choice from query params
    const gameMode = searchParams.get('mode'); // Get the selected game mode from query params

    const [showExplanation, setShowExplanation] = useState(true); // Show explanation modal
    const [nextPhase, setNextPhase] = useState(false); // Show next phase modal

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            {showExplanation && (
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to MemFlip!</h1>
                    <p className="text-gray-700 mb-6">
                        In MemFlip, you will be tested on your cognitive ability skills through a series of stages of gameplay. 
                        Be sure to follow the instructions carefully and raise any questions you may have to the organiser.     
                    </p>    

                    <button
                        onClick={() => {
                            setShowExplanation(false);
                            setNextPhase(true);
                        }}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
                    >
                        Continue
                    </button>
                </div>
            )}

            {nextPhase && (
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Stage 1: Instructions</h1>
                    <p className="text-gray-700 mb-6">
                        In Stage 1, you will be shown cards with images for a brief moment before they are flipped over. 
                        Your goal is to match as many pairs as possible within the given time limit. 
                    </p>
                    <button
                        onClick={() => router.push(`/stage1?choice=${choice}&mode=${gameMode}`)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
                    >
                        Start Game
                    </button>
                </div>
            )}
        </div>
    );
}

export default function InstructionsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <InstructionsContent />
        </Suspense>
    );
}
