import { z } from 'zod';

// Time string validation - accepts HH:MM format or empty string
const timeString = z
  .string()
  .refine(val => val === '' || /^\d{1,2}:\d{2}$/.test(val), {
    message: 'Time must be in HH:MM format',
  });

// 10-minute increment options for duration fields
const minuteIncrements = z.enum(['10', '20', '30', '40', '50', '60', '70', '80', '90', '100', '110', '120', '>120']).nullable();

// Section 1: Daytime feelings schema
export const daytimeSchema = z.object({
  plannedNaps: z.object({
    daysPerWeek: z.number().min(0).max(7),
    napsPerWeek: z.number().min(0).max(21), // max 21 for narcolepsy patients who take multiple planned naps
    duration: minuteIncrements, // Changed to 10-minute increments
  }),
  fallAsleepDuring: z.array(z.string()),
  sleepinessInterferes: z.boolean(), // renamed from tirednessInterferes
  sleepinessSeverity: z.number().min(1).max(10).nullable(), // renamed from tirednessSeverity
  tiredButCantSleep: z.enum(['everyday', '5+days', '3-5days', '1-3days', '<1day']).nullable(),
  // Removed dreamsWhileFallingAsleep - cut narcolepsy dreams question
  weaknessWhenExcited: z.array(z.string()),
  sleepParalysis: z.boolean(),
  diagnosedNarcolepsy: z.boolean(),
  // Sleep quality section (renamed from Pain and Energy Levels)
  painAffectsSleep: z.boolean(),
  painSeverity: z.number().min(1).max(10).nullable(),
  jointMusclePain: z.boolean(), // renamed from muscleJointPain - first person declarative
  nonRestorativeSleep: z.boolean(),
  // New rating scales
  sleepinessRating: z.number().min(1).max(10).nullable(), // ability to fall asleep during the day
  tirednessRating: z.number().min(1).max(10).nullable(), // mild sleepiness, headache, heavy eyes
  fatigueRating: z.number().min(1).max(10).nullable(), // flu-like symptoms, poor motivation, aches
});

// Section 2a: Scheduled sleep (work/school nights - Sunday-Thursday)
export const scheduledSleepSchema = z.object({
  lightsOutTime: timeString,
  lightsOutVaries: z.boolean(), // varies more than 2 hours
  preBedActivity: z.array(z.string()), // what you do in bed >15min before lights out
  minutesToFallAsleep: minuteIncrements, // 10-minute increments
  nightWakeups: z.number().min(0),
  wakeupReasons: z.array(z.string()),
  minutesAwakeAtNight: minuteIncrements, // 10-minute increments
  wakeupTime: timeString,
  getOutOfBedTime: timeString,
  earlyWakeupDays: z.number().min(0).max(7),
  earlyWakeupMinutes: z.number().min(0).nullable(),
  usesAlarm: z.boolean(),
});

// Section 2b: Unscheduled sleep (weekends) - removed early wakeup question
export const unscheduledSleepSchema = z.object({
  lightsOutTime: timeString,
  minutesToFallAsleep: minuteIncrements, // 10-minute increments
  nightWakeups: z.number().min(0),
  wakeupReasons: z.array(z.string()),
  minutesAwakeAtNight: minuteIncrements, // 10-minute increments
  wakeupTime: timeString,
  getOutOfBedTime: timeString,
  usesAlarm: z.boolean(),
});

// Section 3: Breathing disorder symptoms (diagnosis moved to end)
export const breathingDisordersSchema = z.object({
  snores: z.boolean(),
  stopsBreathing: z.boolean(),
  mouthBreathes: z.boolean(),
  wakesWithDryMouth: z.boolean(),
});

// Section 4: Restless legs symptoms (diagnosis moved to end)
export const restlessLegsSchema = z.object({
  troubleLyingStill: z.boolean(),
  urgeToMoveLegs: z.boolean(),
  movementRelieves: z.boolean(),
  daytimeDiscomfort: z.boolean(),
  legCramps: z.boolean(),
  legCrampsPerWeek: z.number().min(0).max(7).nullable(), // Frequency of leg cramps
});

// Section 5: Parasomnia
export const parasomniaSchema = z.object({
  nightBehaviors: z.array(z.string()),
  remembersEvents: z.boolean(),
  actsOutDreams: z.boolean(),
  hasInjuredOrLeftHome: z.boolean(),
  bedwetting: z.boolean(),
  diagnosedParasomnia: z.boolean(),
  parasomniaType: z.string(),
  receivedTreatment: z.boolean(),
  treatmentType: z.string(),
});

// Section 6: Dreams and Nightmares
export const nightmaresSchema = z.object({
  // Dream recall
  remembersDreams: z.boolean(),
  // Bad dreams (disturbing content but no waking with distress)
  hasBadDreams: z.boolean(),
  badDreamsPerWeek: z.number().min(0).max(7).nullable(),
  // Nightmares (waking feeling scared/panicked/upset)
  hasNightmares: z.boolean(),
  nightmaresPerWeek: z.number().min(0).max(7).nullable(),
  associatedWithTrauma: z.boolean(),
});

// Section 7: Chronotype
export const chronotypeSchema = z.object({
  preference: z.enum(['early', 'late', 'flexible']),
  preferenceStrength: z.enum(['slight', 'moderate', 'strong']).nullable(), // Extent of circadian preference
  shiftWork: z.boolean(),
  shiftType: z.string(),
  shiftDaysPerWeek: z.number().min(0).max(7).nullable(),
  pastShiftWorkYears: z.number().min(0).nullable(),
  frequentTimeZoneTravel: z.boolean(),
  workSchoolTime: timeString,
});

// Section 8: Sleep hygiene
export const sleepHygieneSchema = z.object({
  supplements: z.array(z.string()),
  supplementsOther: z.string(), // Other write-in field
  prescriptionMeds: z.array(z.string()),
  prescriptionMedsOther: z.string(), // Other write-in field
  stimulants: z.string(),
  stimulantTime: timeString,
  smokesNicotine: z.boolean(),
});

// Section 9: Bedroom environment
export const bedroomSchema = z.object({
  relaxing: z.number().min(1).max(10),
  comfortable: z.number().min(1).max(10),
  dark: z.number().min(1).max(10),
  quiet: z.number().min(1).max(10),
});

// Section 10-12: Lifestyle
export const lifestyleSchema = z.object({
  caffeinePerDay: z.number().min(0),
  lastCaffeineTime: timeString,
  alcoholPerWeek: z.number().min(0), // Combined beer/wine/cocktails
  exerciseDaysPerWeek: z.number().min(0).max(7),
  exerciseDuration: z.number().min(0).nullable(),
  exerciseEndTime: timeString,
});

// Section 13-15: Mental health
export const mentalHealthSchema = z.object({
  worriesAffectSleep: z.boolean(),
  anxietyInBed: z.boolean(),
  timeInBedTrying: z.boolean(),
  cancelsAfterPoorSleep: z.enum(['never', '1-2week', '3+week']),
  // Medical history
  diagnosedMedicalConditions: z.array(z.string()),
  // Mental health history
  diagnosedMentalHealthConditions: z.array(z.string()),
  currentlyReceivingTreatment: z.boolean(),
});

// Demographics (collected early after intro) - required fields for linking
export const demographicsSchema = z.object({
  yearOfBirth: z.number().min(1900).max(new Date().getFullYear(), { message: 'Please enter a valid year' }),
  sex: z.enum(['male', 'female', 'transgender', 'other', 'prefer-not-to-say'], { message: 'Please select an option' }),
  zipcode: z.string().min(5, { message: 'Please enter a valid zipcode' }),
  weight: z.number().min(0).nullable(),
  height: z.number().min(0).nullable(),
});

// Sleep Disorder Diagnoses (moved to end section)
export const sleepDisorderDiagnosesSchema = z.object({
  // General diagnoses checklist
  diagnosedDisorders: z.array(z.string()), // Multi-select of diagnosed disorders
  otherDiagnosisDescription: z.string(), // Other write-in field
  // Sleep Apnea (detailed follow-up)
  diagnosedOSA: z.boolean(),
  osaSeverity: z.enum(['mild', 'moderate', 'severe']).nullable(),
  osaTreated: z.boolean(),
  osaTreatmentType: z.array(z.string()), // CPAP, dental device, other
  osaTreatmentEffective: z.boolean().nullable(), // Is treatment effective?
  // RLS (detailed follow-up)
  diagnosedRLS: z.boolean(),
  rlsTreated: z.boolean(),
  rlsTreatment: z.array(z.string()),
  rlsTreatmentEffective: z.boolean().nullable(), // Is treatment effective?
});

// Intro/consent schema
export const introSchema = z.object({
  acceptedDisclaimer: z.boolean().refine(val => val === true, {
    message: 'You must accept the disclaimer to continue',
  }),
});

// Complete questionnaire schema
export const questionnaireSchema = z.object({
  intro: introSchema,
  demographics: demographicsSchema, // Moved after intro
  daytime: daytimeSchema,
  scheduledSleep: scheduledSleepSchema,
  unscheduledSleep: unscheduledSleepSchema,
  breathingDisorders: breathingDisordersSchema,
  restlessLegs: restlessLegsSchema,
  parasomnia: parasomniaSchema,
  nightmares: nightmaresSchema,
  chronotype: chronotypeSchema,
  sleepHygiene: sleepHygieneSchema,
  bedroom: bedroomSchema,
  lifestyle: lifestyleSchema,
  mentalHealth: mentalHealthSchema,
  sleepDisorderDiagnoses: sleepDisorderDiagnosesSchema, // New section at end
});

export type QuestionnaireFormData = z.infer<typeof questionnaireSchema>;
