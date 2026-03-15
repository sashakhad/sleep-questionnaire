import { NextRequest, NextResponse } from 'next/server';
import { questionnaireSchema } from '@/validations/questionnaire';
import { generateFullReport } from '@/lib/diagnosis-algorithms';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = questionnaireSchema.parse(body);
    const includeBreakdown = request.nextUrl.searchParams.get('debug') === '1';
    const report = generateFullReport(validatedData, { includeBreakdown });
    return NextResponse.json(report);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid questionnaire data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Diagnosis error:', error);
    return NextResponse.json({ error: 'Failed to generate diagnosis' }, { status: 500 });
  }
}
