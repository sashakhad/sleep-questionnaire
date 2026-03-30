import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateFullReport } from '@/lib/diagnosis-algorithms';
import { diagnosisScenarios } from '@/lib/diagnosis-scenarios';
import {
  countExpectedOutcomeMismatches,
  createTuningDiffs,
  getTuningOutcomeSnapshot,
} from '@/lib/diagnosis-tuning';
import {
  EDS_WEIGHT_KEYS,
  THRESHOLD_KEYS,
  mergeEDSWeightOverrides,
  mergeThresholdOverrides,
} from '@/lib/diagnosis-shared';

function createNumericOverridesSchema(keys: readonly string[]) {
  const shape: Record<string, z.ZodOptional<z.ZodNumber>> = {};

  for (const key of keys) {
    shape[key] = z.number().finite().optional();
  }

  return z.object(shape).partial();
}

const tuningBatchSchema = z.object({
  thresholdOverrides: createNumericOverridesSchema(THRESHOLD_KEYS).optional(),
  edsWeightOverrides: createNumericOverridesSchema(EDS_WEIGHT_KEYS).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedBody = tuningBatchSchema.parse(body);
    const thresholds = mergeThresholdOverrides(validatedBody.thresholdOverrides);
    const edsWeights = mergeEDSWeightOverrides(validatedBody.edsWeightOverrides);

    const results = diagnosisScenarios.map(scenario => {
      const defaultResult = generateFullReport(scenario.data);
      const overriddenResult = generateFullReport(scenario.data, {
        thresholds,
        edsWeights,
      });
      const defaultOutcome = getTuningOutcomeSnapshot(defaultResult);
      const overriddenOutcome = getTuningOutcomeSnapshot(overriddenResult);
      const diffs = createTuningDiffs(defaultOutcome, overriddenOutcome);
      const mismatchCount = countExpectedOutcomeMismatches(scenario.expected, overriddenOutcome);

      return {
        scenarioId: scenario.id,
        label: scenario.label,
        description: scenario.description,
        expected: scenario.expected,
        defaultResult,
        overriddenResult,
        defaultOutcome,
        overriddenOutcome,
        diffs,
        mismatchCount,
      };
    });

    return NextResponse.json({ results });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid tuning batch payload', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Tuning batch error:', error);
    return NextResponse.json({ error: 'Failed to generate tuning batch results' }, { status: 500 });
  }
}
