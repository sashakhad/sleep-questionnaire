import { questionnaireSchema } from '@/validations/questionnaire';

function minimalValidPayload(overrides: Record<string, unknown> = {}) {
  return {
    intro: { acceptedDisclaimer: true },
    demographics: {
      yearOfBirth: 1990,
      sex: 'male',
      zipcode: '10001',
      weight: 165,
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
      hypnagogicHallucinations: false,
      triedCannotNapDuringDay: false,
      diagnosedNarcolepsy: false,
      painAffectsSleep: false,
      painSeverity: null,
      jointMusclePain: false,
      nonRestorativeSleep: false,
      tirednessRating: 5,
      fatigueRating: 3,
    },
    scheduledSleep: {
      lightsOutTime: '23:00',
      lightsOutVaries: false,
      preBedActivity: [],
      minutesToFallAsleep: '20',
      nightWakeups: 0,
      wakeupReasons: [],
      minutesAwakeAtNight: '10',
      wakeupTime: '07:00',
      getOutOfBedTime: '07:15',
      earlyWakeupDays: 0,
      earlyWakeupMinutes: null,
      usesAlarm: true,
    },
    unscheduledSleep: {
      lightsOutTime: '00:00',
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
      supplementsFrequencyPerWeek: null,
      prescriptionMeds: [],
      prescriptionMedsOther: '',
      prescriptionMedsFrequencyPerWeek: null,
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
      caffeinePerDay: 0,
      lastCaffeineTime: '',
      alcoholPerWeek: 0,
      exerciseDaysPerWeek: 3,
      exerciseDuration: 30,
      exerciseEndTime: '',
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
    ...overrides,
  };
}

describe('questionnaireSchema minute increments (round 6)', () => {
  it('accepts 0 minutes for sleep onset latency and WASO', () => {
    const payload = minimalValidPayload({
      scheduledSleep: {
        lightsOutTime: '23:00',
        lightsOutVaries: false,
        preBedActivity: [],
        minutesToFallAsleep: '0',
        nightWakeups: 0,
        wakeupReasons: [],
        minutesAwakeAtNight: '0',
        wakeupTime: '07:00',
        getOutOfBedTime: '07:15',
        earlyWakeupDays: 0,
        earlyWakeupMinutes: null,
        usesAlarm: true,
      },
    });

    const result = questionnaireSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it('still rejects invalid minute increment strings', () => {
    const payload = minimalValidPayload({
      scheduledSleep: {
        lightsOutTime: '23:00',
        lightsOutVaries: false,
        preBedActivity: [],
        minutesToFallAsleep: '5',
        nightWakeups: 0,
        wakeupReasons: [],
        minutesAwakeAtNight: '10',
        wakeupTime: '07:00',
        getOutOfBedTime: '07:15',
        earlyWakeupDays: 0,
        earlyWakeupMinutes: null,
        usesAlarm: true,
      },
    });

    const result = questionnaireSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});
