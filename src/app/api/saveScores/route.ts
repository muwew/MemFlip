import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
    try {
        console.log("Received request to /api/saveScores");
        console.log("🔍 Checking Supabase Env Variables...");
        console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL || "Not Found");
        console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "Not Found");
        
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            console.error("Supabase env variables are missing");
            return NextResponse.json({ error: "Supabase env variables are missing" }, { status: 500 });
        }

        // Await the client creation
        const supabase = await createClient();
        if (!supabase) {
            console.error("Supabase client creation failed");
            return NextResponse.json({ error: 'Failed to create Supabase client' }, { status: 500 });
        }
        
        const body = await req.json();
        console.log("Request Body:", JSON.stringify(body, null, 2));

        // Extract data from the request
        const {
            playerName,
            matrixNumber,
            mode,
            choice,
            stage1,
            stage2,
            stage3,
            stage4,
            stage5
        } = body;

        if (!playerName || !matrixNumber) {
            console.error("Missing playerName or matrixNumber");
            return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
        }
        console.log("Inserting into Supabase...");

        // Insert data into Supabase
        const { error } = await supabase.from('responses').insert([
            {
                player_name: playerName?.name || 'Unknown',
                matrix_number: matrixNumber?.mNumber || 'Unknown',
                game_mode: mode?.gameMode || 'N/A',
                game_choice: choice?.gameChoice || 'N/A',
                stage1_time: stage1?.timeTaken || 0,
                stage1_pairs: stage1?.pairsMatched || 0,
                stage2_time: stage2?.timeTaken || 0,
                stage3_correct: stage3?.correctAnswers || 0,
                stage4_positions: stage4?.correctPositions || 0,
                stage5_time: stage5?.timeTaken || 0,
                stage5_moves: stage5?.moves || 0,
                stage5_resets: stage5?.resets || 0,
                stage5_conceded: stage5?.conceded || false,
            }
        ]);

        if (error) {
            console.error('Error saving data:', error);
            return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Data saved successfully' }, { status: 200 });

    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
