import type { QuestionnaireFormData } from '@/validations/questionnaire';
import { hasSufficientAnswers } from '@/lib/questionnaire-completeness';

function createMinimalQuestionnaireData(
  overrides: Partial<QuestionnaireFormData> = {}
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
      hypnagogicHallucinations: false,
      triedCannotNapDuringDay: false,
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
      workSchoolTime: '',
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
      comfortable: 7,
      dark: 7,
      quiet: 7,
    },
    lifestyle: {
      caffeinePerDay: 1,
      lastCaffeineTime: '',
      alcoholPerWeek: 0,
      exerciseDaysPerWeek: 3,
      exerciseDuration: null,
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
  };

  return { ...base, ...overrides };
}

describe('hasSufficientAnswers', () => {
  it('returns false when core sleep times are missing', () => {
    const data = createMinimalQuestionnaireData({
      scheduledSleep: {
        ...createMinimalQuestionnaireData().scheduledSleep,
        lightsOutTime: '',
        wakeupTime: '',
      },
    });

    expect(hasSufficientAnswers(data)).toBe(false);
  });

  it('returns false when all daytime ratings are null', () => {
    const data = createMinimalQuestionnaireData();

    expect(hasSufficientAnswers(data)).toBe(false);
  });

  it('returns true when core times and at least one rating are present', () => {
    const data = createMinimalQuestionnaireData({
      daytime: {
        ...createMinimalQuestionnaireData().daytime,
        tirednessRating: 5,
      },
    });

    expect(hasSufficientAnswers(data)).toBe(true);
  });
});
