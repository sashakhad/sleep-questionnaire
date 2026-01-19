/**
 * Sleep Diagnosis Algorithms
 *
 * This module contains pure functions for diagnosing sleep conditions.
 * All logic is extracted here to enable comprehensive unit testing
 * without requiring UI interaction.
 *
 * IMPORTANT: All threshold values are defined as named constants
 * for easy auditing and modification by clinical staff.
 */

import { QuestionnaireFormData } from '@/validations/questionnaire';

// =============================================================================
// THRESHOLD CONSTANTS
// =============================================================================

// Sleep duration thresholds (in hours)
export const THRESHOLDS = {
  // Minimum recommended sleep for adults
  MIN_RECOMMENDED_SLEEP_HOURS: 7,

  // Sleep Onset Latency (SOL) thresholds (in minutes)
  SOL_MILD_MIN: 30,
  SOL_MILD_MAX: 45,
  SOL_MODERATE: 45,

  // Wake After Sleep Onset (WASO) thresholds (in minutes)
  WASO_MILD_MIN: 40,
  WASO_MILD_MAX: 60,
  WASO_MODERATE: 60,

  // Sleep efficiency threshold
  SLEEP_EFFICIENCY_NORMAL: 85,

  // Tiredness/Fatigue rating thresholds
  TIREDNESS_MILD_MIN: 5,
  TIREDNESS_MILD_MAX: 7,
  TIREDNESS_MODERATE: 7,
  FATIGUE_MILD_MIN: 3,
  FATIGUE_MILD_MAX: 5,
  FATIGUE_MODERATE: 5,
  FATIGUE_CHRONIC: 7,

  // EDS (Excessive Daytime Sleepiness) thresholds
  EDS_SCORE_MIN: 2,
  EDS_SCORE_MAX: 7,

  // Sleep Apnea thresholds
  APNEA_AGE_RISK: 60,
  APNEA_BMI_RISK: 25,
  APNEA_TIREDNESS_THRESHOLD: 3,
  APNEA_MILD_FACTORS: 1,
  APNEA_MODERATE_FACTORS: 3,

  // Nightmare/Bad dream thresholds
  NIGHTMARE_DISORDER_THRESHOLD: 2,
  BAD_DREAM_WARNING_THRESHOLD: 3,

  // Leg cramps threshold
  LEG_CRAMPS_CONCERN_THRESHOLD: 2,

  // Safety concern threshold
  SLEEPINESS_SAFETY_CONCERN: 8,
} as const;

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type SeverityLevel = 'none' | 'mild' | 'moderate' | 'severe' | 'moderate-to-severe';

export interface SleepMetrics {
  // Scheduled (work/school) days
  scheduledTST: number; // Total Sleep Time in hours
  scheduledSE: number; // Sleep Efficiency percentage
  scheduledSOL: number; // Sleep Onset Latency in minutes
  scheduledWASO: number; // Wake After Sleep Onset in minutes
  scheduledTimeInBed: number; // Time in bed in hours

  // Unscheduled (weekend) days
  unscheduledTST: number;
  unscheduledSE: number;
  unscheduledSOL: number;
  unscheduledWASO: number;
  unscheduledTimeInBed: number;

  // Weekly averages
  weeklyAverageTST: number;
  sleepVariability: number;
}

export interface EDSResult {
  score: number;
  severity: SeverityLevel;
  hasDifficultyStayingAwake: boolean;
}

export interface InsomniaDiagnosis {
  hasSleepOnsetInsomnia: boolean;
  hasMaintenanceInsomnia: boolean;
  hasInsomnia: boolean;
  severity: SeverityLevel;
  daytimeImpactCount: number;
}

export interface SleepApneaDiagnosis {
  hasSnoringOnly: boolean;
  hasMouthBreathingOnly: boolean;
  hasMildRespiratoryDisturbance: boolean;
  hasProbableSleepApnea: boolean;
  severity: SeverityLevel;
  riskFactorCount: number;
}

export interface ChronicFatigueDiagnosis {
  hasSymptoms: boolean;
  symptomCount: number;
  hasInsomnia: boolean;
}

export interface PainRelatedSleepDisturbance {
  hasCondition: boolean;
  symptomCount: number;
}

export interface MedicationRelatedSleepDisturbance {
  hasCondition: boolean;
  relevantMedications: string[];
}

export interface NightmareDiagnosis {
  hasNightmareDisorder: boolean;
  hasBadDreamWarning: boolean;
  nightmaresPerWeek: number;
  badDreamsPerWeek: number;
}

export interface TreatmentEffectiveness {
  osaTreatmentIneffective: boolean;
  rlsTreatmentIneffective: boolean;
}

export interface DiagnosisReport {
  sleepMetrics: SleepMetrics;
  eds: EDSResult;
  insufficientSleep: boolean;
  insomnia: InsomniaDiagnosis;
  sleepApnea: SleepApneaDiagnosis;
  hasCOMISA: boolean;
  hasRLS: boolean;
  hasLegCrampsConcern: boolean;
  chronicFatigue: ChronicFatigueDiagnosis;
  painRelated: PainRelatedSleepDisturbance;
  medicationRelated: MedicationRelatedSleepDisturbance;
  nightmares: NightmareDiagnosis;
  treatmentEffectiveness: TreatmentEffectiveness;
  hasNarcolepsy: boolean;
  chronotype: string;
  hasSevereTiredness: boolean;
  hasAnxiety: boolean;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Parse time string (HH:MM) to minutes from midnight
 */
export function timeToMinutes(
  time: string | undefined,
  defaultHours: number,
  defaultMinutes: number = 0
): number {
  if (!time || time.trim() === '') {
    return defaultHours * 60 + defaultMinutes;
  }
  const parts = time.split(':');
  const hours = parseInt(parts[0] ?? String(defaultHours), 10);
  const minutes = parseInt(parts[1] ?? String(defaultMinutes), 10);

  if (Number.isNaN(hours)) {
    return defaultHours * 60 + defaultMinutes;
  }
  if (Number.isNaN(minutes)) {
    return hours * 60;
  }
  return hours * 60 + minutes;
}

/**
 * Parse minute increment string to number
 */
export function parseMinuteIncrement(value: string | null): number {
  if (!value) {
    return 0;
  }
  if (value === '>120') {
    return 130; // Use 130 for "more than 120"
  }
  return parseInt(value, 10) || 0;
}

/**
 * Calculate BMI from height (inches) and weight (pounds)
 */
export function calculateBMI(
  heightInches: number | null,
  weightPounds: number | null
): number | null {
  if (!heightInches || !weightPounds || heightInches <= 0 || weightPounds <= 0) {
    return null;
  }
  // BMI = (weight in pounds × 703) / (height in inches)²
  return (weightPounds * 703) / (heightInches * heightInches);
}

/**
 * Calculate age from year of birth
 */
export function calculateAge(yearOfBirth: number): number {
  const currentYear = new Date().getFullYear();
  return currentYear - yearOfBirth;
}

// =============================================================================
// SLEEP METRICS CALCULATION
// =============================================================================

/**
 * Calculate comprehensive sleep metrics from questionnaire data
 */
export function calculateSleepMetrics(data: QuestionnaireFormData): SleepMetrics {
  // Scheduled (work/school) days calculations
  const scheduledBedtimeMinutes = timeToMinutes(data.scheduledSleep.lightsOutTime, 22, 0);
  const scheduledWaketimeMinutes = timeToMinutes(data.scheduledSleep.wakeupTime, 7, 0);

  let scheduledTimeInBedMinutes = scheduledWaketimeMinutes - scheduledBedtimeMinutes;
  if (scheduledTimeInBedMinutes < 0) {
    scheduledTimeInBedMinutes += 1440; // 24 hours in minutes
  }

  const scheduledSOL = parseMinuteIncrement(data.scheduledSleep.minutesToFallAsleep);
  const scheduledWASO = parseMinuteIncrement(data.scheduledSleep.minutesAwakeAtNight);
  const scheduledTSTMinutes = Math.max(0, scheduledTimeInBedMinutes - scheduledSOL - scheduledWASO);
  const scheduledTST = scheduledTSTMinutes / 60;
  const scheduledSE =
    scheduledTimeInBedMinutes > 0 ? (scheduledTSTMinutes / scheduledTimeInBedMinutes) * 100 : 0;

  // Unscheduled (weekend) days calculations
  const unscheduledBedtimeMinutes = timeToMinutes(data.unscheduledSleep.lightsOutTime, 23, 0);
  const unscheduledWaketimeMinutes = timeToMinutes(data.unscheduledSleep.wakeupTime, 9, 0);

  let unscheduledTimeInBedMinutes = unscheduledWaketimeMinutes - unscheduledBedtimeMinutes;
  if (unscheduledTimeInBedMinutes < 0) {
    unscheduledTimeInBedMinutes += 1440;
  }

  const unscheduledSOL = parseMinuteIncrement(data.unscheduledSleep.minutesToFallAsleep);
  const unscheduledWASO = parseMinuteIncrement(data.unscheduledSleep.minutesAwakeAtNight);
  const unscheduledTSTMinutes = Math.max(
    0,
    unscheduledTimeInBedMinutes - unscheduledSOL - unscheduledWASO
  );
  const unscheduledTST = unscheduledTSTMinutes / 60;
  const unscheduledSE =
    unscheduledTimeInBedMinutes > 0
      ? (unscheduledTSTMinutes / unscheduledTimeInBedMinutes) * 100
      : 0;

  // Weekly average: 5 scheduled days + 2 unscheduled days
  const weeklyAverageTST = (scheduledTST * 5 + unscheduledTST * 2) / 7;

  return {
    scheduledTST,
    scheduledSE,
    scheduledSOL,
    scheduledWASO,
    scheduledTimeInBed: scheduledTimeInBedMinutes / 60,
    unscheduledTST,
    unscheduledSE,
    unscheduledSOL,
    unscheduledWASO,
    unscheduledTimeInBed: unscheduledTimeInBedMinutes / 60,
    weeklyAverageTST,
    sleepVariability: Math.abs(scheduledTST - unscheduledTST),
  };
}

// =============================================================================
// EDS (EXCESSIVE DAYTIME SLEEPINESS) SCORING
// =============================================================================

const EDS_WEIGHTS: Record<string, number> = {
  stoplight: 2,
  lectures: 1,
  working: 1,
  conversation: 2,
  evening: 1,
  meal: 2,
};

/**
 * Calculate EDS score and severity
 *
 * New algorithm per client feedback:
 * - Difficulty staying awake during the day AND
 * - Falling asleep during day score 2-7 AND
 * - Total sleep time (weekly average) determines EDS vs Insufficient Sleep
 */
export function calculateEDSScore(data: QuestionnaireFormData): EDSResult {
  let score = 0;
  for (const activity of data.daytime.fallAsleepDuring) {
    score += EDS_WEIGHTS[activity] ?? 1;
  }

  // Check for difficulty staying awake
  const hasDifficultyStayingAwake =
    data.daytime.sleepinessInterferes ||
    data.daytime.fallAsleepDuring.length >= 2;

  let severity: SeverityLevel = 'none';
  if (score >= 7) {
    severity = 'severe';
  } else if (score >= 5) {
    severity = 'moderate';
  } else if (score >= THRESHOLDS.EDS_SCORE_MIN) {
    severity = 'mild';
  }

  return { score, severity, hasDifficultyStayingAwake };
}

/**
 * Determine if patient has Insufficient Sleep Syndrome vs EDS
 *
 * Insufficient Sleep: EDS symptoms + weekly average sleep < 7 hours
 * EDS: EDS symptoms + weekly average sleep >= 7 hours
 */
export function hasInsufficientSleepSyndrome(
  edsResult: EDSResult,
  metrics: SleepMetrics,
  data: QuestionnaireFormData
): boolean {
  const hasEDSSymptoms =
    edsResult.hasDifficultyStayingAwake &&
    edsResult.score >= THRESHOLDS.EDS_SCORE_MIN &&
    edsResult.score <= THRESHOLDS.EDS_SCORE_MAX;

  // Must NOT have narcolepsy or sleep apnea to be insufficient sleep
  const hasNarcolepsy =
    data.daytime.diagnosedNarcolepsy ||
    (data.daytime.weaknessWhenExcited.length > 0 && data.daytime.sleepParalysis);

  const hasApneaSymptoms =
    data.breathingDisorders.stopsBreathing ||
    (data.breathingDisorders.snores && data.breathingDisorders.wakesWithDryMouth);

  return (
    hasEDSSymptoms &&
    metrics.weeklyAverageTST < THRESHOLDS.MIN_RECOMMENDED_SLEEP_HOURS &&
    !hasNarcolepsy &&
    !hasApneaSymptoms
  );
}

// =============================================================================
// INSOMNIA DIAGNOSIS
// =============================================================================

/**
 * Diagnose insomnia with new two-tier severity system
 *
 * MILD:
 * - SOL 30-45 min OR WASO 40-60 min OR poor sleep quality
 * - Plus ONE of: sleepiness interferes, non-restorative, tiredness 5-7, fatigue 3-5
 *
 * MODERATE TO SEVERE:
 * - SOL >45 min OR WASO >60 min OR poor sleep quality
 * - Plus TWO of: sleepiness interferes, non-restorative, tiredness 7+, fatigue 5+
 */
export function diagnoseInsomnia(
  data: QuestionnaireFormData,
  metrics: SleepMetrics
): InsomniaDiagnosis {
  const { scheduledSOL, scheduledWASO } = metrics;
  const tiredness = data.daytime.tirednessRating ?? 0;
  const fatigue = data.daytime.fatigueRating ?? 0;

  // Sleep onset insomnia (difficulty falling asleep)
  const hasSleepOnsetInsomnia = scheduledSOL >= THRESHOLDS.SOL_MILD_MIN;

  // Maintenance insomnia (difficulty staying asleep)
  const hasMaintenanceInsomnia = scheduledWASO >= THRESHOLDS.WASO_MILD_MIN;

  // Poor sleep quality indicator
  const hasPoorSleepQuality =
    data.daytime.nonRestorativeSleep || metrics.scheduledSE < THRESHOLDS.SLEEP_EFFICIENCY_NORMAL;

  // Check sleep disturbance criteria
  const hasMildSleepDisturbance =
    (scheduledSOL >= THRESHOLDS.SOL_MILD_MIN && scheduledSOL <= THRESHOLDS.SOL_MILD_MAX) ||
    (scheduledWASO >= THRESHOLDS.WASO_MILD_MIN && scheduledWASO <= THRESHOLDS.WASO_MILD_MAX) ||
    hasPoorSleepQuality;

  const hasModerateToSevereSleepDisturbance =
    scheduledSOL > THRESHOLDS.SOL_MODERATE ||
    scheduledWASO > THRESHOLDS.WASO_MODERATE ||
    hasPoorSleepQuality;

  // Count daytime impact symptoms
  const mildDaytimeSymptoms = [
    data.daytime.sleepinessInterferes,
    data.daytime.nonRestorativeSleep,
    tiredness >= THRESHOLDS.TIREDNESS_MILD_MIN && tiredness <= THRESHOLDS.TIREDNESS_MILD_MAX,
    fatigue >= THRESHOLDS.FATIGUE_MILD_MIN && fatigue <= THRESHOLDS.FATIGUE_MILD_MAX,
  ].filter(Boolean).length;

  const moderateDaytimeSymptoms = [
    data.daytime.sleepinessInterferes,
    data.daytime.nonRestorativeSleep,
    tiredness >= THRESHOLDS.TIREDNESS_MODERATE,
    fatigue >= THRESHOLDS.FATIGUE_MODERATE,
  ].filter(Boolean).length;

  // Determine severity
  let severity: SeverityLevel = 'none';
  let hasInsomnia = false;

  if (hasModerateToSevereSleepDisturbance && moderateDaytimeSymptoms >= 2) {
    severity = 'moderate-to-severe';
    hasInsomnia = true;
  } else if (hasMildSleepDisturbance && mildDaytimeSymptoms >= 1) {
    severity = 'mild';
    hasInsomnia = true;
  }

  return {
    hasSleepOnsetInsomnia,
    hasMaintenanceInsomnia,
    hasInsomnia,
    severity,
    daytimeImpactCount: Math.max(mildDaytimeSymptoms, moderateDaytimeSymptoms),
  };
}

// =============================================================================
// SLEEP APNEA DIAGNOSIS
// =============================================================================

/**
 * Diagnose sleep apnea with new algorithm
 *
 * SNORING ONLY or MOUTH BREATHING ONLY: Mild respiratory disturbance
 *
 * PROBABLE SLEEP APNEA:
 * - Pauses/gasping in breathing, OR
 * - Snoring + risk factors:
 *   - 1 factor = mild
 *   - 3+ factors = moderate to severe
 *   - Factors: Age >60, BMI >25, tiredness/sleepiness/fatigue >3, non-restorative sleep
 */
export function diagnoseSleepApnea(data: QuestionnaireFormData): SleepApneaDiagnosis {
  const { snores, stopsBreathing, mouthBreathes } = data.breathingDisorders;

  // Snoring only (no other symptoms)
  const hasSnoringOnly = snores && !stopsBreathing && !mouthBreathes;

  // Mouth breathing only (no other symptoms)
  const hasMouthBreathingOnly = mouthBreathes && !snores && !stopsBreathing;

  // Mild respiratory disturbance
  const hasMildRespiratoryDisturbance = hasSnoringOnly || hasMouthBreathingOnly;

  // Calculate risk factors
  const age = calculateAge(data.demographics.yearOfBirth);
  const bmi = calculateBMI(data.demographics.height, data.demographics.weight);
  const tiredness = data.daytime.tirednessRating ?? 0;
  const fatigue = data.daytime.fatigueRating ?? 0;
  const maxTirednessScore = Math.max(tiredness, fatigue);

  const riskFactors = [
    age > THRESHOLDS.APNEA_AGE_RISK,
    bmi !== null && bmi > THRESHOLDS.APNEA_BMI_RISK,
    maxTirednessScore > THRESHOLDS.APNEA_TIREDNESS_THRESHOLD,
    data.daytime.nonRestorativeSleep,
  ];
  const riskFactorCount = riskFactors.filter(Boolean).length;

  // Determine if probable sleep apnea
  const hasProbableSleepApnea =
    stopsBreathing || (snores && riskFactorCount >= THRESHOLDS.APNEA_MILD_FACTORS);

  // Determine severity
  let severity: SeverityLevel = 'none';
  if (hasProbableSleepApnea) {
    if (stopsBreathing || riskFactorCount >= THRESHOLDS.APNEA_MODERATE_FACTORS) {
      severity = 'moderate-to-severe';
    } else {
      severity = 'mild';
    }
  } else if (hasMildRespiratoryDisturbance) {
    severity = 'mild';
  }

  return {
    hasSnoringOnly,
    hasMouthBreathingOnly,
    hasMildRespiratoryDisturbance,
    hasProbableSleepApnea,
    severity,
    riskFactorCount,
  };
}

// =============================================================================
// COMISA (Comorbid Insomnia and Sleep Apnea)
// =============================================================================

/**
 * Check for COMISA - when both insomnia AND sleep apnea symptoms present
 */
export function hasCOMISA(insomnia: InsomniaDiagnosis, sleepApnea: SleepApneaDiagnosis): boolean {
  return (
    insomnia.hasInsomnia &&
    (sleepApnea.hasProbableSleepApnea || sleepApnea.hasMildRespiratoryDisturbance)
  );
}

// =============================================================================
// RESTLESS LEGS SYNDROME
// =============================================================================

/**
 * Diagnose RLS based on classic symptoms
 */
export function diagnoseRLS(data: QuestionnaireFormData): boolean {
  return (
    data.restlessLegs.troubleLyingStill &&
    data.restlessLegs.urgeToMoveLegs &&
    data.restlessLegs.movementRelieves
  );
}

/**
 * Check if leg cramps are a concern (frequency-based when available)
 */
export function hasLegCrampsConcern(data: QuestionnaireFormData): boolean {
  if (!data.restlessLegs.legCramps) {
    return false;
  }

  // If we have frequency data, use threshold
  const legCrampsFrequency = (data.restlessLegs as Record<string, unknown>).legCrampsPerWeek as
    | number
    | undefined;
  if (typeof legCrampsFrequency === 'number') {
    return legCrampsFrequency >= THRESHOLDS.LEG_CRAMPS_CONCERN_THRESHOLD;
  }

  // Fall back to boolean (assume concern if checked)
  return data.restlessLegs.legCramps;
}

// =============================================================================
// CHRONIC FATIGUE / FIBROMYALGIA
// =============================================================================

/**
 * Screen for chronic fatigue / fibromyalgia symptoms
 *
 * Criteria: Insomnia symptoms AND/OR 3+ of:
 * - Sleepiness interferes
 * - Non-restorative sleep
 * - Tiredness rating 7+
 * - Fatigue rating >7
 * - Aches/pains AND/OR joint pain
 */
export function screenChronicFatigue(
  data: QuestionnaireFormData,
  insomnia: InsomniaDiagnosis
): ChronicFatigueDiagnosis {
  const tiredness = data.daytime.tirednessRating ?? 0;
  const fatigue = data.daytime.fatigueRating ?? 0;

  const symptoms = [
    data.daytime.sleepinessInterferes,
    data.daytime.nonRestorativeSleep,
    tiredness >= THRESHOLDS.TIREDNESS_MODERATE,
    fatigue > THRESHOLDS.FATIGUE_CHRONIC,
    data.daytime.painAffectsSleep || data.daytime.jointMusclePain,
  ];

  const symptomCount = symptoms.filter(Boolean).length;
  const hasSymptoms = insomnia.hasInsomnia || symptomCount >= 3;

  return {
    hasSymptoms,
    symptomCount,
    hasInsomnia: insomnia.hasInsomnia,
  };
}

// =============================================================================
// PAIN-RELATED SLEEP DISTURBANCE
// =============================================================================

/**
 * Diagnose pain-related sleep disturbance
 *
 * At least two of:
 * - Aches and Pains and/or Joint pain
 * - Sleepiness interferes with daily activities
 * - Non-restorative sleep
 * - Tiredness rating 7+
 * - Fatigue rating 5+
 */
export function diagnosePainRelatedSleepDisturbance(
  data: QuestionnaireFormData
): PainRelatedSleepDisturbance {
  const tiredness = data.daytime.tirednessRating ?? 0;
  const fatigue = data.daytime.fatigueRating ?? 0;

  const symptoms = [
    data.daytime.painAffectsSleep || data.daytime.jointMusclePain,
    data.daytime.sleepinessInterferes,
    data.daytime.nonRestorativeSleep,
    tiredness >= THRESHOLDS.TIREDNESS_MODERATE,
    fatigue >= THRESHOLDS.FATIGUE_MODERATE,
  ];

  const symptomCount = symptoms.filter(Boolean).length;
  const hasPain = data.daytime.painAffectsSleep || data.daytime.jointMusclePain;

  return {
    hasCondition: hasPain && symptomCount >= 2,
    symptomCount,
  };
}

// =============================================================================
// MEDICATION-RELATED SLEEP DISTURBANCE
// =============================================================================

const SLEEP_AFFECTING_SUPPLEMENTS = ['melatonin', 'benadryl', 'tylenol_pm', 'nyquil', 'unisom'];
const SLEEP_AFFECTING_PRESCRIPTIONS = ['antidepressants', 'antipsychotic', 'benzos', 'z_drugs'];

/**
 * Check for medication-related sleep disturbance
 */
export function diagnoseMedicationRelatedSleepDisturbance(
  data: QuestionnaireFormData
): MedicationRelatedSleepDisturbance {
  const relevantMedications: string[] = [];

  // Check supplements
  for (const supplement of data.sleepHygiene.supplements) {
    if (SLEEP_AFFECTING_SUPPLEMENTS.includes(supplement)) {
      relevantMedications.push(supplement);
    }
  }

  // Check prescription medications
  for (const med of data.sleepHygiene.prescriptionMeds) {
    if (SLEEP_AFFECTING_PRESCRIPTIONS.includes(med)) {
      relevantMedications.push(med);
    }
  }

  // Check medical conditions that suggest medication use
  const hasMedicalConditionsWithMeds =
    data.mentalHealth.diagnosedMedicalConditions.includes('hypertension') ||
    data.mentalHealth.diagnosedMedicalConditions.includes('heart_disease') ||
    data.mentalHealth.diagnosedMentalHealthConditions.length > 0;

  // Has condition if they're on medications AND have sleep issues
  const hasSleepIssues =
    data.daytime.sleepinessInterferes ||
    data.daytime.nonRestorativeSleep ||
    (data.daytime.tirednessRating ?? 0) >= 5 ||
    (data.daytime.fatigueRating ?? 0) >= 5;

  return {
    hasCondition:
      (relevantMedications.length > 0 || hasMedicalConditionsWithMeds) && hasSleepIssues,
    relevantMedications,
  };
}

// =============================================================================
// NIGHTMARE DIAGNOSIS
// =============================================================================

/**
 * Diagnose nightmare disorder and bad dreams
 *
 * - Nightmares 2+/week = nightmare parasomnia/disorder
 * - Bad dreams 3+/week = bad dreams warning
 */
export function diagnoseNightmares(data: QuestionnaireFormData): NightmareDiagnosis {
  // Get nightmare frequency (new field or fallback to old)
  const nightmaresPerWeek = data.nightmares.nightmaresPerWeek ?? 0;

  // Get bad dreams frequency (new field, may not exist yet)
  const badDreamsPerWeek =
    ((data.nightmares as Record<string, unknown>).badDreamsPerWeek as number) ?? 0;

  return {
    hasNightmareDisorder: nightmaresPerWeek >= THRESHOLDS.NIGHTMARE_DISORDER_THRESHOLD,
    hasBadDreamWarning: badDreamsPerWeek >= THRESHOLDS.BAD_DREAM_WARNING_THRESHOLD,
    nightmaresPerWeek,
    badDreamsPerWeek,
  };
}

// =============================================================================
// TREATMENT EFFECTIVENESS
// =============================================================================

/**
 * Check treatment effectiveness for diagnosed conditions
 */
export function checkTreatmentEffectiveness(data: QuestionnaireFormData): TreatmentEffectiveness {
  const sleepDisorders = data.sleepDisorderDiagnoses;

  // Check OSA treatment effectiveness (new field, may not exist yet)
  const osaTreatmentEffective =
    ((sleepDisorders as Record<string, unknown>).osaTreatmentEffective as boolean) ?? true;
  const osaTreatmentIneffective =
    sleepDisorders.diagnosedOSA && sleepDisorders.osaTreated && !osaTreatmentEffective;

  // Check RLS treatment effectiveness (new field, may not exist yet)
  const rlsTreatmentEffective =
    ((sleepDisorders as Record<string, unknown>).rlsTreatmentEffective as boolean) ?? true;
  const rlsTreatmentIneffective =
    sleepDisorders.diagnosedRLS && sleepDisorders.rlsTreated && !rlsTreatmentEffective;

  return {
    osaTreatmentIneffective,
    rlsTreatmentIneffective,
  };
}

// =============================================================================
// CHRONOTYPE DETECTION
// =============================================================================

/**
 * Determine chronotype based on sleep timing and preferences
 */
export function determineChronotype(data: QuestionnaireFormData, metrics: SleepMetrics): string {
  const scheduledBedtimeMinutes = timeToMinutes(data.scheduledSleep.lightsOutTime, 22, 0);
  const scheduledBedtimeHours = scheduledBedtimeMinutes / 60;
  const midSleepScheduled = scheduledBedtimeHours + metrics.scheduledTST / 2;

  // Normalize mid-sleep to handle times past midnight
  const normalizedMidSleep = midSleepScheduled > 24 ? midSleepScheduled - 24 : midSleepScheduled;

  if (data.chronotype.preference === 'late' || normalizedMidSleep >= 4) {
    return 'evening (night owl)';
  } else if (data.chronotype.preference === 'early' || normalizedMidSleep <= 1) {
    return 'morning (early bird)';
  }
  return 'flexible';
}

// =============================================================================
// NARCOLEPSY SCREENING
// =============================================================================

/**
 * Screen for narcolepsy symptoms
 */
export function screenNarcolepsy(data: QuestionnaireFormData): boolean {
  return (
    data.daytime.diagnosedNarcolepsy ||
    (data.daytime.weaknessWhenExcited.length > 0 && data.daytime.sleepParalysis)
  );
}

// =============================================================================
// MAIN DIAGNOSIS FUNCTION
// =============================================================================

/**
 * Generate complete diagnosis report from questionnaire data
 */
export function generateDiagnosisReport(data: QuestionnaireFormData): DiagnosisReport {
  // Calculate base metrics
  const sleepMetrics = calculateSleepMetrics(data);

  // Individual diagnoses
  const eds = calculateEDSScore(data);
  const insomnia = diagnoseInsomnia(data, sleepMetrics);
  const sleepApnea = diagnoseSleepApnea(data);
  const chronicFatigue = screenChronicFatigue(data, insomnia);
  const painRelated = diagnosePainRelatedSleepDisturbance(data);
  const medicationRelated = diagnoseMedicationRelatedSleepDisturbance(data);
  const nightmares = diagnoseNightmares(data);
  const treatmentEffectiveness = checkTreatmentEffectiveness(data);

  // Composite diagnoses
  const insufficientSleep = hasInsufficientSleepSyndrome(eds, sleepMetrics, data);
  const comisa = hasCOMISA(insomnia, sleepApnea);
  const hasRLS = diagnoseRLS(data);
  const legCrampsConcern = hasLegCrampsConcern(data);
  const hasNarcolepsy = screenNarcolepsy(data);
  const chronotype = determineChronotype(data, sleepMetrics);

  // Additional flags
  const hasSevereTiredness =
    (data.daytime.sleepinessSeverity ?? 0) > THRESHOLDS.SLEEPINESS_SAFETY_CONCERN;
  const hasAnxiety = data.mentalHealth.worriesAffectSleep || data.mentalHealth.anxietyInBed;

  return {
    sleepMetrics,
    eds,
    insufficientSleep,
    insomnia,
    sleepApnea,
    hasCOMISA: comisa,
    hasRLS,
    hasLegCrampsConcern: legCrampsConcern,
    chronicFatigue,
    painRelated,
    medicationRelated,
    nightmares,
    treatmentEffectiveness,
    hasNarcolepsy,
    chronotype,
    hasSevereTiredness,
    hasAnxiety,
  };
}
