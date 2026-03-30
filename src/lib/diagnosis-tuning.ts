import { defaultReviewScenario, getDiagnosisScenario, type DiagnosisScenarioExpected } from '@/lib/diagnosis-scenarios';
import type { FullReportResult } from '@/lib/diagnosis-report-types';
import {
  EDS_WEIGHT_KEYS,
  THRESHOLD_KEYS,
  type EDSWeightsConfig,
  type ThresholdConfig,
} from '@/lib/diagnosis-shared';
import type { QuestionnaireFormData } from '@/validations/questionnaire';

export type TuningMode = 'scenario' | 'custom';

export interface TuningDiagnoseRequest {
  data: QuestionnaireFormData;
  thresholdOverrides?: Partial<ThresholdConfig>;
  edsWeightOverrides?: Partial<EDSWeightsConfig>;
}

export interface TuningOutcomeFieldDefinition {
  key: keyof DiagnosisScenarioExpected;
  label: string;
}

export const TUNING_OUTCOME_FIELDS: TuningOutcomeFieldDefinition[] = [
  { key: 'hasInsomnia', label: 'Insomnia' },
  { key: 'insomniaSeverity', label: 'Insomnia Severity' },
  { key: 'hasOSA', label: 'Sleep Apnea' },
  { key: 'hasCOMISA', label: 'COMISA' },
  { key: 'hasRLS', label: 'Restless Legs' },
  { key: 'hasNightmares', label: 'Nightmares' },
  { key: 'hasNarcolepsy', label: 'Narcolepsy Screen' },
  { key: 'hasEDS', label: 'EDS' },
  { key: 'hasEDSFromNaps', label: 'EDS From Naps' },
  { key: 'hasInsufficientSleep', label: 'Insufficient Sleep' },
  { key: 'hasChronicFatigueSymptoms', label: 'Chronic Fatigue' },
  { key: 'hasPainRelatedSleepDisturbance', label: 'Pain-Related Sleep' },
  { key: 'hasMildRespiratoryDisturbance', label: 'Mild Respiratory' },
];

export type TuningOutcomeKey = (typeof TUNING_OUTCOME_FIELDS)[number]['key'];
export type TuningOutcomeValue = DiagnosisScenarioExpected[TuningOutcomeKey];
export type TuningOutcomeSnapshot = Record<TuningOutcomeKey, TuningOutcomeValue>;

export interface TuningBatchDiff {
  key: TuningOutcomeKey;
  label: string;
  defaultValue: TuningOutcomeValue;
  overriddenValue: TuningOutcomeValue;
}

export interface TuningBatchScenarioResult {
  scenarioId: string;
  label: string;
  description: string;
  expected: DiagnosisScenarioExpected;
  defaultOutcome: TuningOutcomeSnapshot;
  overriddenOutcome: TuningOutcomeSnapshot;
  diffs: TuningBatchDiff[];
  mismatchCount: number;
}

function cloneQuestionnaireData(data: QuestionnaireFormData): QuestionnaireFormData {
  return structuredClone(data);
}

export function getTuningScenarioData(scenarioId: string): QuestionnaireFormData {
  const scenario = getDiagnosisScenario(scenarioId) ?? defaultReviewScenario;
  return cloneQuestionnaireData(scenario.data);
}

export function getTuningOutcomeSnapshot(report: FullReportResult): TuningOutcomeSnapshot {
  return {
    hasInsomnia: report.hasInsomnia,
    insomniaSeverity: report.insomniaSeverity,
    hasOSA: report.hasOSA,
    hasCOMISA: report.hasCOMISA,
    hasRLS: report.hasRLS,
    hasNightmares: report.hasNightmares,
    hasNarcolepsy: report.hasNarcolepsy,
    hasEDS: report.hasEDS,
    hasEDSFromNaps: report.hasEDSFromNaps,
    hasInsufficientSleep: report.hasInsufficientSleep,
    hasChronicFatigueSymptoms: report.hasChronicFatigueSymptoms,
    hasPainRelatedSleepDisturbance: report.hasPainRelatedSleepDisturbance,
    hasMildRespiratoryDisturbance: report.hasMildRespiratoryDisturbance,
  };
}

export function createTuningDiffs(
  defaultOutcome: TuningOutcomeSnapshot,
  overriddenOutcome: TuningOutcomeSnapshot
): TuningBatchDiff[] {
  const diffs: TuningBatchDiff[] = [];

  for (const field of TUNING_OUTCOME_FIELDS) {
    if (defaultOutcome[field.key] === overriddenOutcome[field.key]) {
      continue;
    }

    diffs.push({
      key: field.key,
      label: field.label,
      defaultValue: defaultOutcome[field.key],
      overriddenValue: overriddenOutcome[field.key],
    });
  }

  return diffs;
}

export function countExpectedOutcomeMismatches(
  expected: DiagnosisScenarioExpected,
  outcome: TuningOutcomeSnapshot
): number {
  let mismatchCount = 0;

  for (const field of TUNING_OUTCOME_FIELDS) {
    if (expected[field.key] !== outcome[field.key]) {
      mismatchCount += 1;
    }
  }

  return mismatchCount;
}

function decodeNumericOverrides<TKey extends string>(
  rawValue: string | null,
  allowedKeys: readonly TKey[]
): Partial<Record<TKey, number>> {
  const decoded: Partial<Record<TKey, number>> = {};

  if (!rawValue) {
    return decoded;
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    if (!parsedValue || typeof parsedValue !== 'object') {
      return decoded;
    }

    const parsedObject = parsedValue as Record<string, unknown>;

    for (const key of allowedKeys) {
      const value = parsedObject[key];
      if (typeof value === 'number' && Number.isFinite(value)) {
        decoded[key] = value;
      }
    }
  } catch {
    return decoded;
  }

  return decoded;
}

function encodeNumericOverrides<TKey extends string>(
  overrides: Partial<Record<TKey, number>>,
  allowedKeys: readonly TKey[]
): string | null {
  const serialized: Record<string, number> = {};

  for (const key of allowedKeys) {
    const value = overrides[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      serialized[key] = value;
    }
  }

  return Object.keys(serialized).length > 0 ? JSON.stringify(serialized) : null;
}

export function decodeThresholdOverrides(rawValue: string | null): Partial<ThresholdConfig> {
  return decodeNumericOverrides(rawValue, THRESHOLD_KEYS);
}

export function decodeEDSWeightOverrides(rawValue: string | null): Partial<EDSWeightsConfig> {
  return decodeNumericOverrides(rawValue, EDS_WEIGHT_KEYS);
}

export function encodeThresholdOverrides(overrides: Partial<ThresholdConfig>): string | null {
  return encodeNumericOverrides(overrides, THRESHOLD_KEYS);
}

export function encodeEDSWeightOverrides(overrides: Partial<EDSWeightsConfig>): string | null {
  return encodeNumericOverrides(overrides, EDS_WEIGHT_KEYS);
}
