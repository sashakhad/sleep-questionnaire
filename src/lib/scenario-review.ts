import type { DiagnosisScenario, DiagnosisScenarioExpected } from '@/lib/diagnosis-scenarios';
import type { FullReportResult } from '@/lib/diagnosis-report-types';

type ScenarioExpectationKey = keyof DiagnosisScenarioExpected;

interface ScenarioExpectationDefinition {
  key: ScenarioExpectationKey;
  label: string;
  getActualValue: (report: FullReportResult) => DiagnosisScenarioExpected[ScenarioExpectationKey];
}

export interface ScenarioExpectationResult {
  key: ScenarioExpectationKey;
  label: string;
  expected: string;
  actual: string;
  matches: boolean;
}

export interface ScenarioExpectationSummary {
  matchedCount: number;
  totalCount: number;
  mismatchCount: number;
}

const scenarioExpectationDefinitions: ScenarioExpectationDefinition[] = [
  {
    key: 'hasInsomnia',
    label: 'Insomnia disorder',
    getActualValue(report) {
      return report.hasInsomnia;
    },
  },
  {
    key: 'insomniaSeverity',
    label: 'Insomnia severity',
    getActualValue(report) {
      return report.insomniaSeverity;
    },
  },
  {
    key: 'hasOSA',
    label: 'Probable sleep apnea',
    getActualValue(report) {
      return report.hasOSA;
    },
  },
  {
    key: 'hasCOMISA',
    label: 'COMISA',
    getActualValue(report) {
      return report.hasCOMISA;
    },
  },
  {
    key: 'hasRLS',
    label: 'Restless legs syndrome',
    getActualValue(report) {
      return report.hasRLS;
    },
  },
  {
    key: 'hasNightmares',
    label: 'Nightmare disorder',
    getActualValue(report) {
      return report.hasNightmares;
    },
  },
  {
    key: 'hasNarcolepsy',
    label: 'Narcolepsy screen',
    getActualValue(report) {
      return report.hasNarcolepsy;
    },
  },
  {
    key: 'hasEDS',
    label: 'Excessive daytime sleepiness',
    getActualValue(report) {
      return report.hasEDS;
    },
  },
  {
    key: 'hasEDSFromNaps',
    label: 'EDS from naps',
    getActualValue(report) {
      return report.hasEDSFromNaps;
    },
  },
  {
    key: 'hasInsufficientSleep',
    label: 'Insufficient sleep syndrome',
    getActualValue(report) {
      return report.hasInsufficientSleep;
    },
  },
  {
    key: 'hasChronicFatigueSymptoms',
    label: 'Chronic fatigue symptoms',
    getActualValue(report) {
      return report.hasChronicFatigueSymptoms;
    },
  },
  {
    key: 'hasPainRelatedSleepDisturbance',
    label: 'Pain-related sleep disturbance',
    getActualValue(report) {
      return report.hasPainRelatedSleepDisturbance;
    },
  },
  {
    key: 'hasMildRespiratoryDisturbance',
    label: 'Mild respiratory disturbance',
    getActualValue(report) {
      return report.hasMildRespiratoryDisturbance;
    },
  },
];

function formatExpectationValue(value: boolean | string): string {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  switch (value) {
    case 'moderate-to-severe':
      return 'Moderate to severe';
    case 'mild':
      return 'Mild';
    case 'none':
      return 'None';
    default:
      return value;
  }
}

export function getScenarioExpectationResults(
  scenario: DiagnosisScenario,
  report: FullReportResult
): ScenarioExpectationResult[] {
  const results: ScenarioExpectationResult[] = [];

  for (const definition of scenarioExpectationDefinitions) {
    const expectedValue = scenario.expected[definition.key];
    const actualValue = definition.getActualValue(report);

    results.push({
      key: definition.key,
      label: definition.label,
      expected: formatExpectationValue(expectedValue),
      actual: formatExpectationValue(actualValue),
      matches: expectedValue === actualValue,
    });
  }

  return results;
}

export function getScenarioExpectationSummary(
  results: ScenarioExpectationResult[]
): ScenarioExpectationSummary {
  let matchedCount = 0;

  for (const result of results) {
    if (result.matches) {
      matchedCount += 1;
    }
  }

  return {
    matchedCount,
    totalCount: results.length,
    mismatchCount: results.length - matchedCount,
  };
}
