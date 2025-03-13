'use client';

import { useState, useEffect, useRef } from 'react';

interface TimerProps {
    timeLimit: number;
    onTimeUp: () => void;
    isGameOver: boolean;
    onTimeUpdate: (remainingTime: number) => void;
    isTimerActive: boolean; 
}

export default function Timer({ timeLimit, onTimeUp, isGameOver, onTimeUpdate, isTimerActive}: TimerProps) {
    const timeLeftRef = useRef(timeLimit);
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isTimerActive || isGameOver) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        intervalRef.current = setInterval(() => {
            if (timeLeftRef.current <= 1) {
                clearInterval(intervalRef.current!);
                onTimeUp();
            } else {
                timeLeftRef.current -= 1;
                setTimeLeft(timeLeftRef.current);
                onTimeUpdate(timeLeftRef.current);
            }
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isGameOver, isTimerActive]);

    return (
        <section className="bg-red-500 h-2 my-4">
            <div
                id="timer-bar"
                className="bg-green-500 h-full transition-all duration-500"
                style={{ width: `${(timeLeft / timeLimit) * 100}%` }}
            ></div>
        </section>
    );
}
