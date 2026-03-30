import type { DiagnosisScenario } from '@/lib/diagnosis-scenarios';
import type { DiagnosticBreakdown } from '@/lib/diagnosis-report-types';

type ReviewScenarioGroupId =
  | 'baseline'
  | 'insomnia'
  | 'breathing'
  | 'daytime-sleepiness'
  | 'movement-nightmares'
  | 'fatigue-pain'
  | 'combined-pathways';

interface ReviewScenarioGroupDefinition {
  id: ReviewScenarioGroupId;
  label: string;
  description: string;
}

export interface ReviewScenarioGroup extends ReviewScenarioGroupDefinition {
  scenarios: DiagnosisScenario[];
}

export interface ReviewReferenceSection {
  diagnosisId: string;
  sectionTitle: string;
  anchorId: string;
  documentPath: string;
  ruleSummary: string;
  ruleBullets: string[];
  clarification?: string;
}

const reviewScenarioGroupDefinitions: ReviewScenarioGroupDefinition[] = [
  {
    id: 'baseline',
    label: 'Baseline and controls',
    description: 'Healthy or neutral scenarios that keep the review grounded.',
  },
  {
    id: 'insomnia',
    label: 'Insomnia pathways',
    description: 'Cases centered on nighttime disruption and daytime impairment.',
  },
  {
    id: 'breathing',
    label: 'Breathing pathways',
    description: 'Snoring, respiratory disturbance, and apnea-oriented examples.',
  },
  {
    id: 'combined-pathways',
    label: 'Combined pathways',
    description: 'Scenarios where multiple major diagnoses interact.',
  },
  {
    id: 'daytime-sleepiness',
    label: 'Daytime sleepiness pathways',
    description: 'EDS, insufficient sleep, and narcolepsy-oriented review cases.',
  },
  {
    id: 'movement-nightmares',
    label: 'Movement and nightmares',
    description: 'Cases focused on RLS and nightmare-driven sleep disruption.',
  },
  {
    id: 'fatigue-pain',
    label: 'Fatigue and pain pathways',
    description: 'Chronic-fatigue and pain-related symptom clusters.',
  },
];

const reviewReferenceSectionsByDiagnosisId: Record<string, ReviewReferenceSection> = {
  eds: {
    diagnosisId: 'eds',
    sectionTitle: 'Excessive Daytime Sleepiness (EDS)',
    anchorId: 'reference-eds',
    documentPath: 'docs/ALGORITHM_REFERENCE.md',
    ruleSummary:
      'The live viewer supports a planned-naps path and an activity-based EDS path gated by weekly sleep duration.',
    ruleBullets: [
      'Planned naps count when they occur at least 3 days per week and last at least 30 minutes.',
      'Activity-based EDS uses daytime difficulty staying awake plus a dozing score in the 2-7 range.',
      'If weekly average sleep is above 7 hours, the activity-based signal stays on the EDS path.',
      'If weekly average sleep is below 7 hours, the same signal routes to insufficient sleep instead.',
    ],
    clarification:
      'The written reference still notes unresolved ambiguity around stop-light weighting, the exact meaning of "difficulty staying awake," the 7.0-hour boundary, and whether planned naps remain a parallel path.',
  },
  'insufficient-sleep': {
    diagnosisId: 'insufficient-sleep',
    sectionTitle: 'Insufficient Sleep Syndrome',
    anchorId: 'reference-insufficient-sleep',
    documentPath: 'docs/ALGORITHM_REFERENCE.md',
    ruleSummary:
      'Insufficient sleep requires sleepiness plus weekly average sleep below 7 hours, with narcolepsy and sleep apnea excluded.',
    ruleBullets: [
      'A daytime sleepiness signal must be present.',
      'Weekly average sleep must be below 7 hours.',
      'Narcolepsy symptoms must not be present.',
      'Probable sleep apnea must not be present.',
    ],
    clarification:
      'The reference preserves Chris’s maintenance-insomnia example as an important caveat rather than a fully generalized precedence rule.',
  },
  insomnia: {
    diagnosisId: 'insomnia',
    sectionTitle: 'Insomnia',
    anchorId: 'reference-insomnia',
    documentPath: 'docs/ALGORITHM_REFERENCE.md',
    ruleSummary:
      'Insomnia needs at least one nighttime criterion plus daytime impairment, with mild and moderate-to-severe bands split by symptom burden.',
    ruleBullets: [
      'Mild insomnia uses SOL 30-45 minutes, WASO 40-60 minutes, or poor sleep quality, plus at least 1 daytime criterion.',
      'Moderate-to-severe insomnia uses SOL above 45 minutes, WASO above 60 minutes, or poor sleep quality, plus at least 2 daytime criteria.',
      'Daytime criteria include sleepiness interference, non-restorative sleep, tiredness, and fatigue thresholds.',
    ],
    clarification:
      'The written reference explicitly keeps the maintenance-insomnia example visible so adequate sleep opportunity with prolonged WASO does not get treated like a short-sleep case by default.',
  },
  'sleep-apnea': {
    diagnosisId: 'sleep-apnea',
    sectionTitle: 'Sleep-Disordered Breathing / Obstructive Sleep Apnea',
    anchorId: 'reference-sleep-apnea',
    documentPath: 'docs/ALGORITHM_REFERENCE.md',
    ruleSummary:
      'Breathing pauses flag probable apnea directly, while snoring plus risk factors escalates from mild to moderate-to-severe and otherwise falls back to mild respiratory disturbance.',
    ruleBullets: [
      'Snoring or mouth breathing alone can still produce mild respiratory disturbance when probable apnea is not met.',
      'Any breathing pauses, gasping, or struggling to breathe flag probable apnea directly.',
      'Snoring plus age, BMI, daytime tiredness/fatigue, or non-restorative sleep contributes to the apnea risk-factor path.',
      'Snoring plus 1 risk factor is mild; snoring plus 3 or more risk factors is moderate-to-severe.',
    ],
  },
  comisa: {
    diagnosisId: 'comisa',
    sectionTitle: 'COMISA',
    anchorId: 'reference-comisa',
    documentPath: 'docs/ALGORITHM_REFERENCE.md',
    ruleSummary:
      'COMISA is the combined pathway: insomnia criteria plus sleep-disordered breathing criteria.',
    ruleBullets: [
      'Insomnia must be present.',
      'Sleep apnea or sleep-disordered breathing must be present.',
    ],
  },
  rls: {
    diagnosisId: 'rls',
    sectionTitle: 'Restless Legs Syndrome (RLS)',
    anchorId: 'reference-rls',
    documentPath: 'docs/ALGORITHM_REFERENCE.md',
    ruleSummary: 'The live viewer keeps the classic triad at the center of the RLS screen.',
    ruleBullets: [
      'Trouble lying still when trying to sleep.',
      'Urge to move the legs.',
      'Movement relieves the discomfort.',
    ],
    clarification:
      'The reference notes later correspondence that broadened symptom wording, but it does not clearly replace the triad as the core disorder screen.',
  },
  narcolepsy: {
    diagnosisId: 'narcolepsy',
    sectionTitle: 'Narcolepsy / Hypersomnia Screen',
    anchorId: 'reference-narcolepsy',
    documentPath: 'docs/ALGORITHM_REFERENCE.md',
    ruleSummary:
      'The current screen relies on prior diagnosis or cataplexy-type symptoms with sleep paralysis as a supportive signal.',
    ruleBullets: [
      'A prior diagnosis of narcolepsy or hypersomnia is sufficient.',
      'Cataplexy-type weakness with emotion plus sleep paralysis is treated as a supported screening path.',
      'Later review comments also mention a dozing score above 6 as a warning-level signal.',
    ],
    clarification:
      'The written reference says the correspondence never fully reconciled the final narcolepsy / hypersomnia decision tree after later questionnaire cuts.',
  },
  nightmares: {
    diagnosisId: 'nightmares',
    sectionTitle: 'Nightmares / Bad Dreams',
    anchorId: 'reference-nightmares',
    documentPath: 'docs/ALGORITHM_REFERENCE.md',
    ruleSummary:
      'Nightmare disorder is triggered at 2 or more nights per week, while the older bad-dream warning remains a documented carry-forward interpretation.',
    ruleBullets: [
      'Nightmare disorder uses 2 or more nights per week.',
      'A separate bad-dream warning at 3 or more nights per week comes from the round 2 trail.',
      'Round 3 simplified the questionnaire back to nightmares per week and explicitly lowered the disorder threshold to 2+.',
    ],
    clarification:
      'The written reference still marks the bad-dream pathway as something to confirm with the client because later materials simplified the questionnaire.',
  },
  'chronic-fatigue': {
    diagnosisId: 'chronic-fatigue',
    sectionTitle: 'Chronic Fatigue / Fibromyalgia / Post-Viral Symptoms',
    anchorId: 'reference-chronic-fatigue',
    documentPath: 'docs/ALGORITHM_REFERENCE.md',
    ruleSummary:
      'The chronic-fatigue screen triggers from insomnia alone or from 3 or more qualifying daytime symptoms when insomnia is absent.',
    ruleBullets: [
      'Insomnia symptoms alone are sufficient.',
      'Without insomnia, the viewer counts sleepiness interference, non-restorative sleep, tiredness, fatigue, and aches/pains.',
      'Three or more of those symptoms trigger the screen.',
    ],
    clarification:
      'The written reference preserves the source wording "fatigue rating >7" as an explicit confirmation item rather than widening it to 7+ without sign-off.',
  },
  'pain-related': {
    diagnosisId: 'pain-related',
    sectionTitle: 'Pain-Related Sleep Disturbance',
    anchorId: 'reference-pain-related',
    documentPath: 'docs/ALGORITHM_REFERENCE.md',
    ruleSummary:
      'The current implementation reads the pain-related pathway as pain being present plus at least 1 additional qualifying symptom.',
    ruleBullets: [
      'Pain or joint/muscle pain is treated as required in the current implementation.',
      'Additional qualifying symptoms come from sleepiness interference, non-restorative sleep, tiredness, or fatigue.',
      'At least 2 combined signals are needed to flag the pathway.',
    ],
    clarification:
      'The written reference keeps this as a live ambiguity because the source text says "at least two of the following" without explicitly making pain mandatory.',
  },
  'leg-cramps': {
    diagnosisId: 'leg-cramps',
    sectionTitle: 'Nocturnal Leg Cramps',
    anchorId: 'reference-leg-cramps',
    documentPath: 'docs/ALGORITHM_REFERENCE.md',
    ruleSummary: 'Nocturnal leg cramps are surfaced when they occur on 2 or more nights per week.',
    ruleBullets: [
      'Leg cramps must be present.',
      'Frequency of 2 or more nights per week triggers the concern.',
    ],
  },
};

const reviewDiagnosisPriority: Record<string, number> = {
  insomnia: 1,
  'sleep-apnea': 2,
  comisa: 3,
  eds: 4,
  'insufficient-sleep': 5,
  rls: 6,
  narcolepsy: 7,
  nightmares: 8,
  'chronic-fatigue': 9,
  'pain-related': 10,
  'leg-cramps': 11,
};

export function getScenarioHighlights(scenario: DiagnosisScenario): string[] {
  const highlights: string[] = [];

  if (scenario.expected.hasCOMISA) {
    highlights.push('COMISA');
  }
  if (scenario.expected.hasInsomnia) {
    highlights.push(`Insomnia: ${scenario.expected.insomniaSeverity}`);
  }
  if (scenario.expected.hasOSA) {
    highlights.push('Probable OSA');
  }
  if (scenario.expected.hasMildRespiratoryDisturbance) {
    highlights.push('Mild respiratory');
  }
  if (scenario.expected.hasNarcolepsy) {
    highlights.push('Narcolepsy screen');
  }
  if (scenario.expected.hasEDS) {
    highlights.push(scenario.expected.hasEDSFromNaps ? 'EDS via naps' : 'EDS');
  }
  if (scenario.expected.hasInsufficientSleep) {
    highlights.push('Insufficient sleep');
  }
  if (scenario.expected.hasRLS) {
    highlights.push('RLS');
  }
  if (scenario.expected.hasNightmares) {
    highlights.push('Nightmares');
  }
  if (scenario.expected.hasChronicFatigueSymptoms) {
    highlights.push('Chronic fatigue');
  }
  if (scenario.expected.hasPainRelatedSleepDisturbance) {
    highlights.push('Pain-related sleep');
  }

  if (highlights.length === 0) {
    highlights.push('No major report flags expected');
  }

  return highlights.slice(0, 3);
}

export function getReviewScenarioGroup(scenario: DiagnosisScenario): ReviewScenarioGroupDefinition {
  if (scenario.expected.hasCOMISA) {
    return reviewScenarioGroupDefinitions[3]!;
  }

  if (scenario.expected.hasOSA || scenario.expected.hasMildRespiratoryDisturbance) {
    return reviewScenarioGroupDefinitions[2]!;
  }

  if (scenario.expected.hasInsomnia) {
    return reviewScenarioGroupDefinitions[1]!;
  }

  if (
    scenario.expected.hasNarcolepsy ||
    scenario.expected.hasEDS ||
    scenario.expected.hasEDSFromNaps ||
    scenario.expected.hasInsufficientSleep
  ) {
    return reviewScenarioGroupDefinitions[4]!;
  }

  if (scenario.expected.hasRLS || scenario.expected.hasNightmares) {
    return reviewScenarioGroupDefinitions[5]!;
  }

  if (
    scenario.expected.hasChronicFatigueSymptoms ||
    scenario.expected.hasPainRelatedSleepDisturbance
  ) {
    return reviewScenarioGroupDefinitions[6]!;
  }

  return reviewScenarioGroupDefinitions[0]!;
}

export function groupDiagnosisScenarios(scenarios: DiagnosisScenario[]): ReviewScenarioGroup[] {
  const groupedScenarios = new Map<ReviewScenarioGroupId, DiagnosisScenario[]>();

  for (const definition of reviewScenarioGroupDefinitions) {
    groupedScenarios.set(definition.id, []);
  }

  for (const scenario of scenarios) {
    const group = getReviewScenarioGroup(scenario);
    const scenariosInGroup = groupedScenarios.get(group.id);

    if (!scenariosInGroup) {
      continue;
    }

    scenariosInGroup.push(scenario);
  }

  const results: ReviewScenarioGroup[] = [];

  for (const definition of reviewScenarioGroupDefinitions) {
    const scenariosInGroup = groupedScenarios.get(definition.id) ?? [];

    if (scenariosInGroup.length === 0) {
      continue;
    }

    results.push({
      ...definition,
      scenarios: scenariosInGroup,
    });
  }

  return results;
}

export function getReviewReferenceSection(diagnosisId: string): ReviewReferenceSection {
  return (
    reviewReferenceSectionsByDiagnosisId[diagnosisId] ?? {
      diagnosisId,
      sectionTitle: 'Algorithm reference section',
      anchorId: `reference-${diagnosisId}`,
      documentPath: 'docs/ALGORITHM_REFERENCE.md',
      ruleSummary: 'See the written algorithm reference for the latest wording of this pathway.',
      ruleBullets: ['This pathway is rendered from the live algorithm breakdown.'],
    }
  );
}

export function isReviewDiagnosisActive(diagnosis: DiagnosticBreakdown): boolean {
  return !diagnosis.outcome.startsWith('Not ');
}

export function sortReviewDiagnoses(diagnoses: DiagnosticBreakdown[]): DiagnosticBreakdown[] {
  return [...diagnoses].sort((leftDiagnosis, rightDiagnosis) => {
    const leftIsActive = isReviewDiagnosisActive(leftDiagnosis);
    const rightIsActive = isReviewDiagnosisActive(rightDiagnosis);

    if (leftIsActive !== rightIsActive) {
      return leftIsActive ? -1 : 1;
    }

    const leftPriority = reviewDiagnosisPriority[leftDiagnosis.id] ?? Number.MAX_SAFE_INTEGER;
    const rightPriority = reviewDiagnosisPriority[rightDiagnosis.id] ?? Number.MAX_SAFE_INTEGER;

    return leftPriority - rightPriority;
  });
}
