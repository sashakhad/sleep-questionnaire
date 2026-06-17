import { NextRequest, NextResponse } from 'next/server';
import { questionnaireSchema } from '@/validations/questionnaire';
import { generateFullReport } from '@/lib/diagnosis-algorithms';
import { getSessionFromRequest } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  const rateLimitResponse = checkRateLimit(request, 'diagnose');
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const validatedData = questionnaireSchema.parse(body);

    // The full algorithm breakdown exposes proprietary decision logic and
    // threshold values, so it is only returned to authenticated clinicians
    // (admin session). Public callers get the diagnosis result without the
    // breakdown.
    const debugRequested = request.nextUrl.searchParams.get('debug') === '1';
    const session = debugRequested ? await getSessionFromRequest(request) : null;
    const includeBreakdown = debugRequested && session !== null;

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
