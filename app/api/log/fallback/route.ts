import { NextResponse } from 'next/server';
// Import the correct function and types for the new data structure
import { getUnansweredQuestions, saveUnansweredQuestion } from '../../../../app/actions/unansweredQuestionsActions';
import { UnansweredQuestionsDataSchema } from '../../../../types';
import { randomUUID } from 'crypto';

// The GET function can remain as is, as it calls getUnansweredQuestions
// which now returns data in the new format.
export async function GET() {
  try {
    // Assuming getUnansweredQuestions is imported from the actions file
    // which now returns UnansweredQuestionsData
    const items = await getUnansweredQuestions();
    return NextResponse.json(items);
  } catch (error) {
    console.error('API Error GET /api/log/fallback:', error);
    return NextResponse.json({ message: 'Failed to fetch unanswered questions', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // We expect the body to contain at least 'userMessage' and 'sessionId'
    // based on how the frontend or calling service would send fallback data.
    // We will use a simplified validation here, as the main validation happens in the action.
    if (!body.userMessage || !body.sessionId) {
         return NextResponse.json({ message: 'Missing required fields: userMessage or sessionId' }, { status: 400 });
    }

    const question = String(body.userMessage);
    const sessionId = String(body.sessionId);

    // Call the updated saveUnansweredQuestion function with question and sessionId
    await saveUnansweredQuestion(question, sessionId);

    // Note: We no longer have an 'id' generated here to return, as the ID is the question itself
    return NextResponse.json({ message: 'Fallback logged successfully' }, { status: 201 });

  } catch (error) {
    console.error('API Error POST /api/log/fallback:', error);
     if (error instanceof SyntaxError && error.message.includes('JSON')) {
        return NextResponse.json({ message: 'Invalid JSON in request body', error: (error as Error).message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to save unanswered question', error: (error as Error).message }, { status: 500 });
  }
}
