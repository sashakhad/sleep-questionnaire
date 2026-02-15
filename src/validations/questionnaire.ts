import { z } from 'zod';

// Time string validation - accepts HH:MM format or empty string
const timeString = z
  .string()
  .refine(val => val === '' || /^\d{1,2}:\d{2}$/.test(val), {
    message: 'Time must be in HH:MM format',
  });

// Sleep Disorder History schema
export const sleepDisorderHistorySchema = z.object({
  previousDiagnoses: z.array(z.string()),
  otherDiagnosis: z.string().max(25),
});

// Daytime Energy and Alertness schema
export const daytimeSchema = z.object({
  plannedNaps: z.object({
    daysPerWeek: z.number().min(0).max(7),
    duration: z.enum(['0-10', '15-30', '30-90', '>90']).nullable(),
  }),
  fallAsleepDuring: z.array(z.string()),
  // Sleepiness (heavy eyes, urge to fall asleep) — 1-10 scale: 1=never, 10=often
  sleepinessRating: z.number().min(1).max(10).nullable(),
  // Sleepiness interference with daily activities — 1-10 scale
  sleepinessInterference: z.number().min(1).max(10).nullable(),
  // Fatigue/tiredness (physical/mental exhaustion) — 1-10 scale: 1=never, 10=often
  fatigueRating: z.number().min(1).max(10).nullable(),
  // Fatigue/tiredness interference with daily activities — 1-10 scale
  fatigueInterference: z.number().min(1).max(10).nullable(),
  dreamsWhileFallingAsleep: z.boolean(),
  weaknessWhenExcited: z.array(z.string()),
  sleepParalysis: z.boolean(),
  sleepParalysisFrequency: z.number().min(0).nullable(), // times in last month
  diagnosedNarcolepsy: z.boolean(),
  // Pain and chronic fatigue screening
  painAffectsSleep: z.boolean(),
  painSeverity: z.number().min(1).max(10).nullable(),
  muscleJointPain: z.boolean(),
  nonRestorativeSleep: z.boolean(),
});

// Sleep pattern schema (reusable for scheduled and unscheduled)
const sleepPatternSchema = z.object({
  bedtime: timeString, // Time getting into bed (distinct from lights out)
  lightsOutTime: timeString,
  minutesToFallAsleep: z.number().min(0),
  nightWakeups: z.number().min(0),
  wakeupReasons: z.array(z.string()),
  minutesAwakeAtNight: z.number().min(0),
  wakeupTime: timeString,
  getOutOfBedTime: timeString,
  earlyWakeupDays: z.number().min(0).max(7),
  earlyWakeupMinutes: z.number().min(0).nullable(),
  usesAlarm: z.boolean(),
  plannedNapsPerWeek: z.number().min(0).max(7),
  averageNapMinutes: z.number().min(0).nullable(),
});

// Scheduled sleep with extra field
export const scheduledSleepSchema = sleepPatternSchema.extend({
  lightsOutVaries: z.boolean(),
});

// Unscheduled sleep
export const unscheduledSleepSchema = sleepPatternSchema;

// Breathing disorders
export const breathingDisordersSchema = z.object({
  diagnosed: z.boolean(),
  severity: z.enum(['mild', 'moderate', 'severe']).nullable(),
  treatment: z.array(z.string()),
  snores: z.boolean(),
  stopsBreathing: z.boolean(),
  wakesWithDryMouth: z.boolean(), // standalone (was conditional on mouthBreathes)
  mouthBreathesDay: z.boolean(), // daytime mouth breathing (nasal congestion)
  morningHeadache: z.boolean(),
  airwayCrowding: z.array(z.string()), // wisdom teeth, orthodontics, tonsillectomy
});

// Restless legs — condensed from 3 questions to 2 + conditional follow-ups
export const restlessLegsSchema = z.object({
  diagnosed: z.boolean(),
  treatment: z.array(z.string()),
  hardToLieStill: z.boolean(), // condensed: trouble lying still / urge to move
  movementRelieves: z.boolean(),
  // Conditional follow-ups (shown when both hardToLieStill AND movementRelieves are true)
  rlsFrequency: z.string().nullable(), // how often per week
  rlsSeverity: z.number().min(1).max(10).nullable(),
  rlsOnsetTime: z.string().nullable(), // when symptoms begin
  daytimeDiscomfort: z.boolean(),
});

// Parasomnia — simplified (diagnosis questions moved to Sleep Disorder History)
export const parasomniaSchema = z.object({
  nightBehaviors: z.array(z.string()),
  remembersEvents: z.boolean(),
  actsOutDreams: z.boolean(),
  bedwetting: z.boolean(),
});

// Nightmares
export const nightmaresSchema = z.object({
  hasNightmares: z.boolean(),
  nightmaresPerWeek: z.number().min(0).max(7).nullable(),
  associatedWithTrauma: z.boolean(),
});

// Chronotype — added social jet lag, revised jet lag, renamed work time
export const chronotypeSchema = z.object({
  preference: z.enum(['early', 'late', 'neutral']), // 'flexible' → 'neutral'
  socialJetLag: z.boolean(),
  shiftWork: z.boolean(),
  shiftType: z.string(),
  shiftDaysPerWeek: z.number().min(0).max(7).nullable(),
  pastShiftWorkYears: z.number().min(0).nullable(),
  timeZoneTravelPerYear: z.number().min(0).nullable(), // was boolean frequentTimeZoneTravel
  troubleAdjustingAfterTravel: z.boolean(),
  earliestWorkSchoolTime: timeString, // renamed from workSchoolTime
});

// Sleep hygiene — nicotine moved to lifestyle
export const sleepHygieneSchema = z.object({
  supplements: z.array(z.string()),
  prescriptionMeds: z.array(z.string()),
  sleepAffectingMeds: z.array(z.string()), // SSRIs, steroids, etc. that affect sleep
  stimulants: z.string(),
  stimulantTime: timeString,
});

// Bedroom environment — added temperature and safety
export const bedroomSchema = z.object({
  relaxing: z.number().min(1).max(10),
  comfortable: z.number().min(1).max(10),
  dark: z.number().min(1).max(10),
  quiet: z.number().min(1).max(10),
  temperature: z.number().min(1).max(10),
  safety: z.number().min(1).max(10),
});

// Lifestyle — added nicotine, meal timing, alcohol timing, snacking
export const lifestyleSchema = z.object({
  caffeinePerDay: z.number().min(0),
  lastCaffeineTime: timeString,
  alcoholPerWeek: z.object({
    wine: z.number().min(0),
    cocktails: z.number().min(0),
  }),
  lastAlcoholTime: timeString,
  exerciseDaysPerWeek: z.number().min(0).max(7),
  exerciseDuration: z.number().min(0).nullable(),
  exerciseEndTime: timeString,
  smokesNicotine: z.boolean(), // moved from sleepHygiene
  lastMealTime: timeString,
  snacksBeforeBed: z.boolean(),
});

// Mental health
export const mentalHealthSchema = z.object({
  worriesAffectSleep: z.boolean(),
  anxietyInBed: z.boolean(),
  timeInBedTrying: z.boolean(),
  cancelsAfterPoorSleep: z.enum(['never', '1-2week', '3+week']),
  diagnosedMedicalConditions: z.array(z.string()),
  diagnosedMentalHealthConditions: z.array(z.string()),
  currentlyReceivingTreatment: z.boolean(),
});

// Demographics
export const demographicsSchema = z.object({
  yearOfBirth: z.number().min(1900).max(new Date().getFullYear()).nullable(),
  sex: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).nullable(),
  zipcode: z.string(),
  weight: z.number().min(0).nullable(),
  height: z.number().min(0).nullable(),
});

// Complete questionnaire schema
export const questionnaireSchema = z.object({
  sleepDisorderHistory: sleepDisorderHistorySchema,
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
  demographics: demographicsSchema,
});

export type QuestionnaireFormData = z.infer<typeof questionnaireSchema>;
