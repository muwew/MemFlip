'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {images} from '../resources/choiceImage';
import {useScore} from '../context/scoreContext';

export default function Stage2Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const choice = searchParams.get('choice'); // Get the selected choice from query params
    const [showExplanation, setShowExplanation] = useState(true); // Show explanation modal
    const [nextPhase, setNextPhase] = useState(false); // Show next phase modal
    const [memorizing, setMemorizing] = useState(true); // Track phase: memorizing or answering
    const [startTime, setStartTIme] = useState<number | null>(null); // Start time of phase 2
    const choiceImages = images[choice as 'Choice1' | 'Choice2'] ?? images['Choice1']; // Default to Choice1 if no valid choice

    const handleContinue = () => {
        const confirmed = confirm('Are you ready to proceed to the next phase?');
        if (confirmed) setMemorizing(false); // Proceed to the answering phase
    };

    const handleContinue2 = () => {
        setShowExplanation(false);
        setStartTIme(Date.now());
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            {/* Taskbar
            <header className="flex justify-between items-center bg-gray-300 px-6 py-4 shadow">
                <div className="flex items-center">
                    <img src="https://via.placeholder.com/50" alt="MemFlip" className="rounded-full" />
                    <h1 className="ml-4 text-xl font-bold text-gray-700">MemFlip</h1>
                </div>
                <ExitButton />
            </header> */}

            {/* Explanation Modal */}
            {showExplanation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg text-center">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Stage 2: Instructions</h2>
                        <p className="text-gray-700 mb-6">
                            Images along with their names will be shown, and it is your task to memorise them. 
                            Once memorised, you'll have to use the information to answer questions. 
                        </p>
                        <button
                            onClick={handleContinue2}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}


            <h1 className="text-2xl font-bold mb-4 text-gray-800">Stage 2: Name recognition</h1>
            {memorizing && (
                <div className="grid grid-cols-3 gap-10 mb-10">
                    {choiceImages.map((img, index) => (
                        <div key={index} className="flex flex-col items-center w-48 h-48">
                            <img
                                src={img.src}
                                alt={img.caption}
                                className="w-50 h-48 object-contain border border-lg-800 shadow-lg"
                            />
                            <p className="text-m text-gray-800 mt-2">{img.caption}</p>
                        </div>
                    ))}
                </div>
            )}

            {memorizing ? (
                <button
                    onClick={handleContinue}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
                >
                    Continue
                </button>
            ) : (
                <AnsweringPhase
                    images={choiceImages}
                    onBack={() => setMemorizing(true)} // Go back to memorization phase
                    onComplete={() => router.push(`/stage3?choice=${choice}`)} // Navigate to Stage 2
                />
            )}
        </div>
    );

    interface Image {
        src: string;
        caption: string;
    }

    interface AnsweringPhaseProps {
        images: Image[];
        onBack: () => void;
        onComplete: () => void;
    }

    function AnsweringPhase({ images, onBack, onComplete }: AnsweringPhaseProps) {
        // Shuffle images once during the answering phase
        const [shuffledImages] = useState(() =>
            images
                .slice()
                .sort(() => Math.random() - 0.5) // Shuffle the array
        );

        const [answers, setAnswers] = useState(Array(images.length).fill('')); // Store player answers
        const [isCorrectArray, setIsCorrectArray] = useState(Array(images.length).fill(false)); // Track correctness of answers

        const handleChange = (index: number, value: string) => {
            const newAnswers = [...answers];
            newAnswers[index] = value;
            setAnswers(newAnswers);

            // Check if the answer is correct
            const newIsCorrectArray = [...isCorrectArray];
            newIsCorrectArray[index] = value.toLowerCase() === shuffledImages[index].caption.toLowerCase();
            setIsCorrectArray(newIsCorrectArray);
        };

        const isCorrect = isCorrectArray.every((correct) => correct); // Check if all answers are correct

        const {updateScore} = useScore();
        const handleComplete = () => {
            if (!isCorrect) {
                alert('There are some incorrect answers, please try again.');
            } else {
                const endTime = Date.now();
                if (startTime) {
                    const timeTaken = (endTime - startTime) / 1000;
                    console.log('Time taken for Stage 2:', timeTaken);

                    updateScore('stage2', {timeTaken: timeTaken});
                }
                onComplete();
            }
        };

        const handleBack = () => {
            const confirmed = confirm('Are you sure? All progress would be lost.');
            if (confirmed) onBack();
        };

        return (
            <div>
                <h2 className="text-xl font-bold mb-4 text-black">Answer the Names</h2>
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {shuffledImages.map((img, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <img src={img.src} alt={`Image ${index + 1}`} className="w-48 h-48 object-contain" />
                            {/* Input */}
                            <div className="relative mt-2 w-full flex items-center">
                                <input
                                    type="text"
                                    value={answers[index]}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    className="px-3 py-2 border rounded shadow text-black w-full"
                                    placeholder="Enter name"
                                />
                                {/* Green Tick Indicator */}
                                {isCorrectArray[index] && (
                                    <span className="absolute right-2 text-green-600 text-xl font-bold">✓</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={handleBack}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleComplete}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700"
                    >
                        Complete
                    </button>
                </div>
            </div>
        );
    }
}
