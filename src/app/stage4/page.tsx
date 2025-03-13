'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { images as choiceImages } from '../resources/choiceImage';
import { useScore } from '../context/scoreContext';

declare global {
    interface Window {
        draggedItemIndex?: number;
    }
}

// Define a type for the image objects
interface ImageItem {
    src: string;
    caption: string;
}

export default function Stage4Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const choice = searchParams.get('choice'); // Get the selected choice from query params
    const { scores } = useScore();
    const gameMode = scores.mode?.gameMode; // Get gameMode directly from the ScoreContext

    // Default time each image is displayed: easy mode
    let showImageTime = 1.5; // in seconds

    if (gameMode === 'hard') {
        showImageTime = 1;
    }

    // Get the images based on the choice, typed as ImageItem[]
    const selectedImages: ImageItem[] = choiceImages[choice as 'Choice1' | 'Choice2' | 'Choice3'] ?? choiceImages['Choice1'];

    // Randomized sequence of images, typed as ImageItem[]
    const [randomSequence, setRandomSequence] = useState<ImageItem[]>(() => shuffleArray([...selectedImages]));
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track the current image being shown
    const [showInstructions, setShowInstructions] = useState(true); // Show instructions modal
    const [showImages, setShowImages] = useState(false); // Show image sequence
    const [showDragAndDrop, setShowDragAndDrop] = useState(false); // Show drag-and-drop game
    const [dragItems, setDragItems] = useState<(ImageItem | null)[]>([...selectedImages]); // Items for drag-and-drop
    const [droppedItems, setDroppedItems] = useState<(ImageItem | null)[]>(Array(selectedImages.length).fill(null)); // Empty boxes

    const [score, setScore] = useState<number | null>(null); // Player's final score

    // Utility to shuffle an array (Fisher-Yates Shuffle)
    function shuffleArray(array: ImageItem[]): ImageItem[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Show images in sequence one by one
    useEffect(() => {
        if (showImages) {
            const timer = setInterval(() => {
                setCurrentImageIndex((prevIndex) => {
                    if (prevIndex + 1 >= randomSequence.length) {
                        clearInterval(timer);
                        setShowImages(false);
                        setShowDragAndDrop(true);
                    }
                    return prevIndex + 1;
                });
            }, showImageTime * 1000);

            return () => clearInterval(timer); // Cleanup on unmount
        }
    }, [showImages, randomSequence.length]);

    const handleContinue = () => {
        setShowInstructions(false);
        setShowImages(true);
    };

    const handleDragStart = (index: number) => {
        const item = dragItems[index];
        if (item) {
            // Set the dragged item's index in the dataTransfer
            window.draggedItemIndex = index; // Store the index globally
        }
    };

    const handleDrop = (index: number) => {
        const draggedIndex = window.draggedItemIndex;
        if (draggedIndex !== undefined && dragItems[draggedIndex]) {
            const draggedItem = dragItems[draggedIndex];
    
            // Ensure the target box is empty
            if (droppedItems[index] === null) {
                const newDroppedItems = [...droppedItems];
                const newDragItems = [...dragItems];
    
                // Move the item to the droppedItems array
                newDroppedItems[index] = draggedItem;
                newDragItems[draggedIndex] = null;
    
                setDroppedItems(newDroppedItems);
                setDragItems(newDragItems);
    
                // Reset global index
                window.draggedItemIndex = undefined;
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Allow the drop event to occur
    };

    const { updateScore } = useScore();
    const handleSubmit = () => {
        const score = calculateScore(droppedItems, randomSequence);
        setScore(score);

        const percent = (score / selectedImages.length) * 100;
        updateScore('stage4', { correctPositions: percent });
        setShowDragAndDrop(false);
    };

    const handleReset = () => {
        setDragItems([...selectedImages]); // Reset dragItems to the original images
        setDroppedItems(Array(selectedImages.length).fill(null)); // Clear all dropped items
    };
    

    // Calculate the score, typed with ImageItem[] for both user and correct sequences
    const calculateScore = (userSequence: (ImageItem | null)[], correctSequence: ImageItem[]): number => {
        let score = 0;
        for (let i = 0; i < correctSequence.length; i++) {
            if (userSequence[i]?.caption === correctSequence[i].caption) {
                score += 1;
            }
        }
        return score;
    };

    const handleNext = () => {
        router.push(`/stage5?choice=${choice}`); // Navigate to the next stage
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            {/* Instructions Modal */}
            {showInstructions && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg text-center">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Stage 4: Instructions</h2>
                        <p className="text-gray-700 mb-6">
                            In stage 4, images will be shown in sequence. You are to memorise the image sequence and reproduce it as the answer by dragging and dropping the images.
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

            {/* Image Sequence Display */}
            {showImages && currentImageIndex < randomSequence.length && (
                <div className="flex items-center justify-center w-full h-64">
                    <img
                        src={randomSequence[currentImageIndex].src}
                        alt={`Image ${currentImageIndex + 1}`}
                        className="object-contain w-1/2 h-full"
                    />
                </div>
            )}

            {/* Drag-and-Drop Section */}
            {showDragAndDrop && (
                <div className="w-full max-w-4xl">
                    <h1 className="text-2xl font-bold mb-4 text-gray-800">Reproduce the Sequence</h1>
                    <div className="flex space-x-4 mb-6">
                        {dragItems.map((item, index) => (
                            <div
                                key={index}
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                className={`w-[140px] h-[140px] border rounded-lg flex items-center justify-center ${item ? 'bg-gray-200' : 'bg-gray-100'} shadow-lg cursor-pointer`}
                            >
                                {item && <img src={item.src} alt={item.caption} className="object-contain h-full" />}
                            </div>
                        ))}
                    </div>
                    <div className="flex space-x-4">
                        {droppedItems.map((item, index) => (
                            <div
                                key={index}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(index)}
                                className={`w-[140px] h-[140px] border rounded-lg flex items-center justify-center ${item ? 'bg-gray-200' : 'bg-gray-50'} shadow-lg`}
                            >
                                {item && <img src={item.src} alt={item.caption} className="object-contain h-full" />}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-start space-x-4 mt-6">
                        <button
                            onClick={handleReset}
                            className="px-6 py-3 bg-gray-400 text-white rounded-lg shadow-lg hover:bg-gray-500"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            )}

            {/* Score Display */}
            {score !== null && (
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Stage 4 Completed</h2>
                    <p className="text-lg text-gray-700 mb-4">Your Score: {score} / {selectedImages.length}</p>
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
