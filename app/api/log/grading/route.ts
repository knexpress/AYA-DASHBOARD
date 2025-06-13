
import { NextResponse } from 'next/server';
import { getGradedResponses, saveGradedResponse } from '../../../../app/actions/gradedResponsesActions';
import { TrainingDataItemSchema, type TrainingDataItem } from '../../../../types';
import { randomUUID } from 'crypto';

export async function GET() {
  try {
    const responses = await getGradedResponses();
    return NextResponse.json(responses);
  } catch (error) {
    console.error('API Error GET /api/log/grading:', error);
    return NextResponse.json({ message: 'Failed to fetch graded responses', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const itemToSave: Partial<TrainingDataItem> = {
        ...body,
        id: body.id || randomUUID(),
        timestamp: body.timestamp || new Date().toISOString(),
        // Ensure null is saved if fields are missing/empty, rather than undefined
        grade: body.grade !== undefined ? body.grade : null,
        adminRemarks: body.adminRemarks !== undefined ? body.adminRemarks : null,
        correctedResponse: body.correctedResponse !== undefined ? body.correctedResponse : null,
    };
    
    const validationResult = TrainingDataItemSchema.safeParse(itemToSave);

    if (!validationResult.success) {
      return NextResponse.json({ message: 'Invalid data format for grading item', errors: validationResult.error.flatten() }, { status: 400 });
    }

    await saveGradedResponse(validationResult.data);
    return NextResponse.json({ message: 'Grading item logged successfully', id: validationResult.data.id }, { status: 201 });
  } catch (error) {
    console.error('API Error POST /api/log/grading:', error);
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
        return NextResponse.json({ message: 'Invalid JSON in request body', error: (error as Error).message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to save grading item', error: (error as Error).message }, { status: 500 });
  }
}
