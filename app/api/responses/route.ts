
// This file is deprecated and will be removed.
// Its contents have been moved to /src/app/api/log/grading/route.ts
// To ensure no build errors if this path is somehow still hit, return a 404 or redirect.
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'This endpoint is deprecated. Use /api/log/grading OR /api/data/graded instead.' }, { status: 404 });
}

export async function POST() {
  return NextResponse.json({ message: 'This endpoint is deprecated. Use /api/log/grading instead.' }, { status: 404 });
}
// You should delete this file: src/app/api/responses/route.ts
// And the directory: src/app/api/responses
// I am providing this content so the old path doesn't immediately 404 without explanation if the build system processes it before deletion.
// For the final state, these files should not exist.
