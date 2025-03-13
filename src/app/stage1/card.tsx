'use client';

import { useEffect, useState } from 'react';

export default function Card({
    image,
    caption,
    flipped,
    allFlipped,
    matched,
    disabled,
    vibrating,
    onFlip,
}: {
    image: string;
    caption: string;
    flipped: boolean;
    allFlipped: boolean;
    matched: boolean;
    disabled: boolean;
    vibrating: boolean;
    onFlip: () => void;
}) {
    // State to keep track of whether the card is flipped
    const [isFlipped, setIsFlipped] = useState(flipped);

    // Update isFlipped when the card is flipped
    useEffect(() => {
        setIsFlipped(flipped);
    }, [flipped]);

    // Handle initial flip
    useEffect(() => {
        if (allFlipped) {
            setIsFlipped(true);
        }
    }, [allFlipped]);

    const handleFlip = () => {
        console.log('isFlipped', isFlipped, 'matched', matched);
        if (isFlipped && !matched && !disabled) {
            console.log('Card flipped');
            onFlip();
        }
    };

    return (
        <div
            className={`relative w-60 h-60 perspective 
            ${vibrating ? 'animate-vibrate' : ''}`} // Use vibrating prop here
            onClick={handleFlip}
        >
            <div
                className={`absolute w-full h-full rounded-lg shadow-lg transform transition-transform duration-500 ${
                    isFlipped ? 'rotate-y-180' : ''
                }`}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front Side */}
                <div
                    className="absolute w-full h-full bg-gray flex flex-col justify-center items-center rounded-lg backface-hidden"
                    style={{ transform: 'rotateY(0deg)' }}
                >
                    {/* Image */}
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        <img
                            src={`${image}`}
                            alt={`Card ${image}`}
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>

                    {/* Caption */}
                    <p className="mt-2 text-lg font-medium text-gray-700 text-center">
                        {caption}
                    </p>
                </div>

                {/* Back Side */}
                <div
                    className="absolute w-full h-full bg-gray-300 flex justify-center items-center rounded-lg backface-hidden"
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    <span className="text-2xl font-bold text-gray-700">?</span>
                </div>
            </div>
        </div>
    );
}
