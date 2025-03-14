'use client';

import { createContext, useContext, useState} from 'react';

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
    updateScore: <T extends keyof Score>(stage: T, data: Score[T]) => void; // Use generics to ensure correct data type for each stage
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

    const updateScore = <T extends keyof Score>(stage: T, data: Score[T]) => {
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
