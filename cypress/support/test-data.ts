export const SECTIONS = [
  'intro',
  'demographics',
  'sleep-disorder-diagnoses',
  'daytime',
  'scheduled-sleep',
  'unscheduled-sleep',
  'breathing-disorders',
  'restless-legs',
  'parasomnia',
  'nightmares',
  'chronotype',
  'sleep-hygiene',
  'bedroom',
  'lifestyle',
  'mental-health',
  'report',
] as const;

export type SectionSlug = (typeof SECTIONS)[number];

export const SECTION_TITLES: Record<SectionSlug, string> = {
  intro: 'Welcome',
  demographics: 'About You',
  'sleep-disorder-diagnoses': 'Sleep Disorder History',
  daytime: 'Daytime Functioning',
  'scheduled-sleep': 'Sleep on Work/School Nights',
  'unscheduled-sleep': 'Sleep on Weekends/Free Days',
  'breathing-disorders': 'Sleep Breathing',
  'restless-legs': 'Restless Legs',
  parasomnia: 'Sleep Behaviors',
  nightmares: 'Nightmares',
  chronotype: 'Sleep Preferences',
  'sleep-hygiene': 'Sleep Medications & Supplements',
  bedroom: 'Bedroom Environment',
  lifestyle: 'Lifestyle Factors',
  'mental-health': 'Mental Health & Sleep',
  report: 'Your Sleep Report',
};

export const SELECTORS = {
  form: 'form',
  continueButton: 'button:contains("Continue")',
  previousButton: 'button:contains("Previous")',
  generateReportButton: 'button:contains("Generate Report")',
  progressBar: '[role="progressbar"]',
  stepIndicator: 'p:contains("Step")',
  sectionTitle: '[data-slot="card-title"]',
  devSidebarNav: 'nav',
} as const;

export const TOTAL_SECTIONS = 16;
