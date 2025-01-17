'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Stage2Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const choice = searchParams.get('choice'); // Get the selected choice from query params

    // Time in seconds to display the image
    const showTime = 5;

    // Images for Stage 2 based on choice
    const images = {
        Choice1: '/images/choice1/s1.jpg',
        Choice2: '/images/choice2/s2.jpg',
        Choice3: '/images/choice3/s3.png',
    };

    // Questions for Stage 2 based on choice
    const questions = {
        Choice1: [
            'What time of day is it?',
            'What country flags shown in stage 1 are shown here?',
            'What do you think the people are doing?',
            'Are there any people of authority? If yes, what occupations were they?',
            'Where did the image take place?',
            'How many people were facing away from the viewer’s perspective?',
        ],
        Choice2: [
            'Where is the picture located?',
            'What Pokemon in stage 1 do you see here?',
            'Pikachu was present in the picture. Where was Pikachu looking at?',
            'Generally, how would you describe the mood of the Pokemon present in the picture?',
        ],
        Choice3: [
            'How many people were in the picture?',
            'From stage 1, who could you identify in the picture?',
            'What were the people doing?',
            'Where is the scene located?',
            'Was there an animal in the picture? If so, what was it doing?',
        ],
    };

    const selectedImage = images[choice as 'Choice1' | 'Choice2' | 'Choice3'] ?? images['Choice1'];
    const selectedQuestions = questions[choice as 'Choice1' | 'Choice2' | 'Choice3'] ?? questions['Choice1'];

    // States
    const [showExplanation, setShowExplanation] = useState(true); // Show explanation modal
    const [showImage, setShowImage] = useState(false); // Show the image
    const [showQuestions, setShowQuestions] = useState(false); // Show the questions
    const [showInstructions, setShowInstructions] = useState(false) // Show instructions for Stage 3
    const [answers, setAnswers] = useState<string[]>(Array(selectedQuestions.length).fill('')); // Store answers

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

    const handleSubmit = () => {
        const confirmed = confirm('Are you ready to continue?');
        if (confirmed) {
            setShowQuestions(false);
            setShowInstructions(true);
            // router.push(`/gameplay?choice=${choice}`); // Navigate to Stage 3
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            {/* Explanation Modal */}
            {showExplanation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg text-center">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Stage 2: Instructions</h2>
                        <p className="text-gray-700 mb-6">
                            An image will be shown for {showTime} seconds, before being hidden. You will then use information
                            from Stage 1 and the picture to answer some questions.
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
                    className="w-3/5 object-contain mb-6 border rounded-lg shadow-lg"
                />
            )}

            {/* Questions and Answer Boxes */}
            {showQuestions && (
                <div className="w-full max-w-3xl space-y-6">
                    <h1 className="text-2xl font-bold mb-4 text-gray-800">Stage 2: Comprehension</h1>
                    {selectedQuestions.map((question, index) => (
                        <div key={index} className="flex flex-col space-y-2">
                            <label className="text-lg font-semibold text-gray-800">{question}</label>
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

            {/* Instruction Modal for Stage 3 */}
            {showInstructions && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg text-center">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Stage 3: Instructions</h2>
                        <p className="text-gray-700 mb-6">
                            Cards consisting of images you've memorised will be shown for a set amount of time, before being flipped over.
                            You have to match as many pairs as possible before time runs out.
                        </p>
                        <button
                            onClick={() => router.push(`/gameplay?choice=${choice}`)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
