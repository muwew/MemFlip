'use client';

import { useState, useEffect } from 'react';

interface TimerProps {
    timeLimit: number; // Total time in seconds
    onTimeUp: () => void; // Callback when the timer ends
    isGameOver: boolean; // Flag to stop the timer if the game ends early
}

export default function Timer({ timeLimit, onTimeUp, isGameOver }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(timeLimit); // Remaining time
    const [width, setWidth] = useState(100); // Timer bar width (%)

    useEffect(() => {
        if (isGameOver) return; // Stop the timer if the game ends early

        // Start the timer after a 1-second delay
        const timeoutId = setTimeout(() => {
            const intervalId = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(intervalId); // Stop the timer
                        onTimeUp(); // Trigger time-up event
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);

            return () => clearInterval(intervalId); // Cleanup on unmount
        }, 1000);

        return () => clearTimeout(timeoutId); // Cleanup on unmount
    }, [isGameOver, onTimeUp]);

    useEffect(() => {
        // Update the width of the timer bar
        setWidth((timeLeft / timeLimit) * 100);
    }, [timeLeft, timeLimit]);

    return (
        <section className="bg-red-500 h-2 my-4">
            <div
                id="timer-bar"
                className="bg-green-500 h-full transition-all duration-500"
                style={{ width: `${width}%` }}
            ></div>
        </section>
    );
}
