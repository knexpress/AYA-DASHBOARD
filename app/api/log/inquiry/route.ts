
import { NextResponse } from 'next/server';
import { saveInquiry } from '../../../../app/actions/allInquiriesActions';
import { InquiryItemSchema, type InquiryItem } from '../../../../types';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const itemToSave: Partial<InquiryItem> = {
      ...body,
      id: body.id || randomUUID(),
      timestamp: body.timestamp || new Date().toISOString(),
    };

    const validationResult = InquiryItemSchema.safeParse(itemToSave);

    if (!validationResult.success) {
      return NextResponse.json({ message: 'Invalid data format for inquiry', errors: validationResult.error.flatten() }, { status: 400 });
    }

    await saveInquiry(validationResult.data);
    return NextResponse.json({ message: 'Inquiry logged successfully', id: validationResult.data.id }, { status: 201 });
  } catch (error) {
    console.error('API Error POST /api/log/inquiry:', error);
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
        return NextResponse.json({ message: 'Invalid JSON in request body', error: (error as Error).message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to log inquiry', error: (error as Error).message }, { status: 500 });
  }
}
