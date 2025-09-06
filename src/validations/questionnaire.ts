import { z } from 'zod'

// Section 1: Daytime feelings schema
export const daytimeSchema = z.object({
  plannedNaps: z.object({
    daysPerWeek: z.number().min(0).max(7),
    duration: z.enum(['0-10', '15-30', '30-90', '>90']).nullable()
  }),
  fallAsleepDuring: z.array(z.string()),
  tirednessInterferes: z.boolean(),
  tiredButCantSleep: z.enum(['everyday', '5+days', '3-5days', '1-3days', '<1day']).nullable(),
  dreamsWhileFallingAsleep: z.boolean(),
  weaknessWhenExcited: z.array(z.string()),
  sleepParalysis: z.boolean(),
  diagnosedNarcolepsy: z.boolean()
})

// Sleep pattern schema (reusable for scheduled and unscheduled)
const sleepPatternSchema = z.object({
  lightsOutTime: z.string(),
  minutesToFallAsleep: z.number().min(0),
  nightWakeups: z.number().min(0),
  wakeupReasons: z.array(z.string()),
  minutesAwakeAtNight: z.number().min(0),
  wakeupTime: z.string(),
  getOutOfBedTime: z.string(),
  earlyWakeupDays: z.number().min(0).max(7),
  earlyWakeupMinutes: z.number().min(0).nullable(),
  usesAlarm: z.boolean(),
  plannedNapsPerWeek: z.number().min(0).max(7),
  averageNapMinutes: z.number().min(0).nullable()
})

// Section 2a: Scheduled sleep with extra field
export const scheduledSleepSchema = sleepPatternSchema.extend({
  lightsOutVaries: z.boolean()
})

// Section 2b: Unscheduled sleep
export const unscheduledSleepSchema = sleepPatternSchema

// Section 3: Breathing disorders
export const breathingDisordersSchema = z.object({
  diagnosed: z.boolean(),
  severity: z.enum(['mild', 'moderate', 'severe']).nullable(),
  treatment: z.array(z.string()),
  snores: z.boolean(),
  stopsBreathing: z.boolean(),
  mouthBreathes: z.boolean(),
  wakesWithDryMouth: z.boolean()
})

// Section 4: Restless legs
export const restlessLegsSchema = z.object({
  diagnosed: z.boolean(),
  treatment: z.array(z.string()),
  troubleLyingStill: z.boolean(),
  urgeToMoveLegs: z.boolean(),
  movementRelieves: z.boolean(),
  daytimeDiscomfort: z.boolean()
})

// Section 5: Parasomnia
export const parasomniaSchema = z.object({
  nightBehaviors: z.array(z.string()),
  remembersEvents: z.boolean(),
  actsOutDreams: z.boolean(),
  bedwetting: z.boolean(),
  diagnosedParasomnia: z.boolean(),
  parasomniaType: z.string(),
  receivedTreatment: z.boolean(),
  treatmentType: z.string()
})

// Section 6: Nightmares
export const nightmaresSchema = z.object({
  hasNightmares: z.boolean(),
  nightmaresPerWeek: z.number().min(0).max(7).nullable(),
  associatedWithTrauma: z.boolean()
})

// Section 7: Chronotype
export const chronotypeSchema = z.object({
  preference: z.enum(['early', 'late', 'flexible']),
  shiftWork: z.boolean(),
  shiftType: z.string(),
  shiftDaysPerWeek: z.number().min(0).max(7).nullable(),
  pastShiftWorkYears: z.number().min(0).nullable(),
  frequentTimeZoneTravel: z.boolean(),
  workSchoolTime: z.string()
})

// Section 8: Sleep hygiene
export const sleepHygieneSchema = z.object({
  supplements: z.array(z.string()),
  prescriptionMeds: z.array(z.string()),
  stimulants: z.string(),
  stimulantTime: z.string(),
  smokesNicotine: z.boolean()
})

// Section 9: Bedroom environment
export const bedroomSchema = z.object({
  relaxing: z.number().min(1).max(10),
  comfortable: z.number().min(1).max(10),
  dark: z.number().min(1).max(10),
  quiet: z.number().min(1).max(10)
})

// Section 10-12: Lifestyle
export const lifestyleSchema = z.object({
  caffeinePerDay: z.number().min(0),
  lastCaffeineTime: z.string(),
  alcoholPerWeek: z.object({
    wine: z.number().min(0),
    cocktails: z.number().min(0)
  }),
  exerciseDaysPerWeek: z.number().min(0).max(7),
  exerciseDuration: z.number().min(0).nullable(),
  exerciseEndTime: z.string()
})

// Section 13-15: Mental health
export const mentalHealthSchema = z.object({
  worriesAffectSleep: z.boolean(),
  anxietyInBed: z.boolean(),
  timeInBedTrying: z.boolean(),
  cancelsAfterPoorSleep: z.enum(['never', '1-2week', '3+week'])
})

// Demographics
export const demographicsSchema = z.object({
  weight: z.number().min(0).nullable(),
  height: z.number().min(0).nullable(),
  age: z.number().min(0).max(120).nullable(),
  zipcode: z.string()
})

// Complete questionnaire schema
export const questionnaireSchema = z.object({
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
  demographics: demographicsSchema
})

export type QuestionnaireFormData = z.infer<typeof questionnaireSchema>
