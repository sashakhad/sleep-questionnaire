import { z } from 'zod';

export const THRESHOLD_KEYS = [
  'MIN_RECOMMENDED_SLEEP_HOURS',
  'NAP_EDS_MIN_DAYS',
  'NAP_EDS_MIN_DURATION',
  'SOL_MILD_MIN',
  'SOL_MILD_MAX',
  'SOL_MODERATE',
  'WASO_MILD_MIN',
  'WASO_MILD_MAX',
  'WASO_MODERATE',
  'SLEEP_EFFICIENCY_NORMAL',
  'TIREDNESS_MILD_MIN',
  'TIREDNESS_MILD_MAX',
  'TIREDNESS_MODERATE',
  'FATIGUE_MILD_MIN',
  'FATIGUE_MILD_MAX',
  'FATIGUE_MODERATE',
  'FATIGUE_CHRONIC',
  'EDS_SCORE_MIN',
  'EDS_SCORE_MAX',
  'APNEA_AGE_RISK',
  'APNEA_BMI_RISK',
  'APNEA_TIREDNESS_THRESHOLD',
  'APNEA_MILD_FACTORS',
  'APNEA_MODERATE_FACTORS',
  'NIGHTMARE_DISORDER_THRESHOLD',
  'BAD_DREAM_WARNING_THRESHOLD',
  'LEG_CRAMPS_CONCERN_THRESHOLD',
  'SLEEPINESS_SAFETY_CONCERN',
] as const;

export type ThresholdKey = (typeof THRESHOLD_KEYS)[number];
export type ThresholdConfig = Record<ThresholdKey, number>;

export const THRESHOLDS: ThresholdConfig = {
  MIN_RECOMMENDED_SLEEP_HOURS: 7,
  NAP_EDS_MIN_DAYS: 3,
  NAP_EDS_MIN_DURATION: 30,
  SOL_MILD_MIN: 30,
  SOL_MILD_MAX: 45,
  SOL_MODERATE: 45,
  WASO_MILD_MIN: 40,
  WASO_MILD_MAX: 60,
  WASO_MODERATE: 60,
  SLEEP_EFFICIENCY_NORMAL: 85,
  TIREDNESS_MILD_MIN: 5,
  TIREDNESS_MILD_MAX: 7,
  TIREDNESS_MODERATE: 7,
  FATIGUE_MILD_MIN: 3,
  FATIGUE_MILD_MAX: 5,
  FATIGUE_MODERATE: 5,
  FATIGUE_CHRONIC: 7,
  EDS_SCORE_MIN: 2,
  EDS_SCORE_MAX: 7,
  APNEA_AGE_RISK: 60,
  APNEA_BMI_RISK: 25,
  APNEA_TIREDNESS_THRESHOLD: 3,
  APNEA_MILD_FACTORS: 1,
  APNEA_MODERATE_FACTORS: 3,
  NIGHTMARE_DISORDER_THRESHOLD: 2,
  BAD_DREAM_WARNING_THRESHOLD: 3,
  LEG_CRAMPS_CONCERN_THRESHOLD: 2,
  SLEEPINESS_SAFETY_CONCERN: 8,
};

export const EDS_WEIGHT_KEYS = [
  'stoplight',
  'lectures',
  'working',
  'conversation',
  'evening',
  'meal',
] as const;

export type EDSWeightKey = (typeof EDS_WEIGHT_KEYS)[number];
export type EDSWeightsConfig = Record<string, number> & Record<EDSWeightKey, number>;

export const EDS_WEIGHTS: EDSWeightsConfig = {
  stoplight: 2,
  lectures: 1,
  working: 1,
  conversation: 2,
  evening: 1,
  meal: 2,
};

export interface ThresholdDefinition {
  key: ThresholdKey;
  label: string;
  description: string;
  unit?: string;
}

export const THRESHOLD_DEFINITIONS: Record<ThresholdKey, ThresholdDefinition> = {
  MIN_RECOMMENDED_SLEEP_HOURS: {
    key: 'MIN_RECOMMENDED_SLEEP_HOURS',
    label: 'Minimum recommended sleep',
    description: 'Minimum weekly average sleep needed to remain in the EDS pathway.',
    unit: 'hours',
  },
  NAP_EDS_MIN_DAYS: {
    key: 'NAP_EDS_MIN_DAYS',
    label: 'Planned naps days per week',
    description: 'Minimum number of days per week of planned naps to count as EDS.',
    unit: 'days',
  },
  NAP_EDS_MIN_DURATION: {
    key: 'NAP_EDS_MIN_DURATION',
    label: 'Planned nap duration',
    description: 'Minimum planned nap duration to count toward EDS.',
    unit: 'minutes',
  },
  SOL_MILD_MIN: {
    key: 'SOL_MILD_MIN',
    label: 'SOL mild minimum',
    description: 'Minimum sleep-onset latency for mild insomnia.',
    unit: 'minutes',
  },
  SOL_MILD_MAX: {
    key: 'SOL_MILD_MAX',
    label: 'SOL mild maximum',
    description: 'Upper bound of mild sleep-onset latency.',
    unit: 'minutes',
  },
  SOL_MODERATE: {
    key: 'SOL_MODERATE',
    label: 'SOL moderate-to-severe cutoff',
    description: 'Sleep-onset latency above this value is moderate-to-severe.',
    unit: 'minutes',
  },
  WASO_MILD_MIN: {
    key: 'WASO_MILD_MIN',
    label: 'WASO mild minimum',
    description: 'Minimum wake-after-sleep-onset for mild insomnia.',
    unit: 'minutes',
  },
  WASO_MILD_MAX: {
    key: 'WASO_MILD_MAX',
    label: 'WASO mild maximum',
    description: 'Upper bound of mild wake-after-sleep-onset.',
    unit: 'minutes',
  },
  WASO_MODERATE: {
    key: 'WASO_MODERATE',
    label: 'WASO moderate-to-severe cutoff',
    description: 'Wake-after-sleep-onset above this value is moderate-to-severe.',
    unit: 'minutes',
  },
  SLEEP_EFFICIENCY_NORMAL: {
    key: 'SLEEP_EFFICIENCY_NORMAL',
    label: 'Sleep efficiency normal threshold',
    description: 'Scheduled sleep efficiency below this value is considered poor quality.',
    unit: '%',
  },
  TIREDNESS_MILD_MIN: {
    key: 'TIREDNESS_MILD_MIN',
    label: 'Tiredness mild minimum',
    description: 'Lower bound for mild tiredness impact.',
  },
  TIREDNESS_MILD_MAX: {
    key: 'TIREDNESS_MILD_MAX',
    label: 'Tiredness mild maximum',
    description: 'Upper bound for mild tiredness impact.',
  },
  TIREDNESS_MODERATE: {
    key: 'TIREDNESS_MODERATE',
    label: 'Tiredness moderate cutoff',
    description: 'Tiredness at or above this level counts as moderate.',
  },
  FATIGUE_MILD_MIN: {
    key: 'FATIGUE_MILD_MIN',
    label: 'Fatigue mild minimum',
    description: 'Lower bound for mild fatigue impact.',
  },
  FATIGUE_MILD_MAX: {
    key: 'FATIGUE_MILD_MAX',
    label: 'Fatigue mild maximum',
    description: 'Upper bound for mild fatigue impact.',
  },
  FATIGUE_MODERATE: {
    key: 'FATIGUE_MODERATE',
    label: 'Fatigue moderate cutoff',
    description: 'Fatigue at or above this level counts as moderate.',
  },
  FATIGUE_CHRONIC: {
    key: 'FATIGUE_CHRONIC',
    label: 'Fatigue chronic cutoff',
    description: 'Fatigue above this level contributes to the chronic fatigue screen.',
  },
  EDS_SCORE_MIN: {
    key: 'EDS_SCORE_MIN',
    label: 'EDS score minimum',
    description: 'Minimum dozing score for activity-based EDS.',
  },
  EDS_SCORE_MAX: {
    key: 'EDS_SCORE_MAX',
    label: 'EDS score maximum',
    description: 'Maximum dozing score still considered the daytime sleepiness gate.',
  },
  APNEA_AGE_RISK: {
    key: 'APNEA_AGE_RISK',
    label: 'Apnea age risk',
    description: 'Age above this value counts as an apnea risk factor.',
    unit: 'years',
  },
  APNEA_BMI_RISK: {
    key: 'APNEA_BMI_RISK',
    label: 'Apnea BMI risk',
    description: 'BMI above this value counts as an apnea risk factor.',
  },
  APNEA_TIREDNESS_THRESHOLD: {
    key: 'APNEA_TIREDNESS_THRESHOLD',
    label: 'Apnea tiredness threshold',
    description: 'Tiredness or fatigue above this value counts as an apnea risk factor.',
  },
  APNEA_MILD_FACTORS: {
    key: 'APNEA_MILD_FACTORS',
    label: 'Apnea mild factor count',
    description: 'Minimum risk-factor count for mild probable apnea when snoring is present.',
  },
  APNEA_MODERATE_FACTORS: {
    key: 'APNEA_MODERATE_FACTORS',
    label: 'Apnea moderate factor count',
    description: 'Risk-factor count for moderate-to-severe probable apnea.',
  },
  NIGHTMARE_DISORDER_THRESHOLD: {
    key: 'NIGHTMARE_DISORDER_THRESHOLD',
    label: 'Nightmare disorder threshold',
    description: 'Nightmares per week needed to flag nightmare disorder.',
    unit: 'per week',
  },
  BAD_DREAM_WARNING_THRESHOLD: {
    key: 'BAD_DREAM_WARNING_THRESHOLD',
    label: 'Bad dream warning threshold',
    description: 'Bad dreams per week needed to flag a warning.',
    unit: 'per week',
  },
  LEG_CRAMPS_CONCERN_THRESHOLD: {
    key: 'LEG_CRAMPS_CONCERN_THRESHOLD',
    label: 'Leg cramps concern threshold',
    description: 'Leg cramps nights per week needed to flag concern.',
    unit: 'nights',
  },
  SLEEPINESS_SAFETY_CONCERN: {
    key: 'SLEEPINESS_SAFETY_CONCERN',
    label: 'Sleepiness safety concern threshold',
    description: 'Sleepiness severity above this value triggers the urgent safety warning.',
  },
};

export interface EDSWeightDefinition {
  key: EDSWeightKey;
  label: string;
  description: string;
}

export const EDS_WEIGHT_DEFINITIONS: Record<EDSWeightKey, EDSWeightDefinition> = {
  stoplight: {
    key: 'stoplight',
    label: 'Stopped at a stop light',
    description: 'Dozing while stopped at a stop light.',
  },
  lectures: {
    key: 'lectures',
    label: 'During lectures or work meetings',
    description: 'Dozing during lectures or work meetings.',
  },
  working: {
    key: 'working',
    label: 'While working or studying',
    description: 'Dozing while working or studying.',
  },
  conversation: {
    key: 'conversation',
    label: 'During a conversation',
    description: 'Dozing during a conversation.',
  },
  evening: {
    key: 'evening',
    label: 'During a quiet evening activity',
    description: 'Dozing during a quiet evening activity.',
  },
  meal: {
    key: 'meal',
    label: 'While eating a meal',
    description: 'Dozing while eating a meal.',
  },
};

/**
 * Maps an `algorithmBreakdown` diagnosis id to the threshold keys that the
 * tuning UI should surface as editable inputs on that diagnosis card. Keep
 * this in sync with the `createScoringCriterion` calls in
 * `generateScoringBreakdown`.
 */
export const DIAGNOSIS_THRESHOLD_MAP: Record<string, readonly ThresholdKey[]> = {
  eds: [
    'EDS_SCORE_MIN',
    'EDS_SCORE_MAX',
    'NAP_EDS_MIN_DAYS',
    'NAP_EDS_MIN_DURATION',
    'MIN_RECOMMENDED_SLEEP_HOURS',
  ],
  'insufficient-sleep': ['MIN_RECOMMENDED_SLEEP_HOURS'],
  insomnia: [
    'SOL_MILD_MIN',
    'SOL_MILD_MAX',
    'SOL_MODERATE',
    'WASO_MILD_MIN',
    'WASO_MILD_MAX',
    'WASO_MODERATE',
    'SLEEP_EFFICIENCY_NORMAL',
    'TIREDNESS_MILD_MIN',
    'TIREDNESS_MILD_MAX',
    'TIREDNESS_MODERATE',
    'FATIGUE_MILD_MIN',
    'FATIGUE_MILD_MAX',
    'FATIGUE_MODERATE',
  ],
  'sleep-apnea': [
    'APNEA_AGE_RISK',
    'APNEA_BMI_RISK',
    'APNEA_TIREDNESS_THRESHOLD',
    'APNEA_MILD_FACTORS',
    'APNEA_MODERATE_FACTORS',
  ],
  comisa: [],
  rls: [],
  narcolepsy: [],
  nightmares: ['NIGHTMARE_DISORDER_THRESHOLD', 'BAD_DREAM_WARNING_THRESHOLD'],
  'chronic-fatigue': ['FATIGUE_CHRONIC', 'TIREDNESS_MODERATE'],
  'pain-related': [],
  'leg-cramps': ['LEG_CRAMPS_CONCERN_THRESHOLD'],
};

/**
 * Diagnosis ids for which we should show the EDS activity weights editor.
 * Only EDS currently uses the per-activity weights.
 */
export const DIAGNOSIS_EDS_WEIGHTS_IDS: readonly string[] = ['eds'];

export function mergeThresholdOverrides(
  overrides?: Partial<ThresholdConfig> | null
): ThresholdConfig {
  return {
    ...THRESHOLDS,
    ...overrides,
  };
}

export function mergeEDSWeightOverrides(
  overrides?: Partial<EDSWeightsConfig> | null
): EDSWeightsConfig {
  const mergedWeights: EDSWeightsConfig = {
    ...EDS_WEIGHTS,
  };

  if (!overrides) {
    return mergedWeights;
  }

  for (const key of Object.keys(overrides)) {
    const value = overrides[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      mergedWeights[key] = value;
    }
  }

  return mergedWeights;
}

export function createNumericOverridesSchema(keys: readonly string[]) {
  const shape: Record<string, z.ZodOptional<z.ZodNumber>> = {};

  for (const key of keys) {
    shape[key] = z.number().finite().optional();
  }

  return z.object(shape).partial();
}
