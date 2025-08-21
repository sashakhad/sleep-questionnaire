import { z } from 'zod';

export const demographicSchema = z.object({
  birthYear: z.number().min(1920).max(new Date().getFullYear()),
  zipcode: z.string().min(1).max(50),
  sex: z.enum(['male', 'female', 'other', 'prefer-not-to-say'])
});

export const section1Schema = z.object({
  '1.1': z.enum(['yes', 'no']),
  '1.1a': z.number().min(0).max(7).optional(),
  '1.1b': z.enum(['0-20', '21-45', '46-90', '90+']).optional(),
  '1.2': z.array(z.enum(['traffic', 'meetings', 'working', 'talking', 'quiet', 'eating'])).optional(),
  '1.3': z.enum(['yes', 'no']),
  '1.3a': z.number().min(1).max(10).optional(),
  '1.4': z.enum(['everyday', '5+', '3-5', '1-3', '<1']),
  '1.5': z.enum(['yes', 'no']),
  '1.6': z.enum(['yes', 'no']),
  '1.7': z.enum(['yes', 'no']),
  '1.8': z.enum(['yes', 'no'])
});

export const section2Schema = z.object({
  '2.1': z.string(),
  '2.1a': z.string(),
  '2.1b': z.enum(['yes', 'no']),
  '2.1c': z.string(),
  '2.2': z.number().min(0).max(300),
  '2.3': z.number().min(0).max(20),
  '2.3a': z.array(z.enum(['pee', 'pain', 'noise', 'unknown'])).optional(),
  '2.4': z.number().min(0).max(480),
  '2.5': z.string(),
  '2.5a': z.string(),
  '2.6': z.string(),
  '2.6a': z.string(),
  '2.7': z.number().min(0).max(7),
  '2.7a': z.number().min(0).max(300).optional(),
  '2.8': z.enum(['yes', 'no'])
});

export const section3Schema = z.object({
  '3.1': z.enum(['mild', 'moderate', 'severe', 'no']),
  '3.2': z.enum(['yes', 'no']),
  '3.3': z.enum(['yes', 'no'])
});

export const section4Schema = z.object({
  '4.1': z.enum(['yes', 'no']),
  '4.2': z.enum(['yes', 'no']),
  '4.3': z.enum(['yes', 'no']),
  '4.4': z.enum(['yes', 'no'])
});

export const section5Schema = z.object({
  '5.1': z.array(z.enum(['walk', 'dreams', 'wet'])).optional(),
  '5.2': z.enum(['yes', 'no']),
  '5.3': z.enum(['yes', 'no'])
});

export const section6Schema = z.object({
  '6.1': z.enum(['yes', 'no']),
  '6.1a': z.number().min(0).max(7).optional(),
  '6.2': z.enum(['yes', 'no'])
});

export const section7Schema = z.object({
  '7.1': z.enum(['early', 'late', 'flexible']),
  '7.2': z.enum(['yes', 'no']),
  '7.2a': z.string().optional(),
  '7.2b': z.number().min(1).max(7).optional(),
  '7.3': z.enum(['yes', 'no']),
  '7.3a': z.number().min(0).max(50).optional(),
  '7.4': z.enum(['yes', 'no'])
});

export const section8Schema = z.object({
  '8.1': z.enum(['yes', 'no']),
  '8.1a': z.string().optional(),
  '8.2': z.number().min(1).max(10),
  '8.3': z.number().min(0).max(20),
  '8.3a': z.string(),
  '8.4': z.number().min(0).max(50),
  '8.5': z.number().min(0).max(7),
  '8.5a': z.number().min(0).max(300).optional(),
  '8.5b': z.string().optional()
});

export const questionnaireResponseSchema = z.object({
  demographics: demographicSchema,
  section1: section1Schema,
  section2: section2Schema,
  section3: section3Schema,
  section4: section4Schema,
  section5: section5Schema,
  section6: section6Schema,
  section7: section7Schema,
  section8: section8Schema
});

export type QuestionnaireResponse = z.infer<typeof questionnaireResponseSchema>;
export type DemographicData = z.infer<typeof demographicSchema>;
