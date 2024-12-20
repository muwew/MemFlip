'use client';

import {useEffect, useState} from 'react';

export default function Card({
    index,
    image, 
    flipped,
    allFlipped,
    matched,
    disabled,
    onFlip,
 }: { 
    index: number;
    image: number; 
    flipped: boolean;
    allFlipped: boolean;
    matched: boolean;
    disabled: boolean;
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
        if(allFlipped){
            setIsFlipped(true);
        }
    }, [allFlipped]);

    const handleFlip = () => {
        console.log('isFlipped', isFlipped, 'matched', matched);
        if(isFlipped && !matched && !disabled){
            console.log('Card flipped');
            onFlip();
        }
    };

    return (
        <div
          className="relative w-60 h-60 perspective"
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
                className="absolute w-full h-full bg-white flex justify-center items-center rounded-lg backface-hidden"
                style={{ transform: 'rotateY(0deg)' }}
                >
                <img src={`/images/${image}.png`} alt={`Card ${image}`} className="w-40 h-40" />
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