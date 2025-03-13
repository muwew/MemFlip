'use client';

import { createContext, useContext, useState } from 'react';

// Define the types for each stage's data
interface Stage1Data {
    timeTaken: number;
    pairsMatched: number;
}

interface Stage2Data {
    timeTaken: number;
}

interface Stage3Data {
    correctAnswers: number;
}

interface Stage4Data {
    correctPositions: number;
}

interface Stage5Data {
    timeTaken: number;
    moves: number;
    resets: number;
    conceded: boolean;
}

// Extend the Score interface to allow updating non-stage specific properties
interface Score {
    playerName?: { name: string };
    matrixNumber?: { mNumber: string };
    mode?: { gameMode: string };
    stage1?: Stage1Data;
    stage2?: Stage2Data;
    stage3?: Stage3Data;
    stage4?: Stage4Data;
    stage5?: Stage5Data;
}

// Define the ScoreContextType with updated updateScore type
interface ScoreContextType {
    scores: Score;
    updateScore: (stage: keyof Score, data: any) => void; // Still using 'any' for flexibility, can be further refined
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
        stage5: { timeTaken: 0, moves: 0, resets: 0, conceded: false },
    });

    const updateScore = (stage: keyof Score, data: any) => {
        // Handling stage4 specific logic to ensure correctPositions is always a float with 2 decimal places
        if (stage === 'stage4' && 'correctPositions' in data) {
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
