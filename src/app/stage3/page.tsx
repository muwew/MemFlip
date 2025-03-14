'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { answers as answerKey } from './answerKey';
import {useScore} from '../context/scoreContext';

function Stage3Contents() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const choice = searchParams.get('choice'); // Get the selected choice from query params
    const { scores } = useScore();
    const gameMode = scores.mode?.gameMode; // Get gameMode directly from the ScoreContext

    // Default time in seconds to display the image: easy mode
    let showTime = 30;

    if (gameMode === 'hard') {
        showTime = 20;
    }

    // Images for Stage 2 based on choice
    const images = {
        Choice1: '/images/choice1/s1.jpg',
        Choice2: '/images/choice2/s2.jpg',
        Choice3: '/images/choice3/s3.png',
    };

    const selectedImage = images[choice as 'Choice1' | 'Choice2' | 'Choice3'] ?? images['Choice1'];
    const correctAnswers = answerKey[choice as 'Choice1' | 'Choice2' | 'Choice3'] ?? answerKey['Choice1'];
    const numAnswers = correctAnswers.length; // Number of answers to be filled
    const [stage3Score, setStage3Score] = useState<number | null>(null);

    // States
    const [showExplanation, setShowExplanation] = useState(true); // Show explanation modal
    const [showImage, setShowImage] = useState(false); // Show the image
    const [showQuestions, setShowQuestions] = useState(false); // Show the questions
    const [answers, setAnswers] = useState<string[]>(Array(numAnswers).fill('')); // Store user-provigded answers

    // Handle "Continue" button click in the explanation modal
    const handleContinue = () => {
        setShowExplanation(false); // Hide the explanation modal
        setShowImage(true); // Show the image

        // Hide the image and show questions after `showTime` seconds
        setTimeout(() => {
            setShowImage(false);
            setShowQuestions(true);
        }, showTime * 1000);
    };

    const handleInputChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const {updateScore} = useScore();
    const handleSubmit = () => {
        const confirmed = confirm('Are you ready to continue?');
        if (confirmed) {
            const score = calculateScore(answers, correctAnswers);
            console.log(score);
            setShowQuestions(false);
            setStage3Score(score);

            updateScore('stage3', {correctAnswers: score});
        }
    };

    const handleNext = () => {
        router.push(`/stage4?choice=${choice}`); // Navigate to Stage 4
    };

    const calculateScore = (userAnswers: string[], correctAnswers: string[]) => {
        let score = 0;
        const normalizedCorrectAnswers = new Set(correctAnswers.map(answer => answer.toLowerCase())); 
        const usedAnswers = new Set(); // Track used correct answers
    
        userAnswers.forEach((answer) => {
            const normalizedAnswer = answer.trim().toLowerCase();
            if (normalizedCorrectAnswers.has(normalizedAnswer) && !usedAnswers.has(normalizedAnswer)) {
                score += 1;
                usedAnswers.add(normalizedAnswer); // Mark this answer as used
            }
        });
    
        return score;
    };
    
    

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            {/* Explanation Modal */}
            {showExplanation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg text-center">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Stage 3: Instructions</h2>
                        <p className="text-gray-700 mb-6">
                            An image containing labels will be shown for {showTime} seconds, before being hidden. Your task is to memorise as many of 
                            the names as possible, and repeat them in a following memorisation task. After you have entered your 
                            answers to the best of your abilities, you can then submit them to proceed to the next stage.
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

            {/* Image Display */}
            {showImage && (
                <img
                    src={selectedImage}
                    alt="Stage 2 Scenario"
                    className="w-2/5 object-contain mb-6 border rounded-lg shadow-lg"
                />
            )}

            {/* Questions and Answer Boxes */}
            {showQuestions && (
                <div className="w-full max-w-3xl space-y-6">
                    <h1 className="text-2xl font-bold mb-4 text-gray-800">Stage 3: Mass Memorisation</h1>
                    <p className="text-gray-700 mb-5 italic">
                            *The answers need not be in order
                        </p>
                    {Array(numAnswers)
                        .fill(null)
                        .map((_, index) => (
                            <div key={index} className="flex flex-col space-y-2">
                                <label className="text-lg font-semibold text-gray-800">Answer {index + 1}:</label>
                                <input
                                    type="text"
                                    value={answers[index]}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    className="px-4 py-2 border rounded-lg shadow-sm text-gray-800"
                                    placeholder="Enter your answer"
                                />
                            </div>

                    ))}
                    <button
                        onClick={handleSubmit}
                        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
                    >
                        Submit
                    </button>
                </div>
            )}

            {stage3Score !== null && (
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Stage 3 Completed</h2>
                    <p className="text-lg text-gray-700 mb-4">Your Score: {stage3Score}</p>
                    <button
                        onClick={handleNext}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
                    >
                        Continue to Next Stage
                    </button>
                </div>
            )}
        </div>
    );
}

export default function Stage3Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            < Stage3Contents/>
        </Suspense>
    );
}