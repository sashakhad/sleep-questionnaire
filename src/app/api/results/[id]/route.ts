import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {

    if (!id) {
      return NextResponse.json(
        { error: 'Missing result ID' },
        { status: 400 }
      );
    }

    const questionnaireResponse = await prisma.questionnaireResponse.findUnique({
      where: {
        id,
      },
    });

    if (!questionnaireResponse) {
      return NextResponse.json(
        { error: 'Questionnaire response not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: questionnaireResponse.id,
      birthYear: questionnaireResponse.birthYear,
      zipcode: questionnaireResponse.zipcode,
      sex: questionnaireResponse.sex,
      responses: questionnaireResponse.responses,
      scores: questionnaireResponse.scores,
      report: questionnaireResponse.report,
      createdAt: questionnaireResponse.createdAt,
    });
  } catch (error) {
    console.error('Error fetching questionnaire response:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
