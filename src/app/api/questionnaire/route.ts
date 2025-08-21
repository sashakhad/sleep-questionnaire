import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { birthYear, zipcode, sex, responses, scores, report } = body;

    if (!birthYear || !zipcode || !sex || !responses || !scores || !report) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const questionnaireResponse = await prisma.questionnaireResponse.create({
      data: {
        birthYear: parseInt(birthYear),
        zipcode: zipcode.toString(),
        sex: sex.toString(),
        responses,
        scores,
        report,
      },
    });

    return NextResponse.json({
      id: questionnaireResponse.id,
      message: 'Questionnaire response saved successfully',
    });
  } catch (error) {
    console.error('Error saving questionnaire response:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
