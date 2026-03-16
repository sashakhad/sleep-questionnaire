import type { DiagnosticBreakdown } from '../diagnosis-report-types';
import { diagnosisScenarios, getDiagnosisScenario } from '../diagnosis-scenarios';
import {
  getReviewReferenceSection,
  getReviewScenarioGroup,
  groupDiagnosisScenarios,
  sortReviewDiagnoses,
} from '../review-mode';

describe('review mode helpers', () => {
  it('groups client scenarios into review-friendly buckets', () => {
    const groups = groupDiagnosisScenarios(diagnosisScenarios);
    const movementGroup = groups.find(group => group.id === 'movement-nightmares');
    const fatigueGroup = groups.find(group => group.id === 'fatigue-pain');

    expect(movementGroup?.scenarios.some(scenario => scenario.id === 'restless-legs-classic')).toBe(
      true
    );
    expect(
      fatigueGroup?.scenarios.some(scenario => scenario.id === 'pain-related-sleep-disturbance')
    ).toBe(true);
  });

  it('returns the combined-pathways group for COMISA scenarios', () => {
    const comisaScenario = getDiagnosisScenario('comisa');

    expect(comisaScenario).toBeDefined();
    expect(getReviewScenarioGroup(comisaScenario!).id).toBe('combined-pathways');
  });

  it('keeps active diagnoses ahead of inactive ones in the algorithm viewer', () => {
    const diagnoses: DiagnosticBreakdown[] = [
      {
        id: 'insomnia',
        label: 'Insomnia',
        outcome: 'Not flagged',
        criteria: [],
      },
      {
        id: 'sleep-apnea',
        label: 'Sleep apnea / sleep-disordered breathing',
        outcome: 'Flagged (moderate-to-severe)',
        criteria: [],
      },
      {
        id: 'chronic-fatigue',
        label: 'Chronic fatigue / fibromyalgia screen',
        outcome: 'Flagged',
        criteria: [],
      },
    ];

    const sortedDiagnoses = sortReviewDiagnoses(diagnoses);

    expect(sortedDiagnoses[0]?.id).toBe('sleep-apnea');
    expect(sortedDiagnoses[1]?.id).toBe('chronic-fatigue');
    expect(sortedDiagnoses[2]?.id).toBe('insomnia');
  });

  it('returns written-reference metadata for supported diagnosis cards', () => {
    const reference = getReviewReferenceSection('pain-related');

    expect(reference.documentPath).toBe('docs/ALGORITHM_REFERENCE.md');
    expect(reference.sectionTitle).toBe('Pain-Related Sleep Disturbance');
    expect(reference.anchorId).toBe('reference-pain-related');
  });
});
