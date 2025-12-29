import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { questionnaireSchema } from '@/validations/questionnaire';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the data
    const validatedData = questionnaireSchema.parse(body);

    // Extract demographics for denormalization
    const demographics = validatedData.demographics;

    // Save to database with response code
    const response = await prisma.questionnaireResponse.create({
      data: {
        responseCode: demographics.responseCode,
        rawData: validatedData as unknown as object,
        yearOfBirth: demographics.yearOfBirth,
        sex: demographics.sex,
        zipcode: demographics.zipcode || null,
        weight: demographics.weight ?? null,
        height: demographics.height ?? null,
      },
    });

    return NextResponse.json({
      success: true,
      id: response.id,
    });
  } catch (error) {
    console.error('Error saving questionnaire response:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid questionnaire data', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to save questionnaire response' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Auth is handled by middleware
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate page parameter
    const rawPage = parseInt(searchParams.get('page') || '1', 10);
    const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

    // Parse and validate limit parameter (max 100 to prevent memory issues)
    const rawLimit = parseInt(searchParams.get('limit') || '50', 10);
    const limit = Number.isNaN(rawLimit) || rawLimit < 1 ? 50 : Math.min(rawLimit, 100);

    const skip = (page - 1) * limit;

    const [responses, total] = await Promise.all([
      prisma.questionnaireResponse.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          yearOfBirth: true,
          sex: true,
          zipcode: true,
          weight: true,
          height: true,
          createdAt: true,
        },
      }),
      prisma.questionnaireResponse.count(),
    ]);

    return NextResponse.json({
      responses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching responses:', error);
    return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 });
  }
}
