// Types for the Sleep Questionnaire

export interface QuestionnaireData {
  // Sleep Disorder History
  sleepDisorderHistory: {
    previousDiagnoses: string[];
    otherDiagnosis: string;
  };

  // Daytime Energy and Alertness
  daytime: {
    plannedNaps: {
      daysPerWeek: number;
      duration: '0-10' | '15-30' | '30-90' | '>90' | null;
    };
    fallAsleepDuring: string[];
    sleepinessRating: number | null; // 1-10: 1=never, 10=often
    sleepinessInterference: number | null; // 1-10
    fatigueRating: number | null; // 1-10: 1=never, 10=often
    fatigueInterference: number | null; // 1-10
    dreamsWhileFallingAsleep: boolean;
    weaknessWhenExcited: string[];
    sleepParalysis: boolean;
    sleepParalysisFrequency: number | null; // times in last month
    diagnosedNarcolepsy: boolean;
    painAffectsSleep: boolean;
    painSeverity: number | null; // 1-10 scale
    muscleJointPain: boolean;
    nonRestorativeSleep: boolean;
  };

  // Scheduled/work/school days sleep
  scheduledSleep: {
    bedtime: string; // time getting into bed
    lightsOutTime: string;
    lightsOutVaries: boolean;
    minutesToFallAsleep: number;
    nightWakeups: number;
    wakeupReasons: string[];
    minutesAwakeAtNight: number;
    wakeupTime: string;
    getOutOfBedTime: string;
    earlyWakeupDays: number;
    earlyWakeupMinutes: number | null;
    usesAlarm: boolean;
    plannedNapsPerWeek: number;
    averageNapMinutes: number | null;
  };

  // Unscheduled/weekend days sleep
  unscheduledSleep: {
    bedtime: string;
    lightsOutTime: string;
    minutesToFallAsleep: number;
    nightWakeups: number;
    wakeupReasons: string[];
    minutesAwakeAtNight: number;
    wakeupTime: string;
    getOutOfBedTime: string;
    earlyWakeupDays: number;
    earlyWakeupMinutes: number | null;
    usesAlarm: boolean;
    plannedNapsPerWeek: number;
    averageNapMinutes: number | null;
  };

  // Sleep breathing disorders
  breathingDisorders: {
    diagnosed: boolean;
    severity: 'mild' | 'moderate' | 'severe' | null;
    treatment: string[];
    snores: boolean;
    stopsBreathing: boolean;
    wakesWithDryMouth: boolean;
    mouthBreathesDay: boolean;
    morningHeadache: boolean;
    airwayCrowding: string[];
  };

  // Restless legs / movement disorders
  restlessLegs: {
    diagnosed: boolean;
    treatment: string[];
    hardToLieStill: boolean;
    movementRelieves: boolean;
    rlsFrequency: string | null;
    rlsSeverity: number | null;
    rlsOnsetTime: string | null;
    daytimeDiscomfort: boolean;
  };

  // Parasomnia
  parasomnia: {
    nightBehaviors: string[];
    remembersEvents: boolean;
    actsOutDreams: boolean;
    bedwetting: boolean;
  };

  // Nightmares
  nightmares: {
    hasNightmares: boolean;
    nightmaresPerWeek: number | null;
    associatedWithTrauma: boolean;
  };

  // Chronotype preferences
  chronotype: {
    preference: 'early' | 'late' | 'neutral';
    socialJetLag: boolean;
    shiftWork: boolean;
    shiftType: string;
    shiftDaysPerWeek: number | null;
    pastShiftWorkYears: number | null;
    timeZoneTravelPerYear: number | null;
    troubleAdjustingAfterTravel: boolean;
    earliestWorkSchoolTime: string;
  };

  // Sleep hygiene (medications & supplements)
  sleepHygiene: {
    supplements: string[];
    prescriptionMeds: string[];
    sleepAffectingMeds: string[];
    stimulants: string;
    stimulantTime: string;
  };

  // Bedroom environment
  bedroom: {
    relaxing: number;
    comfortable: number;
    dark: number;
    quiet: number;
    temperature: number;
    safety: number;
  };

  // Lifestyle factors
  lifestyle: {
    caffeinePerDay: number;
    lastCaffeineTime: string;
    alcoholPerWeek: {
      wine: number;
      cocktails: number;
    };
    lastAlcoholTime: string;
    exerciseDaysPerWeek: number;
    exerciseDuration: number | null;
    exerciseEndTime: string;
    smokesNicotine: boolean;
    lastMealTime: string;
    snacksBeforeBed: boolean;
  };

  // Mental health
  mentalHealth: {
    worriesAffectSleep: boolean;
    anxietyInBed: boolean;
    timeInBedTrying: boolean;
    cancelsAfterPoorSleep: 'never' | '1-2week' | '3+week';
    diagnosedMedicalConditions: string[];
    diagnosedMentalHealthConditions: string[];
    currentlyReceivingTreatment: boolean;
  };

  // Demographics
  demographics: {
    yearOfBirth: number | null;
    sex: 'male' | 'female' | 'other' | 'prefer-not-to-say' | null;
    zipcode: string;
    weight: number | null;
    height: number | null;
  };
}

export type QuestionnaireSection =
  | 'intro'
  | 'sleep-disorder-history'
  | 'daytime'
  | 'scheduled-sleep'
  | 'unscheduled-sleep'
  | 'breathing-disorders'
  | 'restless-legs'
  | 'parasomnia'
  | 'nightmares'
  | 'chronotype'
  | 'sleep-hygiene'
  | 'bedroom'
  | 'lifestyle'
  | 'mental-health'
  | 'demographics'
  | 'report';

export interface QuestionnaireProgress {
  currentSection: QuestionnaireSection;
  completedSections: QuestionnaireSection[];
  lastUpdated: Date;
}
