/**
 * Unit Tests for Sleep Diagnosis Algorithms
 *
 * These tests validate the diagnosis logic without requiring UI interaction.
 * They enable doctors to verify algorithm accuracy by reviewing test cases.
 */

import {
  timeToMinutes,
  parseMinuteIncrement,
  calculateBMI,
  calculateAge,
  calculateSleepMetrics,
  calculateEDSScore,
  hasInsufficientSleepSyndrome,
  diagnoseInsomnia,
  diagnoseSleepApnea,
  hasCOMISA,
  diagnoseRLS,
  hasLegCrampsConcern,
  screenChronicFatigue,
  diagnosePainRelatedSleepDisturbance,
  diagnoseMedicationRelatedSleepDisturbance,
  diagnoseNightmares,
  checkTreatmentEffectiveness,
  determineChronotype,
  screenNarcolepsy,
  generateDiagnosisReport,
} from '../diagnosis-algorithms';
import { QuestionnaireFormData } from '@/validations/questionnaire';

// =============================================================================
// TEST FIXTURES
// =============================================================================

/**
 * Creates a base questionnaire data object with sensible defaults
 * Override specific fields for your test case
 */
function createBaseQuestionnaireData(
  overrides: Partial<DeepPartial<QuestionnaireFormData>> = {}
): QuestionnaireFormData {
  const base: QuestionnaireFormData = {
    intro: { acceptedDisclaimer: true },
    demographics: {
      yearOfBirth: 1985,
      sex: 'male',
      zipcode: '12345',
      weight: 180,
      height: 70,
    },
    daytime: {
      plannedNaps: { daysPerWeek: 0, napsPerWeek: 0, duration: null },
      fallAsleepDuring: [],
      sleepinessInterferes: false,
      sleepinessSeverity: null,
      tiredButCantSleep: null,
      weaknessWhenExcited: [],
      sleepParalysis: false,
      diagnosedNarcolepsy: false,
      painAffectsSleep: false,
      painSeverity: null,
      jointMusclePain: false,
      nonRestorativeSleep: false,
      sleepinessRating: null,
      tirednessRating: null,
      fatigueRating: null,
    },
    scheduledSleep: {
      lightsOutTime: '22:00',
      lightsOutVaries: false,
      preBedActivity: [],
      minutesToFallAsleep: '20',
      nightWakeups: 1,
      wakeupReasons: [],
      minutesAwakeAtNight: '10',
      wakeupTime: '06:00',
      getOutOfBedTime: '06:15',
      earlyWakeupDays: 0,
      earlyWakeupMinutes: null,
      usesAlarm: true,
    },
    unscheduledSleep: {
      lightsOutTime: '23:00',
      minutesToFallAsleep: '10',
      nightWakeups: 0,
      wakeupReasons: [],
      minutesAwakeAtNight: '10',
      wakeupTime: '08:00',
      getOutOfBedTime: '08:30',
      usesAlarm: false,
    },
    breathingDisorders: {
      snores: false,
      stopsBreathing: false,
      mouthBreathes: false,
      wakesWithDryMouth: false,
    },
    restlessLegs: {
      troubleLyingStill: false,
      urgeToMoveLegs: false,
      movementRelieves: false,
      daytimeDiscomfort: false,
      legCramps: false,
      legCrampsPerWeek: null,
    },
    parasomnia: {
      nightBehaviors: [],
      remembersEvents: false,
      actsOutDreams: false,
      hasInjuredOrLeftHome: false,
      bedwetting: false,
      diagnosedParasomnia: false,
      parasomniaType: '',
      receivedTreatment: false,
      treatmentType: '',
    },
    nightmares: {
      remembersDreams: false,
      hasBadDreams: false,
      badDreamsPerWeek: null,
      hasNightmares: false,
      nightmaresPerWeek: null,
      associatedWithTrauma: false,
    },
    chronotype: {
      preference: 'flexible',
      preferenceStrength: null,
      shiftWork: false,
      shiftType: '',
      shiftDaysPerWeek: null,
      pastShiftWorkYears: null,
      frequentTimeZoneTravel: false,
      workSchoolTime: '09:00',
    },
    sleepHygiene: {
      supplements: [],
      prescriptionMeds: [],
      stimulants: '',
      stimulantTime: '',
      smokesNicotine: false,
    },
    bedroom: {
      relaxing: 7,
      comfortable: 8,
      dark: 8,
      quiet: 7,
    },
    lifestyle: {
      caffeinePerDay: 2,
      lastCaffeineTime: '14:00',
      alcoholPerWeek: 2,
      exerciseDaysPerWeek: 3,
      exerciseDuration: 30,
      exerciseEndTime: '18:00',
    },
    mentalHealth: {
      worriesAffectSleep: false,
      anxietyInBed: false,
      timeInBedTrying: false,
      cancelsAfterPoorSleep: 'never',
      diagnosedMedicalConditions: [],
      diagnosedMentalHealthConditions: [],
      currentlyReceivingTreatment: false,
    },
    sleepDisorderDiagnoses: {
      diagnosedOSA: false,
      osaSeverity: null,
      osaTreated: false,
      osaTreatmentType: [],
      osaTreatmentEffective: null,
      diagnosedRLS: false,
      rlsTreated: false,
      rlsTreatment: [],
      rlsTreatmentEffective: null,
    },
  };

  return deepMerge(base, overrides as Partial<QuestionnaireFormData>) as QuestionnaireFormData;
}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const output = { ...target };
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = target[key];
      if (
        sourceValue !== null &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue !== null &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        (output as Record<string, unknown>)[key] = deepMerge(
          targetValue as object,
          sourceValue as Partial<object>
        );
      } else {
        (output as Record<string, unknown>)[key] = sourceValue;
      }
    }
  }
  return output;
}

// =============================================================================
// HELPER FUNCTION TESTS
// =============================================================================

describe('Helper Functions', () => {
  describe('timeToMinutes', () => {
    it('should parse valid time strings', () => {
      expect(timeToMinutes('22:30', 22)).toBe(22 * 60 + 30);
      expect(timeToMinutes('06:00', 6)).toBe(6 * 60);
      expect(timeToMinutes('00:15', 0)).toBe(15);
    });

    it('should return default for empty or invalid inputs', () => {
      expect(timeToMinutes('', 22, 0)).toBe(22 * 60);
      expect(timeToMinutes(undefined, 7, 30)).toBe(7 * 60 + 30);
    });
  });

  describe('parseMinuteIncrement', () => {
    it('should parse numeric strings', () => {
      expect(parseMinuteIncrement('30')).toBe(30);
      expect(parseMinuteIncrement('60')).toBe(60);
    });

    it('should handle special >120 value', () => {
      expect(parseMinuteIncrement('>120')).toBe(130);
    });

    it('should return 0 for null', () => {
      expect(parseMinuteIncrement(null)).toBe(0);
    });
  });

  describe('calculateBMI', () => {
    it('should calculate BMI correctly', () => {
      // 180 lbs, 70 inches = BMI ~25.8
      const bmi = calculateBMI(70, 180);
      expect(bmi).toBeCloseTo(25.82, 1);
    });

    it('should return null for invalid inputs', () => {
      expect(calculateBMI(null, 180)).toBeNull();
      expect(calculateBMI(70, null)).toBeNull();
      expect(calculateBMI(0, 180)).toBeNull();
    });
  });

  describe('calculateAge', () => {
    it('should calculate age from year of birth', () => {
      const currentYear = new Date().getFullYear();
      expect(calculateAge(1985)).toBe(currentYear - 1985);
    });
  });
});

// =============================================================================
// SLEEP METRICS TESTS
// =============================================================================

describe('calculateSleepMetrics', () => {
  it('should calculate correct sleep metrics for normal sleeper', () => {
    const data = createBaseQuestionnaireData({
      scheduledSleep: {
        lightsOutTime: '22:00',
        minutesToFallAsleep: '20',
        minutesAwakeAtNight: '10',
        wakeupTime: '06:00',
      },
    });

    const metrics = calculateSleepMetrics(data);

    // Time in bed: 22:00 to 06:00 = 8 hours = 480 minutes
    // TST = 480 - 20 - 10 = 450 minutes = 7.5 hours
    expect(metrics.scheduledTST).toBeCloseTo(7.5, 1);
    expect(metrics.scheduledSOL).toBe(20);
    expect(metrics.scheduledWASO).toBe(10);
    // Sleep efficiency = 450/480 = 93.75%
    expect(metrics.scheduledSE).toBeCloseTo(93.75, 1);
  });

  it('should handle overnight sleep (past midnight)', () => {
    const data = createBaseQuestionnaireData({
      scheduledSleep: {
        lightsOutTime: '23:30',
        minutesToFallAsleep: '10',
        minutesAwakeAtNight: '10',
        wakeupTime: '07:00',
      },
    });

    const metrics = calculateSleepMetrics(data);

    // Time in bed: 23:30 to 07:00 = 7.5 hours = 450 minutes
    // TST = 450 - 10 (SOL) - 10 (WASO) = 430 minutes = 7.17 hours
    expect(metrics.scheduledTST).toBeCloseTo(7.17, 1);
  });

  it('should calculate weekly average correctly', () => {
    const data = createBaseQuestionnaireData({
      scheduledSleep: {
        lightsOutTime: '22:00',
        minutesToFallAsleep: '20',
        minutesAwakeAtNight: '10',
        wakeupTime: '06:00',
      },
      unscheduledSleep: {
        lightsOutTime: '23:00',
        minutesToFallAsleep: '10',
        minutesAwakeAtNight: '10',
        wakeupTime: '09:00',
      },
    });

    const metrics = calculateSleepMetrics(data);

    // Scheduled TST: 7.5 hours × 5 days
    // Unscheduled TST: 9.75 hours × 2 days
    // Weekly average = (7.5 * 5 + 9.75 * 2) / 7
    const expectedWeeklyAvg = (7.5 * 5 + 9.75 * 2) / 7;
    expect(metrics.weeklyAverageTST).toBeCloseTo(expectedWeeklyAvg, 1);
  });
});

// =============================================================================
// EDS (EXCESSIVE DAYTIME SLEEPINESS) TESTS
// =============================================================================

describe('calculateEDSScore', () => {
  it('should return no EDS for healthy individual', () => {
    const data = createBaseQuestionnaireData({
      daytime: {
        fallAsleepDuring: [],
        sleepinessInterferes: false,
      },
    });

    const result = calculateEDSScore(data);

    expect(result.score).toBe(0);
    expect(result.severity).toBe('none');
  });

  it('should calculate mild EDS for score 2-4', () => {
    const data = createBaseQuestionnaireData({
      daytime: {
        fallAsleepDuring: ['evening', 'lectures'], // 1 + 1 = 2
        sleepinessInterferes: true,
      },
    });

    const result = calculateEDSScore(data);

    expect(result.score).toBe(2);
    expect(result.severity).toBe('mild');
    expect(result.hasDifficultyStayingAwake).toBe(true);
  });

  it('should calculate severe EDS for high-weighted activities', () => {
    const data = createBaseQuestionnaireData({
      daytime: {
        fallAsleepDuring: ['stoplight', 'conversation', 'meal'], // 2 + 2 + 2 = 6
        sleepinessInterferes: true,
      },
    });

    const result = calculateEDSScore(data);

    expect(result.score).toBe(6);
    expect(result.severity).toBe('moderate');
  });

  it('should recognize difficulty staying awake from sleepiness rating', () => {
    const data = createBaseQuestionnaireData({
      daytime: {
        fallAsleepDuring: [],
        sleepinessInterferes: false,
        sleepinessRating: 7,
      },
    });

    const result = calculateEDSScore(data);

    expect(result.hasDifficultyStayingAwake).toBe(true);
  });
});

// =============================================================================
// INSUFFICIENT SLEEP SYNDROME TESTS
// =============================================================================

describe('hasInsufficientSleepSyndrome', () => {
  it('should detect insufficient sleep when EDS + low sleep duration', () => {
    const data = createBaseQuestionnaireData({
      scheduledSleep: {
        lightsOutTime: '23:00',
        minutesToFallAsleep: '20',
        minutesAwakeAtNight: '10',
        wakeupTime: '05:00', // Only 6 hours in bed
      },
      daytime: {
        fallAsleepDuring: ['lectures', 'working', 'evening'],
        sleepinessInterferes: true,
      },
    });

    const metrics = calculateSleepMetrics(data);
    const edsResult = calculateEDSScore(data);

    expect(metrics.weeklyAverageTST).toBeLessThan(7);
    expect(hasInsufficientSleepSyndrome(edsResult, metrics, data)).toBe(true);
  });

  it('should NOT flag insufficient sleep when sleep duration >= 7 hours', () => {
    const data = createBaseQuestionnaireData({
      scheduledSleep: {
        lightsOutTime: '22:00',
        minutesToFallAsleep: '10',
        minutesAwakeAtNight: '10',
        wakeupTime: '06:00', // 8 hours in bed
      },
      daytime: {
        fallAsleepDuring: ['lectures', 'working'],
        sleepinessInterferes: true,
      },
    });

    const metrics = calculateSleepMetrics(data);
    const edsResult = calculateEDSScore(data);

    expect(metrics.weeklyAverageTST).toBeGreaterThanOrEqual(7);
    expect(hasInsufficientSleepSyndrome(edsResult, metrics, data)).toBe(false);
  });

  it('should NOT flag insufficient sleep if narcolepsy is present', () => {
    const data = createBaseQuestionnaireData({
      scheduledSleep: {
        lightsOutTime: '23:00',
        minutesToFallAsleep: '20',
        minutesAwakeAtNight: '10',
        wakeupTime: '05:00',
      },
      daytime: {
        fallAsleepDuring: ['lectures', 'working'],
        sleepinessInterferes: true,
        diagnosedNarcolepsy: true,
      },
    });

    const metrics = calculateSleepMetrics(data);
    const edsResult = calculateEDSScore(data);

    expect(hasInsufficientSleepSyndrome(edsResult, metrics, data)).toBe(false);
  });
});

// =============================================================================
// INSOMNIA DIAGNOSIS TESTS
// =============================================================================

describe('diagnoseInsomnia', () => {
  it('should detect NO insomnia in healthy sleeper', () => {
    const data = createBaseQuestionnaireData({
      scheduledSleep: {
        minutesToFallAsleep: '10', // Normal SOL
        minutesAwakeAtNight: '10', // Normal WASO
      },
      daytime: {
        sleepinessInterferes: false,
        nonRestorativeSleep: false,
      },
    });

    const metrics = calculateSleepMetrics(data);
    const result = diagnoseInsomnia(data, metrics);

    expect(result.hasInsomnia).toBe(false);
    expect(result.severity).toBe('none');
  });

  it('should detect MILD insomnia (SOL 30-45 min + 1 daytime symptom)', () => {
    const data = createBaseQuestionnaireData({
      scheduledSleep: {
        minutesToFallAsleep: '40', // 40 min SOL (mild range)
        minutesAwakeAtNight: '20',
      },
      daytime: {
        sleepinessInterferes: true, // 1 daytime symptom
        tirednessRating: 4,
        fatigueRating: 3,
      },
    });

    const metrics = calculateSleepMetrics(data);
    const result = diagnoseInsomnia(data, metrics);

    expect(result.hasInsomnia).toBe(true);
    expect(result.severity).toBe('mild');
    expect(result.hasSleepOnsetInsomnia).toBe(true);
  });

  it('should detect MODERATE-TO-SEVERE insomnia (SOL > 45 + 2 daytime symptoms)', () => {
    const data = createBaseQuestionnaireData({
      scheduledSleep: {
        minutesToFallAsleep: '60', // 60 min SOL (severe)
        minutesAwakeAtNight: '30',
      },
      daytime: {
        sleepinessInterferes: true,
        nonRestorativeSleep: true,
        tirednessRating: 8,
        fatigueRating: 6,
      },
    });

    const metrics = calculateSleepMetrics(data);
    const result = diagnoseInsomnia(data, metrics);

    expect(result.hasInsomnia).toBe(true);
    expect(result.severity).toBe('moderate-to-severe');
  });

  it('should detect MAINTENANCE insomnia from high WASO', () => {
    const data = createBaseQuestionnaireData({
      scheduledSleep: {
        minutesToFallAsleep: '10', // Normal SOL
        minutesAwakeAtNight: '60', // High WASO = maintenance insomnia
      },
      daytime: {
        sleepinessInterferes: true,
        nonRestorativeSleep: true,
      },
    });

    const metrics = calculateSleepMetrics(data);
    const result = diagnoseInsomnia(data, metrics);

    expect(result.hasMaintenanceInsomnia).toBe(true);
    expect(result.hasSleepOnsetInsomnia).toBe(false);
    expect(result.hasInsomnia).toBe(true);
  });

  /**
   * REGRESSION TEST: Client bug report
   * "I put that I am in bed 7.5 hrs/night but with nocturnal awakenings.
   * It said I have insufficient sleep syndrome instead of identifying maintenance insomnia."
   */
  it('REGRESSION: should identify maintenance insomnia NOT insufficient sleep when time in bed is adequate', () => {
    const data = createBaseQuestionnaireData({
      scheduledSleep: {
        lightsOutTime: '22:30',
        minutesToFallAsleep: '10',
        minutesAwakeAtNight: '60', // High WASO
        wakeupTime: '06:00', // 7.5 hours in bed
      },
      unscheduledSleep: {
        lightsOutTime: '23:00',
        minutesToFallAsleep: '10',
        minutesAwakeAtNight: '40',
        wakeupTime: '07:30',
      },
      daytime: {
        sleepinessInterferes: true,
        nonRestorativeSleep: true,
        fallAsleepDuring: ['lectures'],
      },
    });

    const metrics = calculateSleepMetrics(data);
    const insomnia = diagnoseInsomnia(data, metrics);
    const edsResult = calculateEDSScore(data);

    // Should be maintenance insomnia, NOT insufficient sleep
    expect(insomnia.hasMaintenanceInsomnia).toBe(true);
    expect(insomnia.hasInsomnia).toBe(true);

    // Weekly average TST might be low due to WASO, but they have adequate time in bed
    // The key is they have maintenance insomnia, not insufficient sleep behavior
    expect(metrics.scheduledTimeInBed).toBeGreaterThanOrEqual(7);

    // If EDS criteria are met but insomnia is present, insomnia takes precedence
    // for the maintenance-type symptoms
    expect(hasInsufficientSleepSyndrome(edsResult, metrics, data)).toBe(false);
  });
});

// =============================================================================
// SLEEP APNEA DIAGNOSIS TESTS
// =============================================================================

describe('diagnoseSleepApnea', () => {
  it('should detect NO apnea in healthy individual', () => {
    const data = createBaseQuestionnaireData({
      breathingDisorders: {
        snores: false,
        stopsBreathing: false,
        mouthBreathes: false,
        wakesWithDryMouth: false,
      },
    });

    const result = diagnoseSleepApnea(data);

    expect(result.hasProbableSleepApnea).toBe(false);
    expect(result.hasMildRespiratoryDisturbance).toBe(false);
  });

  it('should detect mild respiratory disturbance for snoring only (no risk factors)', () => {
    const data = createBaseQuestionnaireData({
      demographics: {
        yearOfBirth: 1995, // Young (not > 60)
        weight: 150, // BMI ~21.5 (not > 25)
        height: 70,
      },
      breathingDisorders: {
        snores: true,
        stopsBreathing: false,
        mouthBreathes: false,
        wakesWithDryMouth: false,
      },
      daytime: {
        tirednessRating: 2, // Low (not > 3)
        sleepinessRating: 2,
        fatigueRating: 2,
        nonRestorativeSleep: false,
      },
    });

    const result = diagnoseSleepApnea(data);

    expect(result.hasSnoringOnly).toBe(true);
    expect(result.hasMildRespiratoryDisturbance).toBe(true);
    // No risk factors means pure snoring only, not probable apnea
    expect(result.riskFactorCount).toBe(0);
    expect(result.hasProbableSleepApnea).toBe(false);
    expect(result.severity).toBe('mild');
  });

  it('should detect mild respiratory disturbance for mouth breathing only', () => {
    const data = createBaseQuestionnaireData({
      breathingDisorders: {
        snores: false,
        stopsBreathing: false,
        mouthBreathes: true,
        wakesWithDryMouth: false,
      },
    });

    const result = diagnoseSleepApnea(data);

    expect(result.hasMouthBreathingOnly).toBe(true);
    expect(result.hasMildRespiratoryDisturbance).toBe(true);
    expect(result.severity).toBe('mild');
  });

  it('should detect PROBABLE apnea with breathing pauses', () => {
    const data = createBaseQuestionnaireData({
      breathingDisorders: {
        snores: true,
        stopsBreathing: true, // Breathing pauses = definite concern
        mouthBreathes: false,
        wakesWithDryMouth: false,
      },
    });

    const result = diagnoseSleepApnea(data);

    expect(result.hasProbableSleepApnea).toBe(true);
    expect(result.severity).toBe('moderate-to-severe');
  });

  it('should detect MILD apnea with snoring + 1 risk factor', () => {
    const data = createBaseQuestionnaireData({
      demographics: {
        yearOfBirth: 1960, // Age > 60
        weight: 180,
        height: 70,
      },
      breathingDisorders: {
        snores: true,
        stopsBreathing: false,
        mouthBreathes: false,
        wakesWithDryMouth: false,
      },
    });

    const result = diagnoseSleepApnea(data);

    expect(result.hasProbableSleepApnea).toBe(true);
    expect(result.riskFactorCount).toBeGreaterThanOrEqual(1);
    expect(result.severity).toBe('mild');
  });

  it('should detect MODERATE-TO-SEVERE apnea with snoring + 3+ risk factors', () => {
    const data = createBaseQuestionnaireData({
      demographics: {
        yearOfBirth: 1960, // Age > 60 (risk factor 1)
        weight: 220, // BMI > 25 (risk factor 2)
        height: 70,
      },
      breathingDisorders: {
        snores: true,
        stopsBreathing: false,
        mouthBreathes: false,
        wakesWithDryMouth: false,
      },
      daytime: {
        nonRestorativeSleep: true, // Risk factor 3
        tirednessRating: 5, // Risk factor 4 (>3)
      },
    });

    const result = diagnoseSleepApnea(data);

    expect(result.hasProbableSleepApnea).toBe(true);
    expect(result.riskFactorCount).toBeGreaterThanOrEqual(3);
    expect(result.severity).toBe('moderate-to-severe');
  });
});

// =============================================================================
// COMISA TESTS
// =============================================================================

describe('hasCOMISA', () => {
  it('should detect COMISA when both insomnia and apnea present', () => {
    const insomnia = {
      hasSleepOnsetInsomnia: true,
      hasMaintenanceInsomnia: false,
      hasInsomnia: true,
      severity: 'mild' as const,
      daytimeImpactCount: 2,
    };

    const sleepApnea = {
      hasSnoringOnly: false,
      hasMouthBreathingOnly: false,
      hasMildRespiratoryDisturbance: true,
      hasProbableSleepApnea: true,
      severity: 'mild' as const,
      riskFactorCount: 2,
    };

    expect(hasCOMISA(insomnia, sleepApnea)).toBe(true);
  });

  it('should NOT detect COMISA with only insomnia', () => {
    const insomnia = {
      hasSleepOnsetInsomnia: true,
      hasMaintenanceInsomnia: false,
      hasInsomnia: true,
      severity: 'mild' as const,
      daytimeImpactCount: 2,
    };

    const sleepApnea = {
      hasSnoringOnly: false,
      hasMouthBreathingOnly: false,
      hasMildRespiratoryDisturbance: false,
      hasProbableSleepApnea: false,
      severity: 'none' as const,
      riskFactorCount: 0,
    };

    expect(hasCOMISA(insomnia, sleepApnea)).toBe(false);
  });
});

// =============================================================================
// RLS TESTS
// =============================================================================

describe('diagnoseRLS', () => {
  it('should detect RLS with classic triad', () => {
    const data = createBaseQuestionnaireData({
      restlessLegs: {
        troubleLyingStill: true,
        urgeToMoveLegs: true,
        movementRelieves: true,
        daytimeDiscomfort: false,
        legCramps: false,
      },
    });

    expect(diagnoseRLS(data)).toBe(true);
  });

  it('should NOT detect RLS with incomplete symptoms', () => {
    const data = createBaseQuestionnaireData({
      restlessLegs: {
        troubleLyingStill: true,
        urgeToMoveLegs: true,
        movementRelieves: false, // Missing this criterion
        daytimeDiscomfort: false,
        legCramps: false,
      },
    });

    expect(diagnoseRLS(data)).toBe(false);
  });
});

describe('hasLegCrampsConcern', () => {
  it('should flag concern when leg cramps present', () => {
    const data = createBaseQuestionnaireData({
      restlessLegs: {
        legCramps: true,
      },
    });

    expect(hasLegCrampsConcern(data)).toBe(true);
  });

  it('should NOT flag concern when no leg cramps', () => {
    const data = createBaseQuestionnaireData({
      restlessLegs: {
        legCramps: false,
      },
    });

    expect(hasLegCrampsConcern(data)).toBe(false);
  });
});

// =============================================================================
// CHRONIC FATIGUE TESTS
// =============================================================================

describe('screenChronicFatigue', () => {
  it('should detect chronic fatigue with 3+ symptoms', () => {
    const data = createBaseQuestionnaireData({
      daytime: {
        sleepinessInterferes: true,
        nonRestorativeSleep: true,
        tirednessRating: 8, // >= 7
        fatigueRating: 8, // > 7
        jointMusclePain: true,
      },
    });

    const metrics = calculateSleepMetrics(data);
    const insomnia = diagnoseInsomnia(data, metrics);
    const result = screenChronicFatigue(data, insomnia);

    expect(result.hasSymptoms).toBe(true);
    expect(result.symptomCount).toBeGreaterThanOrEqual(3);
  });

  it('should detect chronic fatigue with insomnia present', () => {
    const data = createBaseQuestionnaireData({
      scheduledSleep: {
        minutesToFallAsleep: '50', // Insomnia
      },
      daytime: {
        sleepinessInterferes: true,
        nonRestorativeSleep: true,
      },
    });

    const metrics = calculateSleepMetrics(data);
    const insomnia = diagnoseInsomnia(data, metrics);
    const result = screenChronicFatigue(data, insomnia);

    expect(insomnia.hasInsomnia).toBe(true);
    expect(result.hasSymptoms).toBe(true);
  });
});

// =============================================================================
// PAIN-RELATED SLEEP DISTURBANCE TESTS
// =============================================================================

describe('diagnosePainRelatedSleepDisturbance', () => {
  it('should detect pain-related disturbance with pain + 2 symptoms', () => {
    const data = createBaseQuestionnaireData({
      daytime: {
        painAffectsSleep: true,
        sleepinessInterferes: true,
        nonRestorativeSleep: true,
      },
    });

    const result = diagnosePainRelatedSleepDisturbance(data);

    expect(result.hasCondition).toBe(true);
    expect(result.symptomCount).toBeGreaterThanOrEqual(2);
  });

  it('should NOT detect without pain', () => {
    const data = createBaseQuestionnaireData({
      daytime: {
        painAffectsSleep: false,
        jointMusclePain: false,
        sleepinessInterferes: true,
        nonRestorativeSleep: true,
      },
    });

    const result = diagnosePainRelatedSleepDisturbance(data);

    expect(result.hasCondition).toBe(false);
  });
});

// =============================================================================
// MEDICATION-RELATED TESTS
// =============================================================================

describe('diagnoseMedicationRelatedSleepDisturbance', () => {
  it('should detect medication-related disturbance', () => {
    const data = createBaseQuestionnaireData({
      sleepHygiene: {
        supplements: ['melatonin', 'benadryl'],
        prescriptionMeds: [],
      },
      daytime: {
        sleepinessInterferes: true,
        tirednessRating: 6,
      },
    });

    const result = diagnoseMedicationRelatedSleepDisturbance(data);

    expect(result.hasCondition).toBe(true);
    expect(result.relevantMedications).toContain('melatonin');
    expect(result.relevantMedications).toContain('benadryl');
  });

  it('should detect with prescription sleep medications', () => {
    const data = createBaseQuestionnaireData({
      sleepHygiene: {
        supplements: [],
        prescriptionMeds: ['z_drugs', 'antidepressants'],
      },
      daytime: {
        sleepinessInterferes: true,
      },
    });

    const result = diagnoseMedicationRelatedSleepDisturbance(data);

    expect(result.hasCondition).toBe(true);
  });
});

// =============================================================================
// NIGHTMARE DIAGNOSIS TESTS
// =============================================================================

describe('diagnoseNightmares', () => {
  it('should detect nightmare disorder with 2+ per week', () => {
    const data = createBaseQuestionnaireData({
      nightmares: {
        hasNightmares: true,
        nightmaresPerWeek: 3,
        associatedWithTrauma: false,
      },
    });

    const result = diagnoseNightmares(data);

    expect(result.hasNightmareDisorder).toBe(true);
    expect(result.nightmaresPerWeek).toBe(3);
  });

  it('should NOT flag disorder with 1 per week', () => {
    const data = createBaseQuestionnaireData({
      nightmares: {
        hasNightmares: true,
        nightmaresPerWeek: 1,
        associatedWithTrauma: false,
      },
    });

    const result = diagnoseNightmares(data);

    expect(result.hasNightmareDisorder).toBe(false);
  });
});

// =============================================================================
// TREATMENT EFFECTIVENESS TESTS
// =============================================================================

describe('checkTreatmentEffectiveness', () => {
  it('should flag ineffective OSA treatment', () => {
    const data = createBaseQuestionnaireData({
      sleepDisorderDiagnoses: {
        diagnosedOSA: true,
        osaSeverity: 'moderate',
        osaTreated: true,
        osaTreatmentType: ['cpap'],
        osaTreatmentEffective: false, // New field
      } as QuestionnaireFormData['sleepDisorderDiagnoses'] & { osaTreatmentEffective: boolean },
    });

    const result = checkTreatmentEffectiveness(data);

    expect(result.osaTreatmentIneffective).toBe(true);
  });

  it('should NOT flag when treatment is effective', () => {
    const data = createBaseQuestionnaireData({
      sleepDisorderDiagnoses: {
        diagnosedOSA: true,
        osaTreated: true,
        osaTreatmentType: ['cpap'],
      },
    });

    const result = checkTreatmentEffectiveness(data);

    // Defaults to effective if field not present
    expect(result.osaTreatmentIneffective).toBe(false);
  });
});

// =============================================================================
// CHRONOTYPE TESTS
// =============================================================================

describe('determineChronotype', () => {
  it('should detect evening chronotype', () => {
    const data = createBaseQuestionnaireData({
      chronotype: {
        preference: 'late',
      },
      scheduledSleep: {
        lightsOutTime: '01:00',
        wakeupTime: '09:00',
      },
    });

    const metrics = calculateSleepMetrics(data);
    const result = determineChronotype(data, metrics);

    expect(result).toBe('evening (night owl)');
  });

  it('should detect morning chronotype', () => {
    const data = createBaseQuestionnaireData({
      chronotype: {
        preference: 'early',
      },
      scheduledSleep: {
        lightsOutTime: '21:00',
        wakeupTime: '05:00',
      },
    });

    const metrics = calculateSleepMetrics(data);
    const result = determineChronotype(data, metrics);

    expect(result).toBe('morning (early bird)');
  });
});

// =============================================================================
// NARCOLEPSY SCREENING TESTS
// =============================================================================

describe('screenNarcolepsy', () => {
  it('should detect diagnosed narcolepsy', () => {
    const data = createBaseQuestionnaireData({
      daytime: {
        diagnosedNarcolepsy: true,
      },
    });

    expect(screenNarcolepsy(data)).toBe(true);
  });

  it('should detect cataplexy symptoms', () => {
    const data = createBaseQuestionnaireData({
      daytime: {
        weaknessWhenExcited: ['feel_weak', 'brace_myself'],
        sleepParalysis: true,
      },
    });

    expect(screenNarcolepsy(data)).toBe(true);
  });
});

// =============================================================================
// FULL REPORT GENERATION TESTS
// =============================================================================

describe('generateDiagnosisReport', () => {
  it('should generate complete report for healthy individual', () => {
    const data = createBaseQuestionnaireData();
    const report = generateDiagnosisReport(data);

    expect(report.sleepMetrics).toBeDefined();
    expect(report.eds.severity).toBe('none');
    expect(report.insomnia.hasInsomnia).toBe(false);
    expect(report.sleepApnea.hasProbableSleepApnea).toBe(false);
    expect(report.hasCOMISA).toBe(false);
    expect(report.hasRLS).toBe(false);
  });

  it('should generate complete report for complex case', () => {
    const data = createBaseQuestionnaireData({
      scheduledSleep: {
        minutesToFallAsleep: '50',
        minutesAwakeAtNight: '40',
      },
      breathingDisorders: {
        snores: true,
        stopsBreathing: true,
      },
      daytime: {
        sleepinessInterferes: true,
        nonRestorativeSleep: true,
        tirednessRating: 7,
      },
    });

    const report = generateDiagnosisReport(data);

    expect(report.insomnia.hasInsomnia).toBe(true);
    expect(report.sleepApnea.hasProbableSleepApnea).toBe(true);
    expect(report.hasCOMISA).toBe(true);
  });
});
