'use client'

import { createContext, useContext, useState } from 'react';

interface Score{
    playerName?: {name: string};
    matrixNumber?: {mNumber: string};
    mode?:   {gameMode: string};
    stage1?: {timeTaken: number; pairsMatched: number};
    stage2?: {timeTaken: number};
    stage3?: {correctAnswers: number};
    stage4?: {correctPositions: number};
    stage5?: {timeTaken: number; moves: number; resets: number; conceded: boolean};
}

interface ScoreContextType {
    scores: Score;
    updateScore: (stage: keyof Score, data: any) => void;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export const ScoreProvider = ({ children }: { children: React.ReactNode }) => {
    const [scores, setScores] = useState<Score>({
        playerName: { name: "-" },
        matrixNumber: { mNumber: "-" },
        mode: { gameMode: "-" },
        stage1: { timeTaken: 0, pairsMatched: 0 },
        stage2: { timeTaken: 0 },
        stage3: { correctAnswers: 0 },
        stage4: { correctPositions: 0 },
        stage5: { timeTaken: 0, moves: 0, resets: 0 , conceded: false},

    });

    const updateScore = (stage: keyof Score, data: any) => {
        if (stage === 'stage4' && data.correctPositions !== undefined) {
            data.correctPositions = parseFloat(data.correctPositions.toFixed(2));
        }
        setScores((prev) => ({ ...prev, [stage]: data }));
    };

    return (
        <ScoreContext.Provider value={{ scores, updateScore }}>
            {children}
        </ScoreContext.Provider>
    );
};

export const useScore = () => {
    const context = useContext(ScoreContext);
    if (!context) {
        throw new Error('useScore must be used within a ScoreProvider');
    }
    return context;
};