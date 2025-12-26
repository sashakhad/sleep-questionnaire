import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  // Auth is handled by middleware
  try {
    const responses = await prisma.questionnaireResponse.findMany({
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
        rawData: true,
      },
    });

    // Generate CSV
    const headers = [
      'ID',
      'Year of Birth',
      'Sex',
      'Zipcode',
      'Weight (lbs)',
      'Height (inches)',
      'Submitted Date',
      'Submitted Time',
    ];

    const rows = responses.map(response => {
      const date = new Date(response.createdAt);
      return [
        response.id,
        response.yearOfBirth ?? '',
        response.sex ?? '',
        response.zipcode ?? '',
        response.weight ?? '',
        response.height ?? '',
        date.toISOString().split('T')[0],
        date.toTimeString().split(' ')[0],
      ];
    });

    // Escape CSV values
    function escapeCsvValue(value: unknown): string {
      if (value === null || value === undefined) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }

    const csvLines = [
      headers.map(escapeCsvValue).join(','),
      ...rows.map(row => row.map(escapeCsvValue).join(',')),
    ];

    const csv = csvLines.join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="questionnaire-responses-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error generating CSV:', error);
    return NextResponse.json({ error: 'Failed to generate CSV' }, { status: 500 });
  }
}
