import { generateFullReport } from '../diagnosis-algorithms';
import {
  diagnosisScenarios,
  defaultReviewScenario,
  getDiagnosisScenario,
} from '../diagnosis-scenarios';
import { getScenarioExpectationResults, getScenarioExpectationSummary } from '../scenario-review';

describe('scenario review helpers', () => {
  it('shows a full match summary when a scenario produces its expected report', () => {
    const scenario = getDiagnosisScenario('healthy-sleeper') ?? defaultReviewScenario;
    const report = generateFullReport(scenario.data);
    const results = getScenarioExpectationResults(scenario, report);
    const summary = getScenarioExpectationSummary(results);

    expect(summary.totalCount).toBe(results.length);
    expect(summary.matchedCount).toBe(results.length);
    expect(summary.mismatchCount).toBe(0);
    expect(results.every(result => result.matches)).toBe(true);
  });

  it('keeps every named review scenario aligned with the live report output', () => {
    for (const scenario of diagnosisScenarios) {
      const report = generateFullReport(scenario.data);
      const results = getScenarioExpectationResults(scenario, report);
      const summary = getScenarioExpectationSummary(results);

      expect(summary.mismatchCount).toBe(0);
    }
  });

  it('surfaces mismatches when the generated report differs from the expected scenario path', () => {
    const expectedScenario = getDiagnosisScenario('healthy-sleeper') ?? defaultReviewScenario;
    const actualReport = generateFullReport(defaultReviewScenario.data);
    const results = getScenarioExpectationResults(expectedScenario, actualReport);
    const mismatches = results.filter(result => !result.matches);

    expect(mismatches.length).toBeGreaterThan(0);
    expect(mismatches.some(result => result.key === 'hasInsomnia')).toBe(true);
  });
});
