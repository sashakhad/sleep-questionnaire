// Types for the Sleep Questionnaire

export interface QuestionnaireData {
  // Intro/consent
  intro: {
    acceptedDisclaimer: boolean;
  };

  // Demographics (collected early) - yearOfBirth, sex, zipcode are required
  demographics: {
    yearOfBirth: number; // Required
    sex: 'male' | 'female' | 'transgender' | 'other' | 'prefer-not-to-say'; // Required
    zipcode: string; // Required (min 5 chars)
    weight: number | null;
    height: number | null;
  };

  // Section 1: Daytime functioning
  daytime: {
    plannedNaps: {
      daysPerWeek: number;
      napsPerWeek: number; // max 21 for narcolepsy patients
      duration: '10' | '20' | '30' | '40' | '50' | '60' | '70' | '80' | '90' | '100' | '110' | '120' | '>120' | null;
    };
    fallAsleepDuring: string[];
    sleepinessInterferes: boolean; // renamed from tirednessInterferes
    sleepinessSeverity: number | null; // 1-10 scale: 1=nuisance, 10=safety concern
    tiredButCantSleep: 'everyday' | '5+days' | '3-5days' | '1-3days' | '<1day' | null;
    weaknessWhenExcited: string[];
    sleepParalysis: boolean;
    diagnosedNarcolepsy: boolean;
    // Sleep quality section (renamed from Pain and Energy Levels)
    painAffectsSleep: boolean;
    painSeverity: number | null; // 1-10 scale
    jointMusclePain: boolean; // renamed for first-person declarative
    nonRestorativeSleep: boolean;
    // New rating scales
    sleepinessRating: number | null; // ability to fall asleep during the day
    tirednessRating: number | null; // mild sleepiness, headache, heavy eyes
    fatigueRating: number | null; // flu-like symptoms, poor motivation, aches
  };

  // Section 2a: Scheduled/work/school days sleep (Sunday-Thursday)
  // Note: Napping questions consolidated into Daytime section
  scheduledSleep: {
    lightsOutTime: string;
    lightsOutVaries: boolean; // varies more than 2 hours
    preBedActivity: string[]; // what you do in bed >15min before lights out
    minutesToFallAsleep: '10' | '20' | '30' | '40' | '50' | '60' | '70' | '80' | '90' | '100' | '110' | '120' | '>120' | null;
    nightWakeups: number;
    wakeupReasons: string[];
    minutesAwakeAtNight: '10' | '20' | '30' | '40' | '50' | '60' | '70' | '80' | '90' | '100' | '110' | '120' | '>120' | null;
    wakeupTime: string;
    getOutOfBedTime: string;
    earlyWakeupDays: number;
    earlyWakeupMinutes: number | null;
    usesAlarm: boolean;
  };

  // Section 2b: Unscheduled/weekend days sleep
  // Note: Napping questions consolidated into Daytime section
  unscheduledSleep: {
    lightsOutTime: string;
    minutesToFallAsleep: '10' | '20' | '30' | '40' | '50' | '60' | '70' | '80' | '90' | '100' | '110' | '120' | '>120' | null;
    nightWakeups: number;
    wakeupReasons: string[];
    minutesAwakeAtNight: '10' | '20' | '30' | '40' | '50' | '60' | '70' | '80' | '90' | '100' | '110' | '120' | '>120' | null;
    wakeupTime: string;
    getOutOfBedTime: string;
    usesAlarm: boolean;
  };

  // Section 3: Sleep breathing disorder symptoms
  breathingDisorders: {
    snores: boolean;
    stopsBreathing: boolean;
    mouthBreathes: boolean;
    wakesWithDryMouth: boolean;
  };

  // Section 4: Restless legs syndrome
  restlessLegs: {
    troubleLyingStill: boolean;
    urgeToMoveLegs: boolean;
    movementRelieves: boolean;
    daytimeDiscomfort: boolean;
    legCramps: boolean;
    legCrampsPerWeek: number | null; // Frequency of leg cramps (nights per week)
  };

  // Section 5: Parasomnia
  parasomnia: {
    nightBehaviors: string[];
    remembersEvents: boolean;
    actsOutDreams: boolean;
    hasInjuredOrLeftHome: boolean;
    bedwetting: boolean;
    diagnosedParasomnia: boolean;
    parasomniaType: string;
    receivedTreatment: boolean;
    treatmentType: string;
  };

  // Section 6: Dreams and Nightmares
  nightmares: {
    // Dream recall
    remembersDreams: boolean;
    // Bad dreams (disturbing content but no waking with distress)
    hasBadDreams: boolean;
    badDreamsPerWeek: number | null;
    // Nightmares (waking feeling scared/panicked/upset)
    hasNightmares: boolean;
    nightmaresPerWeek: number | null;
    associatedWithTrauma: boolean;
  };

  // Section 7: Chronotype preferences
  chronotype: {
    preference: 'early' | 'late' | 'flexible';
    preferenceStrength: 'slight' | 'moderate' | 'strong' | null; // Extent of circadian preference
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
    alcoholPerWeek: number; // Combined beer/wine/cocktails
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

  // Sleep Disorder Diagnoses (moved to end)
  sleepDisorderDiagnoses: {
    // Sleep Apnea
    diagnosedOSA: boolean;
    osaSeverity: 'mild' | 'moderate' | 'severe' | null;
    osaTreated: boolean;
    osaTreatmentType: string[]; // CPAP, dental device, other
    osaTreatmentEffective: boolean | null; // Is treatment effective?
    // RLS
    diagnosedRLS: boolean;
    rlsTreated: boolean;
    rlsTreatment: string[];
    rlsTreatmentEffective: boolean | null; // Is treatment effective?
  };
}

export type QuestionnaireSection =
  | 'intro'
  | 'demographics' // Moved to after intro
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
  | 'sleep-disorder-diagnoses' // New section at end for OSA/RLS diagnoses
  | 'report';

export interface QuestionnaireProgress {
  currentSection: QuestionnaireSection;
  completedSections: QuestionnaireSection[];
  lastUpdated: Date;
}
