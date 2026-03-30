import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateFullReport } from '@/lib/diagnosis-algorithms';
import {
  EDS_WEIGHT_KEYS,
  THRESHOLD_KEYS,
  mergeEDSWeightOverrides,
  mergeThresholdOverrides,
} from '@/lib/diagnosis-shared';
import { questionnaireSchema } from '@/validations/questionnaire';

function createNumericOverridesSchema(keys: readonly string[]) {
  const shape: Record<string, z.ZodOptional<z.ZodNumber>> = {};

  for (const key of keys) {
    shape[key] = z.number().finite().optional();
  }

  return z.object(shape).partial();
}

const tuningDiagnoseSchema = z.object({
  data: questionnaireSchema,
  thresholdOverrides: createNumericOverridesSchema(THRESHOLD_KEYS).optional(),
  edsWeightOverrides: createNumericOverridesSchema(EDS_WEIGHT_KEYS).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedBody = tuningDiagnoseSchema.parse(body);
    const thresholds = mergeThresholdOverrides(validatedBody.thresholdOverrides);
    const edsWeights = mergeEDSWeightOverrides(validatedBody.edsWeightOverrides);
    const report = generateFullReport(validatedBody.data, {
      includeBreakdown: true,
      thresholds,
      edsWeights,
    });

    return NextResponse.json(report);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid tuning diagnosis payload', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Tuning diagnosis error:', error);
    return NextResponse.json({ error: 'Failed to generate tuning diagnosis' }, { status: 500 });
  }
}
