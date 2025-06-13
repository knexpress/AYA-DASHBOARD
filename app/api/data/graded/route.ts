import { NextResponse } from 'next/server';
import { getGradedResponses } from '../../../../data/gradedResponseActions';

export async function GET() {
  try {
    const responses = await getGradedResponses();
    return NextResponse.json(responses);
  } catch (error) {
    console.error('API Error GET /api/data/graded:', error);
    return NextResponse.json({ message: 'Failed to fetch graded responses', error: (error as Error).message }, { status: 500 });
  }
}