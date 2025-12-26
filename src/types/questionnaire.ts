// Types for the Sleep Questionnaire

export interface QuestionnaireData {
  // Section 1: Daytime feelings
  daytime: {
    plannedNaps: {
      daysPerWeek: number;
      duration: '0-10' | '15-30' | '30-90' | '>90' | null;
    };
    fallAsleepDuring: string[];
    tirednessInterferes: boolean;
    tirednessSeverity: number | null; // 1-10 scale: 1=nuisance, 10=safety concern
    tiredButCantSleep: 'everyday' | '5+days' | '3-5days' | '1-3days' | '<1day' | null;
    dreamsWhileFallingAsleep: boolean;
    weaknessWhenExcited: string[];
    sleepParalysis: boolean;
    diagnosedNarcolepsy: boolean;
    // Pain and chronic fatigue screening
    painAffectsSleep: boolean;
    painSeverity: number | null; // 1-10 scale
    muscleJointPain: boolean;
    nonRestorativeSleep: boolean;
  };

  // Section 2a: Scheduled/work/school days sleep
  scheduledSleep: {
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

  // Section 2b: Unscheduled/weekend days sleep
  unscheduledSleep: {
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

  // Section 3: Sleep breathing disorders
  breathingDisorders: {
    diagnosed: boolean;
    severity: 'mild' | 'moderate' | 'severe' | null;
    treatment: string[];
    snores: boolean;
    stopsBreathing: boolean;
    mouthBreathes: boolean;
    wakesWithDryMouth: boolean;
  };

  // Section 4: Restless legs syndrome
  restlessLegs: {
    diagnosed: boolean;
    treatment: string[];
    troubleLyingStill: boolean;
    urgeToMoveLegs: boolean;
    movementRelieves: boolean;
    daytimeDiscomfort: boolean;
  };

  // Section 5: Parasomnia
  parasomnia: {
    nightBehaviors: string[];
    remembersEvents: boolean;
    actsOutDreams: boolean;
    bedwetting: boolean;
    diagnosedParasomnia: boolean;
    parasomniaType: string;
    receivedTreatment: boolean;
    treatmentType: string;
  };

  // Section 6: Nightmares
  nightmares: {
    hasNightmares: boolean;
    nightmaresPerWeek: number | null;
    associatedWithTrauma: boolean;
  };

  // Section 7: Chronotype preferences
  chronotype: {
    preference: 'early' | 'late' | 'flexible';
    shiftWork: boolean;
    shiftType: string;
    shiftDaysPerWeek: number | null;
    pastShiftWorkYears: number | null;
    frequentTimeZoneTravel: boolean;
    workSchoolTime: string;
  };

  // Section 8-15: Sleep hygiene and lifestyle
  sleepHygiene: {
    supplements: string[];
    prescriptionMeds: string[];
    stimulants: string;
    stimulantTime: string;
    smokesNicotine: boolean;
  };

  bedroom: {
    relaxing: number;
    comfortable: number;
    dark: number;
    quiet: number;
  };

  lifestyle: {
    caffeinePerDay: number;
    lastCaffeineTime: string;
    alcoholPerWeek: {
      wine: number;
      cocktails: number;
    };
    exerciseDaysPerWeek: number;
    exerciseDuration: number | null;
    exerciseEndTime: string;
  };

  mentalHealth: {
    worriesAffectSleep: boolean;
    anxietyInBed: boolean;
    timeInBedTrying: boolean;
    cancelsAfterPoorSleep: 'never' | '1-2week' | '3+week';
    // Medical history
    diagnosedMedicalConditions: string[];
    // Mental health history
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
