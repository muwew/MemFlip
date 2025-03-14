import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { format } from 'fast-csv';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

// Load Google Cloud credentials from environment variable
const storage = new Storage({
    credentials: JSON.parse(process.env.GCP_CREDENTIALS!), // Ensure this file is uploaded securely
});

const bucketName = process.env.GCS_BUCKET_NAME || 'memory-game-responses';

// Define strict TypeScript types for each stage score format
type StageScore =
  | { stage: 'Stage1'; timeTaken: number; score: number }
  | { stage: 'Stage2'; timeTaken: number }
  | { stage: 'Stage3'; correctAnswers: number }
  | { stage: 'Stage4'; correctPositions: number }
  | { stage: 'Stage5'; timeTaken: number; moves: number; resets: number };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received data:', body);
    const { participantName ,participantId, stageScores } = body;

    if (!participantId || !Array.isArray(stageScores)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Ensure stageScores is correctly typed
    const typedScores: StageScore[] = stageScores as StageScore[];

    // Generate CSV content
    const filePath = path.join('/tmp', `${participantId}.csv`);
    const csvStream = format({ headers: true });
    const writableStream = fs.createWriteStream(filePath);
    csvStream.pipe(writableStream);

    csvStream.write({ stage: 'Participant', participantName });
    typedScores.forEach((score) => csvStream.write(score));
    csvStream.end();

    await new Promise((resolve) => writableStream.on('finish', resolve));

    // Upload CSV to GCS
    await storage.bucket(bucketName).upload(filePath, {
      destination: `responses/${participantId}.csv`,
      contentType: 'text/csv',
    });

    // Clean up local file
    await unlinkAsync(filePath);

    return NextResponse.json({ message: 'File uploaded successfully' }, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
    return NextResponse.json({ message: 'This is the upload API. Use POST to submit data.' });
  }