import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ code: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { code } = await params;

    if (!code || code.length !== 8) {
      return NextResponse.json(
        { error: 'Invalid response code format' },
        { status: 400 }
      );
    }

    const response = await prisma.questionnaireResponse.findUnique({
      where: {
        responseCode: code.toUpperCase(),
      },
      select: {
        id: true,
        responseCode: true,
        rawData: true,
        createdAt: true,
      },
    });

    if (!response) {
      return NextResponse.json(
        { error: 'Response not found. Please check your code and try again.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: response.rawData,
      createdAt: response.createdAt,
    });
  } catch (error) {
    console.error('Error retrieving response:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve response' },
      { status: 500 }
    );
  }
}
