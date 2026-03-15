import type { QuestionnaireFormData } from '@/validations/questionnaire';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface DiagnosisScenarioExpected {
  hasInsomnia: boolean;
  insomniaSeverity: 'none' | 'mild' | 'moderate-to-severe';
  hasOSA: boolean;
  hasCOMISA: boolean;
  hasRLS: boolean;
  hasNightmares: boolean;
  hasNarcolepsy: boolean;
  hasEDS: boolean;
  hasEDSFromNaps: boolean;
  hasInsufficientSleep: boolean;
  hasChronicFatigueSymptoms: boolean;
  hasPainRelatedSleepDisturbance: boolean;
  hasMildRespiratoryDisturbance: boolean;
}

export interface DiagnosisScenario {
  id: string;
  label: string;
  description: string;
  data: QuestionnaireFormData;
  expected: DiagnosisScenarioExpected;
}

function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const output = { ...target };

  for (const key in source) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) {
      continue;
    }

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
      continue;
    }

    (output as Record<string, unknown>)[key] = sourceValue;
  }

  return output;
}

function createBaseScenarioData(
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
      historyOfTBI: false,
      takingMedicationsThatMayCause: false,
      hasBehavioralHealthDiagnosis: false,
      hasSleepAversion: false,
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
      supplementsOther: '',
      prescriptionMeds: [],
      prescriptionMedsOther: '',
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
      lastCaffeineTime: '13:00',
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
      diagnosedDisorders: [],
      otherDiagnosisDescription: '',
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

export const defaultReviewScenario: DiagnosisScenario = {
  id: 'default-review',
  label: 'Default review example',
  description: 'The current dev prefill for general report review.',
  data: {
    ...createBaseScenarioData(),
    demographics: {
      yearOfBirth: 1990,
      sex: 'male',
      zipcode: '10001',
      weight: 165,
      height: 70,
    },
    daytime: {
      plannedNaps: { daysPerWeek: 2, napsPerWeek: 3, duration: '30' },
      fallAsleepDuring: ['lectures', 'evening'],
      sleepinessInterferes: true,
      sleepinessSeverity: 5,
      tiredButCantSleep: '3-5days',
      weaknessWhenExcited: [],
      sleepParalysis: false,
      diagnosedNarcolepsy: false,
      painAffectsSleep: false,
      painSeverity: null,
      jointMusclePain: false,
      nonRestorativeSleep: true,
      tirednessRating: 5,
      fatigueRating: 3,
    },
    scheduledSleep: {
      lightsOutTime: '23:00',
      lightsOutVaries: false,
      preBedActivity: [],
      minutesToFallAsleep: '30',
      nightWakeups: 2,
      wakeupReasons: ['urinate', 'noise'],
      minutesAwakeAtNight: '30',
      wakeupTime: '07:00',
      getOutOfBedTime: '07:15',
      earlyWakeupDays: 1,
      earlyWakeupMinutes: 15,
      usesAlarm: true,
    },
    unscheduledSleep: {
      lightsOutTime: '00:30',
      minutesToFallAsleep: '20',
      nightWakeups: 1,
      wakeupReasons: ['urinate'],
      minutesAwakeAtNight: '20',
      wakeupTime: '09:00',
      getOutOfBedTime: '09:30',
      usesAlarm: false,
    },
    breathingDisorders: {
      snores: true,
      stopsBreathing: false,
      mouthBreathes: true,
      wakesWithDryMouth: true,
    },
    nightmares: {
      remembersDreams: true,
      hasBadDreams: false,
      badDreamsPerWeek: null,
      hasNightmares: true,
      nightmaresPerWeek: 1,
      associatedWithTrauma: false,
      historyOfTBI: false,
      takingMedicationsThatMayCause: false,
      hasBehavioralHealthDiagnosis: false,
      hasSleepAversion: false,
    },
    chronotype: {
      preference: 'late',
      preferenceStrength: 'moderate',
      shiftWork: false,
      shiftType: '',
      shiftDaysPerWeek: 0,
      pastShiftWorkYears: 0,
      frequentTimeZoneTravel: false,
      workSchoolTime: '09:00',
    },
    sleepHygiene: {
      supplements: ['melatonin'],
      supplementsOther: '',
      prescriptionMeds: [],
      prescriptionMedsOther: '',
      stimulants: '',
      stimulantTime: '',
      smokesNicotine: false,
    },
    bedroom: {
      relaxing: 7,
      comfortable: 8,
      dark: 6,
      quiet: 7,
    },
    lifestyle: {
      caffeinePerDay: 2,
      lastCaffeineTime: '14:00',
      alcoholPerWeek: 3,
      exerciseDaysPerWeek: 3,
      exerciseDuration: 45,
      exerciseEndTime: '18:00',
    },
    mentalHealth: {
      worriesAffectSleep: true,
      anxietyInBed: true,
      timeInBedTrying: true,
      cancelsAfterPoorSleep: '1-2week',
      diagnosedMedicalConditions: [],
      diagnosedMentalHealthConditions: ['anxiety'],
      currentlyReceivingTreatment: false,
    },
  },
  expected: {
    hasInsomnia: true,
    insomniaSeverity: 'moderate-to-severe',
    hasOSA: true,
    hasCOMISA: true,
    hasRLS: false,
    hasNightmares: false,
    hasNarcolepsy: false,
    hasEDS: true,
    hasEDSFromNaps: false,
    hasInsufficientSleep: false,
    hasChronicFatigueSymptoms: true,
    hasPainRelatedSleepDisturbance: false,
    hasMildRespiratoryDisturbance: false,
  },
};

export const diagnosisScenarios: DiagnosisScenario[] = [
  defaultReviewScenario,
  {
    id: 'healthy-sleeper',
    label: 'Healthy sleeper',
    description: 'Baseline control with no major sleep problems.',
    data: createBaseScenarioData(),
    expected: {
      hasInsomnia: false,
      insomniaSeverity: 'none',
      hasOSA: false,
      hasCOMISA: false,
      hasRLS: false,
      hasNightmares: false,
      hasNarcolepsy: false,
      hasEDS: false,
      hasEDSFromNaps: false,
      hasInsufficientSleep: false,
      hasChronicFatigueSymptoms: false,
      hasPainRelatedSleepDisturbance: false,
      hasMildRespiratoryDisturbance: false,
    },
  },
  {
    id: 'maintenance-insomnia',
    label: "Chris bug: maintenance insomnia",
    description: 'Adequate time in bed with prolonged wake after sleep onset should not route to insufficient sleep.',
    data: createBaseScenarioData({
      scheduledSleep: {
        lightsOutTime: '22:30',
        minutesToFallAsleep: '10',
        minutesAwakeAtNight: '60',
        wakeupTime: '06:00',
      },
      unscheduledSleep: {
        lightsOutTime: '23:00',
        minutesToFallAsleep: '10',
        minutesAwakeAtNight: '20',
        wakeupTime: '08:00',
      },
      daytime: {
        sleepinessInterferes: true,
        tirednessRating: 5,
        fallAsleepDuring: ['lectures'],
      },
    }),
    expected: {
      hasInsomnia: true,
      insomniaSeverity: 'mild',
      hasOSA: false,
      hasCOMISA: false,
      hasRLS: false,
      hasNightmares: false,
      hasNarcolepsy: false,
      hasEDS: false,
      hasEDSFromNaps: false,
      hasInsufficientSleep: false,
      hasChronicFatigueSymptoms: true,
      hasPainRelatedSleepDisturbance: false,
      hasMildRespiratoryDisturbance: false,
    },
  },
  {
    id: 'sleep-onset-insomnia-mild',
    label: 'Sleep-onset insomnia (mild)',
    description: 'SOL in the mild range with one daytime symptom.',
    data: createBaseScenarioData({
      scheduledSleep: {
        minutesToFallAsleep: '40',
      },
      daytime: {
        sleepinessInterferes: true,
      },
    }),
    expected: {
      hasInsomnia: true,
      insomniaSeverity: 'mild',
      hasOSA: false,
      hasCOMISA: false,
      hasRLS: false,
      hasNightmares: false,
      hasNarcolepsy: false,
      hasEDS: false,
      hasEDSFromNaps: false,
      hasInsufficientSleep: false,
      hasChronicFatigueSymptoms: true,
      hasPainRelatedSleepDisturbance: false,
      hasMildRespiratoryDisturbance: false,
    },
  },
  {
    id: 'sleep-onset-insomnia-moderate',
    label: 'Sleep-onset insomnia (moderate-to-severe)',
    description: 'SOL in the severe range with multiple daytime symptoms.',
    data: createBaseScenarioData({
      scheduledSleep: {
        minutesToFallAsleep: '50',
      },
      daytime: {
        sleepinessInterferes: true,
        nonRestorativeSleep: true,
        tirednessRating: 8,
        fatigueRating: 6,
      },
    }),
    expected: {
      hasInsomnia: true,
      insomniaSeverity: 'moderate-to-severe',
      hasOSA: false,
      hasCOMISA: false,
      hasRLS: false,
      hasNightmares: false,
      hasNarcolepsy: false,
      hasEDS: false,
      hasEDSFromNaps: false,
      hasInsufficientSleep: false,
      hasChronicFatigueSymptoms: true,
      hasPainRelatedSleepDisturbance: false,
      hasMildRespiratoryDisturbance: false,
    },
  },
  {
    id: 'osa-risk-factors',
    label: 'OSA via snoring + risk factors',
    description: 'Snoring plus age, BMI, tiredness, and non-restorative sleep should trigger probable OSA.',
    data: createBaseScenarioData({
      demographics: {
        yearOfBirth: 1960,
        weight: 220,
        height: 70,
      },
      breathingDisorders: {
        snores: true,
      },
      daytime: {
        nonRestorativeSleep: true,
        tirednessRating: 5,
      },
    }),
    expected: {
      hasInsomnia: true,
      insomniaSeverity: 'mild',
      hasOSA: true,
      hasCOMISA: true,
      hasRLS: false,
      hasNightmares: false,
      hasNarcolepsy: false,
      hasEDS: false,
      hasEDSFromNaps: false,
      hasInsufficientSleep: false,
      hasChronicFatigueSymptoms: true,
      hasPainRelatedSleepDisturbance: false,
      hasMildRespiratoryDisturbance: false,
    },
  },
  {
    id: 'osa-breathing-pauses',
    label: 'OSA via breathing pauses',
    description: 'Reported breathing pauses should trigger probable OSA immediately.',
    data: createBaseScenarioData({
      breathingDisorders: {
        snores: true,
        stopsBreathing: true,
      },
    }),
    expected: {
      hasInsomnia: false,
      insomniaSeverity: 'none',
      hasOSA: true,
      hasCOMISA: false,
      hasRLS: false,
      hasNightmares: false,
      hasNarcolepsy: false,
      hasEDS: false,
      hasEDSFromNaps: false,
      hasInsufficientSleep: false,
      hasChronicFatigueSymptoms: false,
      hasPainRelatedSleepDisturbance: false,
      hasMildRespiratoryDisturbance: false,
    },
  },
  {
    id: 'mild-respiratory-disturbance',
    label: 'Mild respiratory disturbance',
    description: 'Snoring and mouth breathing without apnea risk factors should stay mild rather than probable OSA.',
    data: createBaseScenarioData({
      demographics: {
        yearOfBirth: 1995,
        weight: 150,
        height: 70,
      },
      breathingDisorders: {
        snores: true,
        mouthBreathes: true,
      },
      daytime: {
        tirednessRating: 2,
        fatigueRating: 2,
        nonRestorativeSleep: false,
      },
    }),
    expected: {
      hasInsomnia: false,
      insomniaSeverity: 'none',
      hasOSA: false,
      hasCOMISA: false,
      hasRLS: false,
      hasNightmares: false,
      hasNarcolepsy: false,
      hasEDS: false,
      hasEDSFromNaps: false,
      hasInsufficientSleep: false,
      hasChronicFatigueSymptoms: false,
      hasPainRelatedSleepDisturbance: false,
      hasMildRespiratoryDisturbance: true,
    },
  },
  {
    id: 'insufficient-sleep',
    label: 'Insufficient sleep syndrome',
    description: 'Short sleep with daytime sleepiness and no competing disorder should classify as insufficient sleep.',
    data: createBaseScenarioData({
      scheduledSleep: {
        lightsOutTime: '01:00',
        wakeupTime: '05:00',
        minutesToFallAsleep: '10',
        minutesAwakeAtNight: '10',
      },
      unscheduledSleep: {
        lightsOutTime: '01:00',
        wakeupTime: '05:30',
        minutesToFallAsleep: '10',
        minutesAwakeAtNight: '10',
      },
      daytime: {
        sleepinessInterferes: true,
        fallAsleepDuring: ['stoplight', 'meal'],
      },
    }),
    expected: {
      hasInsomnia: false,
      insomniaSeverity: 'none',
      hasOSA: false,
      hasCOMISA: false,
      hasRLS: false,
      hasNightmares: false,
      hasNarcolepsy: false,
      hasEDS: false,
      hasEDSFromNaps: false,
      hasInsufficientSleep: true,
      hasChronicFatigueSymptoms: false,
      hasPainRelatedSleepDisturbance: false,
      hasMildRespiratoryDisturbance: false,
    },
  },
  {
    id: 'comisa',
    label: 'COMISA',
    description: 'Insomnia and probable OSA together should flag COMISA.',
    data: createBaseScenarioData({
      demographics: {
        yearOfBirth: 1960,
        weight: 220,
        height: 70,
      },
      scheduledSleep: {
        minutesToFallAsleep: '50',
      },
      breathingDisorders: {
        snores: true,
      },
      daytime: {
        sleepinessInterferes: true,
        nonRestorativeSleep: true,
        tirednessRating: 7,
      },
    }),
    expected: {
      hasInsomnia: true,
      insomniaSeverity: 'moderate-to-severe',
      hasOSA: true,
      hasCOMISA: true,
      hasRLS: false,
      hasNightmares: false,
      hasNarcolepsy: false,
      hasEDS: false,
      hasEDSFromNaps: false,
      hasInsufficientSleep: false,
      hasChronicFatigueSymptoms: true,
      hasPainRelatedSleepDisturbance: false,
      hasMildRespiratoryDisturbance: false,
    },
  },
  {
    id: 'narcolepsy-screen',
    label: 'Narcolepsy screen',
    description: 'Cataplexy-type symptoms plus sleep paralysis should flag narcolepsy symptoms.',
    data: createBaseScenarioData({
      daytime: {
        sleepinessInterferes: true,
        fallAsleepDuring: ['stoplight', 'meal', 'conversation'],
        weaknessWhenExcited: ['feel_weak', 'brace_myself'],
        sleepParalysis: true,
      },
    }),
    expected: {
      hasInsomnia: false,
      insomniaSeverity: 'none',
      hasOSA: false,
      hasCOMISA: false,
      hasRLS: false,
      hasNightmares: false,
      hasNarcolepsy: true,
      hasEDS: true,
      hasEDSFromNaps: false,
      hasInsufficientSleep: false,
      hasChronicFatigueSymptoms: false,
      hasPainRelatedSleepDisturbance: false,
      hasMildRespiratoryDisturbance: false,
    },
  },
  {
    id: 'nightmare-disorder',
    label: 'Nightmare disorder',
    description: 'Nightmares at 2 per week should now trigger the report-level nightmare disorder flag.',
    data: createBaseScenarioData({
      nightmares: {
        hasNightmares: true,
        nightmaresPerWeek: 2,
      },
    }),
    expected: {
      hasInsomnia: false,
      insomniaSeverity: 'none',
      hasOSA: false,
      hasCOMISA: false,
      hasRLS: false,
      hasNightmares: true,
      hasNarcolepsy: false,
      hasEDS: false,
      hasEDSFromNaps: false,
      hasInsufficientSleep: false,
      hasChronicFatigueSymptoms: false,
      hasPainRelatedSleepDisturbance: false,
      hasMildRespiratoryDisturbance: false,
    },
  },
  {
    id: 'eds-from-naps',
    label: 'EDS from naps',
    description: 'Frequent 30-minute planned naps should count as daytime sleepiness even without dozing activities.',
    data: createBaseScenarioData({
      daytime: {
        plannedNaps: { daysPerWeek: 3, napsPerWeek: 3, duration: '30' },
      },
    }),
    expected: {
      hasInsomnia: false,
      insomniaSeverity: 'none',
      hasOSA: false,
      hasCOMISA: false,
      hasRLS: false,
      hasNightmares: false,
      hasNarcolepsy: false,
      hasEDS: true,
      hasEDSFromNaps: true,
      hasInsufficientSleep: false,
      hasChronicFatigueSymptoms: false,
      hasPainRelatedSleepDisturbance: false,
      hasMildRespiratoryDisturbance: false,
    },
  },
  {
    id: 'chronic-fatigue',
    label: 'Chronic fatigue symptoms',
    description: 'Three qualifying daytime symptoms should flag chronic fatigue even without pain.',
    data: createBaseScenarioData({
      daytime: {
        sleepinessInterferes: true,
        tirednessRating: 8,
        fatigueRating: 8,
      },
    }),
    expected: {
      hasInsomnia: false,
      insomniaSeverity: 'none',
      hasOSA: false,
      hasCOMISA: false,
      hasRLS: false,
      hasNightmares: false,
      hasNarcolepsy: false,
      hasEDS: false,
      hasEDSFromNaps: false,
      hasInsufficientSleep: false,
      hasChronicFatigueSymptoms: true,
      hasPainRelatedSleepDisturbance: false,
      hasMildRespiratoryDisturbance: false,
    },
  },
];

export function getDiagnosisScenario(scenarioId: string): DiagnosisScenario | undefined {
  return diagnosisScenarios.find(scenario => scenario.id === scenarioId);
}
