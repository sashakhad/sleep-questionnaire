/**
 * Sleep Diagnosis Algorithms
 *
 * This module contains pure functions for diagnosing sleep conditions.
 * All logic is extracted here to enable comprehensive unit testing
 * without requiring UI interaction.
 *
 * IMPORTANT: All threshold values are defined as named constants
 * for easy auditing and modification by clinical staff.
 *
 * This module is server-only. Importing it in a client component will cause
 * a build-time error, preventing algorithm logic from being bundled to the browser.
 */

import 'server-only';
import { getYear } from 'date-fns';
import { QuestionnaireFormData } from '@/validations/questionnaire';
import { EDS_WEIGHTS } from '@/lib/diagnosis-shared';

// =============================================================================
// THRESHOLD CONSTANTS
// =============================================================================

// Sleep duration thresholds (in hours)
export const THRESHOLDS = {
  // Minimum recommended sleep for adults
  MIN_RECOMMENDED_SLEEP_HOURS: 7,

  // Planned nap thresholds for EDS
  NAP_EDS_MIN_DAYS: 3,
  NAP_EDS_MIN_DURATION: 30,

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
  hasEDSFromNaps: boolean;
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
  return getYear(new Date()) - yearOfBirth;
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
    data.daytime.sleepinessInterferes || data.daytime.fallAsleepDuring.length >= 2;

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
 * Planned naps are an additional daytime sleepiness signal from the original SOW.
 */
export function hasEDSFromPlannedNaps(data: QuestionnaireFormData): boolean {
  const napDurationMinutes = parseMinuteIncrement(data.daytime.plannedNaps.duration);

  return (
    data.daytime.plannedNaps.daysPerWeek >= THRESHOLDS.NAP_EDS_MIN_DAYS &&
    napDurationMinutes >= THRESHOLDS.NAP_EDS_MIN_DURATION
  );
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
    (edsResult.hasDifficultyStayingAwake &&
      edsResult.score >= THRESHOLDS.EDS_SCORE_MIN &&
      edsResult.score <= THRESHOLDS.EDS_SCORE_MAX) ||
    hasEDSFromPlannedNaps(data);

  // Must NOT have narcolepsy or sleep apnea to be insufficient sleep
  const hasNarcolepsy =
    data.daytime.diagnosedNarcolepsy ||
    data.sleepDisorderDiagnoses.diagnosedDisorders?.includes('narcolepsy') ||
    data.sleepDisorderDiagnoses.diagnosedDisorders?.includes('hypersomnia') ||
    (data.daytime.weaknessWhenExcited.length > 0 && data.daytime.sleepParalysis);
  const hasProbableSleepApnea = diagnoseSleepApnea(data).hasProbableSleepApnea;

  return (
    hasEDSSymptoms &&
    metrics.weeklyAverageTST < THRESHOLDS.MIN_RECOMMENDED_SLEEP_HOURS &&
    !hasNarcolepsy &&
    !hasProbableSleepApnea
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

  // Snoring and mouth breathing together still indicate at least mild respiratory disturbance
  // when they do not meet the probable apnea threshold.
  const hasMildRespiratoryDisturbance =
    !hasProbableSleepApnea && !stopsBreathing && (snores || mouthBreathes);

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
    data.sleepDisorderDiagnoses.diagnosedDisorders?.includes('narcolepsy') ||
    data.sleepDisorderDiagnoses.diagnosedDisorders?.includes('hypersomnia') ||
    (data.daytime.weaknessWhenExcited.length > 0 && data.daytime.sleepParalysis)
  );
}

// =============================================================================
// FULL REPORT RESULT (server-computed, sent to client for display only)
// =============================================================================

/**
 * Extended sleep metrics for the patient-facing report display.
 * Includes mid-sleep times, social jet lag, and chronotype data in addition
 * to the core SleepMetrics used for clinical diagnosis.
 */
export interface ReportDisplayMetrics {
  scheduledTST: number;
  unscheduledTST: number;
  scheduledSE: number;
  unscheduledSE: number;
  scheduledSOL: number;
  unscheduledSOL: number;
  scheduledWASO: number;
  unscheduledWASO: number;
  midSleepScheduled: string; // formatted "HH:MM"
  midSleepUnscheduled: string; // formatted "HH:MM"
  weeklyAvgTST: number;
  socialJetLag: number;
  midSleepTimeChange: number;
}

export type InsomniaSeverityLabel = 'none' | 'mild' | 'moderate-to-severe';
export type ChronotypeType = 'delayed' | 'advanced' | 'normal';

/**
 * Complete set of pre-computed findings for rendering the patient report.
 * Returned by the /api/diagnose server route so that zero algorithm logic
 * is shipped to the browser.
 */
export interface FullReportResult {
  metrics: ReportDisplayMetrics;
  chronotypeLabel: string;
  chronotypeType: ChronotypeType;
  edsScore: number;
  edsSeverity: SeverityLevel;
  hasEDSFromNaps: boolean;
  hasInsomnia: boolean;
  insomniaSeverity: InsomniaSeverityLabel;
  hasOSA: boolean;
  hasCOMISA: boolean;
  hasRLS: boolean;
  hasNightmares: boolean;
  hasNarcolepsy: boolean;
  hasEDS: boolean;
  hasInsufficientSleep: boolean;
  hasMildRespiratoryDisturbance: boolean;
  hasPoorHygiene: boolean;
  hasLegCrampsConcern: boolean;
  hasChronicFatigueSymptoms: boolean;
  hasPainAffectingSleep: boolean;
  hasPainRelatedSleepDisturbance: boolean;
  hasMedicationRelatedSleepDisturbance: boolean;
  osaTreatmentIneffective: boolean;
  rlsTreatmentIneffective: boolean;
  hasDiagnosedOSA: boolean;
  hasDiagnosedRLS: boolean;
  hasSevereTiredness: boolean;
  hasParasomniaSafetyRisk: boolean;
  hasMedicationAlcoholRisk: boolean;
  avgWeeklySleep: number;
  algorithmBreakdown?: ScoringBreakdown;
}

export interface ScoringMetric {
  label: string;
  value: string;
  note?: string;
}

export interface ScoringCriterion {
  label: string;
  actual: string;
  threshold?: string;
  met: boolean;
}

export interface DiagnosticBreakdown {
  id: string;
  label: string;
  outcome: string;
  criteria: ScoringCriterion[];
  notes?: string[];
}

export interface ScoringBreakdown {
  metrics: ScoringMetric[];
  diagnoses: DiagnosticBreakdown[];
}

// Internal helper — not exported, not discoverable from bundle
function minutesToTimeString(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const mins = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function calculateReportDisplayMetrics(data: QuestionnaireFormData): ReportDisplayMetrics {
  const toMins = (time: string): number => timeToMinutes(time, 0, 0);

  const scheduledBedtime = toMins(data.scheduledSleep.lightsOutTime);
  const scheduledWaketime = toMins(data.scheduledSleep.wakeupTime);
  let scheduledTimeInBed = scheduledWaketime - scheduledBedtime;
  if (scheduledTimeInBed < 0) {
    scheduledTimeInBed += 1440;
  }

  const scheduledSOL = parseMinuteIncrement(data.scheduledSleep.minutesToFallAsleep);
  const scheduledWASO = parseMinuteIncrement(data.scheduledSleep.minutesAwakeAtNight);
  const scheduledTSTMins = scheduledTimeInBed - scheduledSOL - scheduledWASO;
  const scheduledSE = scheduledTimeInBed > 0 ? (scheduledTSTMins / scheduledTimeInBed) * 100 : 0;
  const scheduledMidSleep = scheduledBedtime + scheduledSOL + scheduledTSTMins / 2;

  const unscheduledBedtime = toMins(data.unscheduledSleep.lightsOutTime);
  const unscheduledWaketime = toMins(data.unscheduledSleep.wakeupTime);
  let unscheduledTimeInBed = unscheduledWaketime - unscheduledBedtime;
  if (unscheduledTimeInBed < 0) {
    unscheduledTimeInBed += 1440;
  }

  const unscheduledSOL = parseMinuteIncrement(data.unscheduledSleep.minutesToFallAsleep);
  const unscheduledWASO = parseMinuteIncrement(data.unscheduledSleep.minutesAwakeAtNight);
  const unscheduledTSTMins = unscheduledTimeInBed - unscheduledSOL - unscheduledWASO;
  const unscheduledSE =
    unscheduledTimeInBed > 0 ? (unscheduledTSTMins / unscheduledTimeInBed) * 100 : 0;
  const unscheduledMidSleep = unscheduledBedtime + unscheduledSOL + unscheduledTSTMins / 2;

  const weeklyAvgTST = ((scheduledTSTMins / 60) * 5 + (unscheduledTSTMins / 60) * 2) / 7;
  const socialJetLag = (unscheduledTSTMins - scheduledTSTMins) / 60;

  let midSleepDiff = unscheduledMidSleep - scheduledMidSleep;
  if (midSleepDiff > 720) {
    midSleepDiff -= 1440;
  } else if (midSleepDiff < -720) {
    midSleepDiff += 1440;
  }
  const midSleepTimeChange = midSleepDiff / 60;

  return {
    scheduledTST: scheduledTSTMins / 60,
    unscheduledTST: unscheduledTSTMins / 60,
    scheduledSE,
    unscheduledSE,
    scheduledSOL,
    unscheduledSOL,
    scheduledWASO,
    unscheduledWASO,
    midSleepScheduled: minutesToTimeString(scheduledMidSleep % 1440),
    midSleepUnscheduled: minutesToTimeString(unscheduledMidSleep % 1440),
    weeklyAvgTST,
    socialJetLag,
    midSleepTimeChange,
  };
}

function mapInsomniaSeverityToReportLabel(insomnia: InsomniaDiagnosis): InsomniaSeverityLabel {
  if (!insomnia.hasInsomnia || insomnia.severity === 'none') {
    return 'none';
  }

  return insomnia.severity === 'moderate-to-severe' ? 'moderate-to-severe' : 'mild';
}

function getReportChronotype(
  metrics: ReportDisplayMetrics,
  preference: string
): { type: ChronotypeType; chronotypeLabel: string } {
  const midSleepHour = parseInt(metrics.midSleepUnscheduled.split(':')[0] ?? '0');
  const midSleepMinute = parseInt(metrics.midSleepUnscheduled.split(':')[1] ?? '0');
  const midSleepTotalMinutes = midSleepHour * 60 + midSleepMinute;
  // Adjust times past midnight so they sort correctly (e.g. 2am > midnight > 11pm)
  const adjustedMidSleep = midSleepHour < 12 ? midSleepTotalMinutes + 1440 : midSleepTotalMinutes;

  let chronotypeLabel = 'Neutral';
  if (adjustedMidSleep <= 1440) {
    chronotypeLabel = 'Probable Lark (Morning Person)';
  } else if (adjustedMidSleep >= 1740) {
    chronotypeLabel = 'Probable Owl (Night Person)';
  } else {
    chronotypeLabel = 'Intermediate';
  }

  let type: ChronotypeType = 'normal';
  if (preference === 'late' || adjustedMidSleep >= 1680) {
    type = 'delayed';
  } else if (preference === 'early' || adjustedMidSleep <= 1500) {
    type = 'advanced';
  }

  return { type, chronotypeLabel };
}

function resolveReportEDSSeverity(
  eds: EDSResult,
  hasEDSFromNaps: boolean,
  hasEDS: boolean
): SeverityLevel {
  if (!hasEDS) {
    return 'none';
  }
  if (eds.severity !== 'none') {
    return eds.severity;
  }
  if (hasEDSFromNaps) {
    return 'mild';
  }
  return 'none';
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
  const hasEDSFromNaps = hasEDSFromPlannedNaps(data);
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
    hasEDSFromNaps,
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

function formatBreakdownHours(hours: number): string {
  return `${hours.toFixed(1)} hours`;
}

function formatBreakdownMinutes(minutes: number): string {
  return `${minutes} minutes`;
}

function formatBreakdownPercent(percent: number): string {
  return `${percent.toFixed(1)}%`;
}

function formatBreakdownBoolean(value: boolean): string {
  return value ? 'Yes' : 'No';
}

function createScoringCriterion(
  label: string,
  actual: string,
  threshold: string | undefined,
  met: boolean
): ScoringCriterion {
  return threshold === undefined ? { label, actual, met } : { label, actual, threshold, met };
}

export function generateScoringBreakdown(
  data: QuestionnaireFormData,
  diagnosisReport: DiagnosisReport = generateDiagnosisReport(data)
): ScoringBreakdown {
  const reportMetrics = calculateReportDisplayMetrics(data);
  const age = calculateAge(data.demographics.yearOfBirth);
  const bmi = calculateBMI(data.demographics.height, data.demographics.weight);
  const napDurationMinutes = parseMinuteIncrement(data.daytime.plannedNaps.duration);
  const tiredness = data.daytime.tirednessRating ?? 0;
  const fatigue = data.daytime.fatigueRating ?? 0;
  const mildInsomniaSymptomCount = [
    data.daytime.sleepinessInterferes,
    data.daytime.nonRestorativeSleep,
    tiredness >= THRESHOLDS.TIREDNESS_MILD_MIN && tiredness <= THRESHOLDS.TIREDNESS_MILD_MAX,
    fatigue >= THRESHOLDS.FATIGUE_MILD_MIN && fatigue <= THRESHOLDS.FATIGUE_MILD_MAX,
  ].filter(Boolean).length;
  const moderateInsomniaSymptomCount = [
    data.daytime.sleepinessInterferes,
    data.daytime.nonRestorativeSleep,
    tiredness >= THRESHOLDS.TIREDNESS_MODERATE,
    fatigue >= THRESHOLDS.FATIGUE_MODERATE,
  ].filter(Boolean).length;
  const chronicFatigueSymptomCount = diagnosisReport.chronicFatigue.symptomCount;
  const painRelatedSymptomCount = diagnosisReport.painRelated.symptomCount;
  const nightmareCount = diagnosisReport.nightmares.nightmaresPerWeek;
  const badDreamCount = diagnosisReport.nightmares.badDreamsPerWeek;
  const maxTirednessScore = Math.max(tiredness, fatigue);

  const metrics: ScoringMetric[] = [
    {
      label: 'Scheduled total sleep time',
      value: formatBreakdownHours(reportMetrics.scheduledTST),
      note: `Calculated from time in bed minus SOL (${reportMetrics.scheduledSOL}m) and WASO (${reportMetrics.scheduledWASO}m).`,
    },
    {
      label: 'Unscheduled total sleep time',
      value: formatBreakdownHours(reportMetrics.unscheduledTST),
      note: `Calculated from time in bed minus SOL (${reportMetrics.unscheduledSOL}m) and WASO (${reportMetrics.unscheduledWASO}m).`,
    },
    {
      label: 'Weekly average sleep',
      value: formatBreakdownHours(reportMetrics.weeklyAvgTST),
      note: 'Weighted average: 5 work/school days plus 2 weekends/free days.',
    },
    {
      label: 'Scheduled sleep efficiency',
      value: formatBreakdownPercent(reportMetrics.scheduledSE),
      note: `Insomnia quality threshold: < ${THRESHOLDS.SLEEP_EFFICIENCY_NORMAL}%`,
    },
    {
      label: 'Unscheduled sleep efficiency',
      value: formatBreakdownPercent(reportMetrics.unscheduledSE),
      note: `Insomnia quality threshold: < ${THRESHOLDS.SLEEP_EFFICIENCY_NORMAL}%`,
    },
    {
      label: 'Mid-sleep change',
      value: `${reportMetrics.midSleepTimeChange.toFixed(1)} hours`,
      note: 'Used to show weekend sleep timing drift.',
    },
  ];

  const diagnoses: DiagnosticBreakdown[] = [
    {
      id: 'eds',
      label: 'Excessive daytime sleepiness',
      outcome: diagnosisReport.insufficientSleep
        ? 'Not reported as EDS because short weekly sleep routes this pattern to insufficient sleep.'
        : diagnosisReport.eds.severity !== 'none'
          ? `Flagged (${diagnosisReport.eds.severity})`
          : diagnosisReport.hasEDSFromNaps
            ? 'Flagged from planned naps'
            : 'Not flagged',
      criteria: [
        createScoringCriterion(
          'Dozing score',
          String(diagnosisReport.eds.score),
          `${THRESHOLDS.EDS_SCORE_MIN}-${THRESHOLDS.EDS_SCORE_MAX} for the round 2 daytime sleepiness gate`,
          diagnosisReport.eds.score >= THRESHOLDS.EDS_SCORE_MIN
        ),
        createScoringCriterion(
          'Difficulty staying awake',
          formatBreakdownBoolean(diagnosisReport.eds.hasDifficultyStayingAwake),
          'Must be yes for activity-based EDS',
          diagnosisReport.eds.hasDifficultyStayingAwake
        ),
        createScoringCriterion(
          'Planned naps',
          `${data.daytime.plannedNaps.daysPerWeek} days/week, ${napDurationMinutes} minutes`,
          `${THRESHOLDS.NAP_EDS_MIN_DAYS}+ days/week and ${THRESHOLDS.NAP_EDS_MIN_DURATION}+ minutes`,
          diagnosisReport.hasEDSFromNaps
        ),
        createScoringCriterion(
          'Weekly average sleep',
          formatBreakdownHours(reportMetrics.weeklyAvgTST),
          `${THRESHOLDS.MIN_RECOMMENDED_SLEEP_HOURS}+ hours to remain in the EDS path`,
          reportMetrics.weeklyAvgTST >= THRESHOLDS.MIN_RECOMMENDED_SLEEP_HOURS
        ),
      ],
    },
    {
      id: 'insufficient-sleep',
      label: 'Insufficient sleep syndrome',
      outcome: diagnosisReport.insufficientSleep ? 'Flagged' : 'Not flagged',
      criteria: [
        createScoringCriterion(
          'Weekly average sleep',
          formatBreakdownHours(reportMetrics.weeklyAvgTST),
          `< ${THRESHOLDS.MIN_RECOMMENDED_SLEEP_HOURS} hours`,
          reportMetrics.weeklyAvgTST < THRESHOLDS.MIN_RECOMMENDED_SLEEP_HOURS
        ),
        createScoringCriterion(
          'Daytime sleepiness signal',
          diagnosisReport.eds.severity !== 'none' || diagnosisReport.hasEDSFromNaps ? 'Present' : 'Absent',
          'EDS score / activity signal or planned naps must indicate sleepiness',
          diagnosisReport.eds.severity !== 'none' || diagnosisReport.hasEDSFromNaps
        ),
        createScoringCriterion(
          'Narcolepsy exclusion',
          formatBreakdownBoolean(!diagnosisReport.hasNarcolepsy),
          'Must not have narcolepsy symptoms',
          !diagnosisReport.hasNarcolepsy
        ),
        createScoringCriterion(
          'Sleep apnea exclusion',
          formatBreakdownBoolean(!diagnosisReport.sleepApnea.hasProbableSleepApnea),
          'Must not have probable sleep apnea',
          !diagnosisReport.sleepApnea.hasProbableSleepApnea
        ),
      ],
    },
    {
      id: 'insomnia',
      label: 'Insomnia',
      outcome: diagnosisReport.insomnia.hasInsomnia
        ? `Flagged (${diagnosisReport.insomnia.severity})`
        : 'Not flagged',
      criteria: [
        createScoringCriterion(
          'Sleep onset latency',
          formatBreakdownMinutes(diagnosisReport.sleepMetrics.scheduledSOL),
          `${THRESHOLDS.SOL_MILD_MIN}-${THRESHOLDS.SOL_MILD_MAX} mild, > ${THRESHOLDS.SOL_MODERATE} moderate-to-severe`,
          diagnosisReport.sleepMetrics.scheduledSOL >= THRESHOLDS.SOL_MILD_MIN
        ),
        createScoringCriterion(
          'Wake after sleep onset',
          formatBreakdownMinutes(diagnosisReport.sleepMetrics.scheduledWASO),
          `${THRESHOLDS.WASO_MILD_MIN}-${THRESHOLDS.WASO_MILD_MAX} mild, > ${THRESHOLDS.WASO_MODERATE} moderate-to-severe`,
          diagnosisReport.sleepMetrics.scheduledWASO >= THRESHOLDS.WASO_MILD_MIN
        ),
        createScoringCriterion(
          'Sleep efficiency / non-restorative sleep',
          `SE ${formatBreakdownPercent(diagnosisReport.sleepMetrics.scheduledSE)}, non-restorative ${formatBreakdownBoolean(data.daytime.nonRestorativeSleep)}`,
          `SE < ${THRESHOLDS.SLEEP_EFFICIENCY_NORMAL}% or non-restorative sleep`,
          diagnosisReport.sleepMetrics.scheduledSE < THRESHOLDS.SLEEP_EFFICIENCY_NORMAL ||
            data.daytime.nonRestorativeSleep
        ),
        createScoringCriterion(
          'Mild daytime symptom count',
          String(mildInsomniaSymptomCount),
          '1 or more',
          mildInsomniaSymptomCount >= 1
        ),
        createScoringCriterion(
          'Moderate-to-severe daytime symptom count',
          String(moderateInsomniaSymptomCount),
          '2 or more',
          moderateInsomniaSymptomCount >= 2
        ),
      ],
    },
    {
      id: 'sleep-apnea',
      label: 'Sleep apnea / sleep-disordered breathing',
      outcome: diagnosisReport.sleepApnea.hasProbableSleepApnea
        ? `Flagged (${diagnosisReport.sleepApnea.severity})`
        : diagnosisReport.sleepApnea.hasMildRespiratoryDisturbance
          ? 'Mild respiratory disturbance'
          : 'Not flagged',
      criteria: [
        createScoringCriterion(
          'Snoring',
          formatBreakdownBoolean(data.breathingDisorders.snores),
          'Snoring contributes to the apnea pathway',
          data.breathingDisorders.snores
        ),
        createScoringCriterion(
          'Breathing pauses / gasping',
          formatBreakdownBoolean(data.breathingDisorders.stopsBreathing),
          'Any breathing pauses flag probable apnea directly',
          data.breathingDisorders.stopsBreathing
        ),
        createScoringCriterion(
          'Risk factor count',
          `${diagnosisReport.sleepApnea.riskFactorCount} factors (age ${age}, BMI ${bmi?.toFixed(1) ?? 'N/A'}, tiredness/fatigue ${maxTirednessScore}, non-restorative ${formatBreakdownBoolean(data.daytime.nonRestorativeSleep)})`,
          `1+ for mild probable apnea, ${THRESHOLDS.APNEA_MODERATE_FACTORS}+ for moderate-to-severe`,
          diagnosisReport.sleepApnea.riskFactorCount >= THRESHOLDS.APNEA_MILD_FACTORS
        ),
        createScoringCriterion(
          'Mouth breathing',
          formatBreakdownBoolean(data.breathingDisorders.mouthBreathes),
          'Mouth breathing can still contribute to mild respiratory disturbance',
          data.breathingDisorders.mouthBreathes
        ),
      ],
    },
    {
      id: 'comisa',
      label: 'COMISA',
      outcome: diagnosisReport.hasCOMISA ? 'Flagged' : 'Not flagged',
      criteria: [
        createScoringCriterion(
          'Insomnia present',
          formatBreakdownBoolean(diagnosisReport.insomnia.hasInsomnia),
          'Must be yes',
          diagnosisReport.insomnia.hasInsomnia
        ),
        createScoringCriterion(
          'Sleep-disordered breathing present',
          formatBreakdownBoolean(
            diagnosisReport.sleepApnea.hasProbableSleepApnea ||
              diagnosisReport.sleepApnea.hasMildRespiratoryDisturbance
          ),
          'Must be yes',
          diagnosisReport.sleepApnea.hasProbableSleepApnea ||
            diagnosisReport.sleepApnea.hasMildRespiratoryDisturbance
        ),
      ],
    },
    {
      id: 'rls',
      label: 'Restless legs syndrome',
      outcome: diagnosisReport.hasRLS ? 'Flagged' : 'Not flagged',
      criteria: [
        createScoringCriterion(
          'Trouble lying still',
          formatBreakdownBoolean(data.restlessLegs.troubleLyingStill),
          'Must be yes',
          data.restlessLegs.troubleLyingStill
        ),
        createScoringCriterion(
          'Urge to move legs',
          formatBreakdownBoolean(data.restlessLegs.urgeToMoveLegs),
          'Must be yes',
          data.restlessLegs.urgeToMoveLegs
        ),
        createScoringCriterion(
          'Movement relieves symptoms',
          formatBreakdownBoolean(data.restlessLegs.movementRelieves),
          'Must be yes',
          data.restlessLegs.movementRelieves
        ),
      ],
    },
    {
      id: 'narcolepsy',
      label: 'Narcolepsy / hypersomnia screen',
      outcome: diagnosisReport.hasNarcolepsy ? 'Flagged' : 'Not flagged',
      criteria: [
        createScoringCriterion(
          'Existing diagnosis',
          formatBreakdownBoolean(
            data.daytime.diagnosedNarcolepsy ||
              data.sleepDisorderDiagnoses.diagnosedDisorders?.includes('narcolepsy') ||
              data.sleepDisorderDiagnoses.diagnosedDisorders?.includes('hypersomnia')
          ),
          'Prior diagnosis is sufficient',
          data.daytime.diagnosedNarcolepsy ||
            data.sleepDisorderDiagnoses.diagnosedDisorders?.includes('narcolepsy') ||
            data.sleepDisorderDiagnoses.diagnosedDisorders?.includes('hypersomnia')
        ),
        createScoringCriterion(
          'Cataplexy-type symptoms + sleep paralysis',
          `${data.daytime.weaknessWhenExcited.length > 0 ? 'Cataplexy signal present' : 'No cataplexy signal'}, sleep paralysis ${formatBreakdownBoolean(data.daytime.sleepParalysis)}`,
          'Both together flag the narcolepsy screen',
          data.daytime.weaknessWhenExcited.length > 0 && data.daytime.sleepParalysis
        ),
      ],
    },
    {
      id: 'nightmares',
      label: 'Nightmares / bad dreams',
      outcome: diagnosisReport.nightmares.hasNightmareDisorder
        ? 'Nightmare disorder threshold met'
        : diagnosisReport.nightmares.hasBadDreamWarning
          ? 'Bad dream warning threshold met'
          : 'Not flagged',
      criteria: [
        createScoringCriterion(
          'Nightmares per week',
          String(nightmareCount),
          `${THRESHOLDS.NIGHTMARE_DISORDER_THRESHOLD}+ per week`,
          diagnosisReport.nightmares.hasNightmareDisorder
        ),
        createScoringCriterion(
          'Bad dreams per week',
          String(badDreamCount),
          `${THRESHOLDS.BAD_DREAM_WARNING_THRESHOLD}+ per week`,
          diagnosisReport.nightmares.hasBadDreamWarning
        ),
      ],
    },
    {
      id: 'chronic-fatigue',
      label: 'Chronic fatigue / fibromyalgia screen',
      outcome: diagnosisReport.chronicFatigue.hasSymptoms ? 'Flagged' : 'Not flagged',
      criteria: [
        createScoringCriterion(
          'Insomnia pathway',
          formatBreakdownBoolean(diagnosisReport.insomnia.hasInsomnia),
          'Insomnia alone is sufficient',
          diagnosisReport.insomnia.hasInsomnia
        ),
        createScoringCriterion(
          'Symptom count',
          String(chronicFatigueSymptomCount),
          '3 or more symptoms when insomnia is absent',
          chronicFatigueSymptomCount >= 3
        ),
      ],
    },
    {
      id: 'pain-related',
      label: 'Pain-related sleep disturbance',
      outcome: diagnosisReport.painRelated.hasCondition ? 'Flagged' : 'Not flagged',
      criteria: [
        createScoringCriterion(
          'Pain present',
          formatBreakdownBoolean(data.daytime.painAffectsSleep || data.daytime.jointMusclePain),
          'Pain or joint/muscle pain must be present',
          data.daytime.painAffectsSleep || data.daytime.jointMusclePain
        ),
        createScoringCriterion(
          'Symptom count',
          String(painRelatedSymptomCount),
          '2 or more combined symptoms',
          painRelatedSymptomCount >= 2
        ),
      ],
    },
    {
      id: 'leg-cramps',
      label: 'Nocturnal leg cramps',
      outcome: diagnosisReport.hasLegCrampsConcern ? 'Flagged' : 'Not flagged',
      criteria: [
        createScoringCriterion(
          'Leg cramps present',
          formatBreakdownBoolean(data.restlessLegs.legCramps),
          'Must be yes',
          data.restlessLegs.legCramps
        ),
        createScoringCriterion(
          'Frequency',
          `${data.restlessLegs.legCrampsPerWeek ?? 0} nights/week`,
          `${THRESHOLDS.LEG_CRAMPS_CONCERN_THRESHOLD}+ nights/week`,
          diagnosisReport.hasLegCrampsConcern
        ),
      ],
    },
  ];

  return { metrics, diagnoses };
}

// =============================================================================
// FULL REPORT GENERATION
// =============================================================================

/**
 * Generate the complete patient-facing report result.
 *
 * This is the function called by the /api/diagnose route. It consolidates all
 * inline scoring previously done in ReportSection so that zero algorithm logic
 * is bundled to the browser.
 */
interface GenerateFullReportOptions {
  includeBreakdown?: boolean;
}

export function generateFullReport(
  data: QuestionnaireFormData,
  options: GenerateFullReportOptions = {}
): FullReportResult {
  const diagnosisReport = generateDiagnosisReport(data);
  const metrics = calculateReportDisplayMetrics(data);
  const { type: chronotypeType, chronotypeLabel } = getReportChronotype(
    metrics,
    data.chronotype.preference
  );
  const insomniaSeverity = mapInsomniaSeverityToReportLabel(diagnosisReport.insomnia);
  const hasInsomnia = diagnosisReport.insomnia.hasInsomnia;
  const avgWeeklySleep = metrics.weeklyAvgTST;
  const hasEDSSymptoms =
    diagnosisReport.eds.severity !== 'none' || diagnosisReport.hasEDSFromNaps;
  const hasEDS = hasEDSSymptoms && avgWeeklySleep >= THRESHOLDS.MIN_RECOMMENDED_SLEEP_HOURS;
  const hasOSA = diagnosisReport.sleepApnea.hasProbableSleepApnea;
  const hasCOMISA = diagnosisReport.hasCOMISA;
  const hasRLS = diagnosisReport.hasRLS;
  const hasNightmares = diagnosisReport.nightmares.hasNightmareDisorder;
  const edsSeverity = resolveReportEDSSeverity(
    diagnosisReport.eds,
    diagnosisReport.hasEDSFromNaps,
    hasEDS
  );

  const hasPoorHygiene = !!(
    data.lifestyle.caffeinePerDay > 4 ||
    (data.lifestyle.lastCaffeineTime &&
      parseInt(data.lifestyle.lastCaffeineTime.split(':')[0] ?? '0') >= 14)
  );

  const hasParasomniaSafetyRisk =
    data.parasomnia.hasInjuredOrLeftHome ||
    data.parasomnia.nightBehaviors.includes('walk') ||
    data.parasomnia.nightBehaviors.includes('eating');

  const hasMedicationAlcoholRisk =
    (data.sleepHygiene.prescriptionMeds.length > 0 && data.lifestyle.alcoholPerWeek > 7) ||
    data.lifestyle.caffeinePerDay > 4 ||
    data.lifestyle.alcoholPerWeek > 14;

  const hasPainAffectingSleep =
    data.daytime.painAffectsSleep && (data.daytime.painSeverity ?? 0) >= 5;
  const hasMildRespiratoryDisturbance =
    !hasOSA && diagnosisReport.sleepApnea.hasMildRespiratoryDisturbance;

  const hasDiagnosedOSA =
    !!data.sleepDisorderDiagnoses.diagnosedDisorders?.includes('obstructive_sleep_apnea') ||
    data.sleepDisorderDiagnoses.diagnosedOSA;

  const hasDiagnosedRLS =
    !!data.sleepDisorderDiagnoses.diagnosedDisorders?.includes('rls') ||
    data.sleepDisorderDiagnoses.diagnosedRLS;

  const fullReport: FullReportResult = {
    metrics,
    chronotypeLabel,
    chronotypeType,
    edsScore: diagnosisReport.eds.score,
    edsSeverity,
    hasEDSFromNaps: diagnosisReport.hasEDSFromNaps,
    hasInsomnia,
    insomniaSeverity,
    hasOSA,
    hasCOMISA,
    hasRLS,
    hasNightmares,
    hasNarcolepsy: diagnosisReport.hasNarcolepsy,
    hasEDS,
    hasInsufficientSleep: diagnosisReport.insufficientSleep,
    hasMildRespiratoryDisturbance,
    hasPoorHygiene,
    hasLegCrampsConcern: diagnosisReport.hasLegCrampsConcern,
    hasChronicFatigueSymptoms: diagnosisReport.chronicFatigue.hasSymptoms,
    hasPainAffectingSleep,
    hasPainRelatedSleepDisturbance: diagnosisReport.painRelated.hasCondition,
    hasMedicationRelatedSleepDisturbance: diagnosisReport.medicationRelated.hasCondition,
    osaTreatmentIneffective: diagnosisReport.treatmentEffectiveness.osaTreatmentIneffective,
    rlsTreatmentIneffective: diagnosisReport.treatmentEffectiveness.rlsTreatmentIneffective,
    hasDiagnosedOSA,
    hasDiagnosedRLS,
    hasSevereTiredness: diagnosisReport.hasSevereTiredness,
    hasParasomniaSafetyRisk,
    hasMedicationAlcoholRisk,
    avgWeeklySleep,
  };

  if (options.includeBreakdown) {
    fullReport.algorithmBreakdown = generateScoringBreakdown(data, diagnosisReport);
  }

  return fullReport;
}
