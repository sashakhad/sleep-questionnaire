'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { DiagnosisScenario } from '@/lib/diagnosis-scenarios';
import type {
  DiagnosticBreakdown,
  FullReportResult,
  ScoringMetric,
} from '@/lib/diagnosis-report-types';
import type { ScenarioExpectationResult, ScenarioExpectationSummary } from '@/lib/scenario-review';
import {
  getReviewReferenceSection,
  getScenarioHighlights,
  isReviewDiagnosisActive,
  sortReviewDiagnoses,
} from '@/lib/review-mode';
import {
  Activity,
  BookOpenText,
  CheckCircle2,
  ClipboardCheck,
  FlaskConical,
  GitCompareArrows,
} from 'lucide-react';

interface ReviewModePanelProps {
  report: FullReportResult;
  reviewScenario: DiagnosisScenario;
  expectationResults: ScenarioExpectationResult[];
  expectationSummary: ScenarioExpectationSummary;
}

function sortExpectationResults(
  expectationResults: ScenarioExpectationResult[]
): ScenarioExpectationResult[] {
  return [...expectationResults].sort((leftResult, rightResult) => {
    if (leftResult.matches === rightResult.matches) {
      return leftResult.label.localeCompare(rightResult.label);
    }

    return leftResult.matches ? 1 : -1;
  });
}

function getReviewOutcomeClasses(diagnosis: DiagnosticBreakdown): string {
  if (!isReviewDiagnosisActive(diagnosis)) {
    return 'border-border/70 bg-muted/40 text-muted-foreground';
  }

  if (
    diagnosis.outcome.toLowerCase().includes('mild') ||
    diagnosis.outcome.toLowerCase().includes('warning')
  ) {
    return 'border-amber-200 bg-amber-50 text-amber-800';
  }

  return 'border-primary/20 bg-primary/10 text-primary';
}

function getReviewCardClasses(diagnosis: DiagnosticBreakdown): string {
  if (!isReviewDiagnosisActive(diagnosis)) {
    return 'border-border/70 bg-background/80';
  }

  if (
    diagnosis.outcome.toLowerCase().includes('mild') ||
    diagnosis.outcome.toLowerCase().includes('warning')
  ) {
    return 'border-amber-200 bg-amber-50/60';
  }

  return 'border-primary/20 bg-primary/5';
}

function renderMetricCard(metric: ScoringMetric) {
  return (
    <div key={metric.label} className='border-border/70 bg-background/80 rounded-xl border p-4'>
      <p className='text-foreground text-sm font-semibold'>{metric.label}</p>
      <p className='text-foreground mt-2 text-lg font-semibold'>{metric.value}</p>
      {metric.note && (
        <p className='text-muted-foreground mt-2 text-xs leading-relaxed'>{metric.note}</p>
      )}
    </div>
  );
}

export function ReviewModePanel({
  report,
  reviewScenario,
  expectationResults,
  expectationSummary,
}: ReviewModePanelProps) {
  const algorithmBreakdown = report.algorithmBreakdown;

  if (!algorithmBreakdown) {
    return null;
  }

  const sortedExpectationResults = sortExpectationResults(expectationResults);
  const sortedDiagnoses = sortReviewDiagnoses(algorithmBreakdown.diagnoses);
  const activeDiagnoses = sortedDiagnoses.filter(isReviewDiagnosisActive);
  const scenarioHighlights = getScenarioHighlights(reviewScenario);

  return (
    <section className='space-y-6 print:hidden'>
      <Card className='border-primary/20 bg-primary/5 shadow-sm'>
        <CardHeader className='space-y-3'>
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <div className='space-y-2'>
              <CardTitle className='text-foreground flex items-center gap-2 text-2xl'>
                <FlaskConical className='text-primary h-6 w-6' />
                <span>Algorithm Viewer</span>
              </CardTitle>
              <CardDescription className='text-muted-foreground max-w-3xl text-sm leading-relaxed'>
                Review mode surfaces the live decision path first so the client can validate the
                rules, thresholds, and outputs before reading the patient-facing report preview.
              </CardDescription>
            </div>
            <div className='border-primary/20 bg-background/80 text-primary rounded-full border px-3 py-1 text-xs font-semibold'>
              Review mode
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='border-primary/20 bg-background/80 rounded-2xl border p-4'>
            <div className='flex flex-wrap items-start justify-between gap-3'>
              <div className='space-y-2'>
                <p className='text-primary text-sm font-semibold tracking-wide uppercase'>
                  Selected scenario
                </p>
                <h2 className='text-foreground text-xl font-semibold'>{reviewScenario.label}</h2>
                <p className='text-muted-foreground max-w-3xl text-sm leading-relaxed'>
                  {reviewScenario.description}
                </p>
              </div>
              <div className='flex flex-wrap gap-2'>
                {scenarioHighlights.map(highlight => (
                  <span
                    key={`${reviewScenario.id}-${highlight}`}
                    className='bg-primary/10 text-primary inline-flex rounded-full px-2.5 py-1 text-xs font-semibold'
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className='grid gap-4 md:grid-cols-3'>
            <div className='rounded-2xl border border-green-200 bg-green-50/80 p-4'>
              <div className='flex items-center gap-2 text-green-700'>
                <ClipboardCheck className='h-4 w-4' />
                <p className='text-sm font-semibold'>Verification summary</p>
              </div>
              <p className='mt-3 text-3xl font-semibold text-green-800'>
                {expectationSummary.matchedCount}/{expectationSummary.totalCount}
              </p>
              <p className='mt-1 text-sm text-green-700'>
                Expected checks matched the live report.
              </p>
            </div>

            <div
              className={cn(
                'rounded-2xl border p-4',
                expectationSummary.mismatchCount === 0
                  ? 'border-primary/20 bg-background/80'
                  : 'border-amber-200 bg-amber-50/80'
              )}
            >
              <div
                className={cn(
                  'flex items-center gap-2 text-sm font-semibold',
                  expectationSummary.mismatchCount === 0 ? 'text-primary' : 'text-amber-700'
                )}
              >
                <GitCompareArrows className='h-4 w-4' />
                <p>Expected vs actual</p>
              </div>
              <p className='text-foreground mt-3 text-3xl font-semibold'>
                {expectationSummary.mismatchCount}
              </p>
              <p className='text-muted-foreground mt-1 text-sm'>
                {expectationSummary.mismatchCount === 0
                  ? 'No mismatches to review for this scenario.'
                  : 'Mismatches are pinned to the top of the comparison grid below.'}
              </p>
            </div>

            <div className='border-primary/20 bg-background/80 rounded-2xl border p-4'>
              <div className='text-primary flex items-center gap-2'>
                <CheckCircle2 className='h-4 w-4' />
                <p className='text-sm font-semibold'>Active pathways</p>
              </div>
              <p className='text-foreground mt-3 text-3xl font-semibold'>
                {activeDiagnoses.length}
              </p>
              <p className='text-muted-foreground mt-1 text-sm'>
                Diagnosis cards marked as active in the live breakdown.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid gap-6 xl:grid-cols-[1.15fr_0.85fr]'>
        <Card className='shadow-sm'>
          <CardHeader className='space-y-2'>
            <CardTitle className='text-foreground flex items-center gap-2'>
              <GitCompareArrows className='text-primary h-5 w-5' />
              <span>Expected Vs Actual</span>
            </CardTitle>
            <CardDescription className='text-sm leading-relaxed'>
              Scenario expectations come from the named example. Actual values come from the live
              report output for the same fixed inputs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-3 md:grid-cols-2'>
              {sortedExpectationResults.map(result => (
                <div
                  key={result.key}
                  className={cn(
                    'rounded-xl border p-4',
                    result.matches
                      ? 'border-green-200 bg-green-50/70'
                      : 'border-amber-200 bg-amber-50/80'
                  )}
                >
                  <div className='flex items-start justify-between gap-3'>
                    <p className='text-foreground text-sm font-semibold'>{result.label}</p>
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2 py-0.5 text-xs font-semibold',
                        result.matches
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      )}
                    >
                      {result.matches ? 'Matched' : 'Mismatch'}
                    </span>
                  </div>
                  <div className='mt-3 space-y-1 text-sm'>
                    <p className='text-muted-foreground'>
                      <strong className='text-foreground'>Expected:</strong> {result.expected}
                    </p>
                    <p className='text-muted-foreground'>
                      <strong className='text-foreground'>Actual:</strong> {result.actual}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className='shadow-sm'>
          <CardHeader className='space-y-2'>
            <CardTitle className='text-foreground flex items-center gap-2'>
              <Activity className='text-primary h-5 w-5' />
              <span>Computed Metrics</span>
            </CardTitle>
            <CardDescription className='text-sm leading-relaxed'>
              These values feed the decision cards directly and mirror the metric section of
              `docs/ALGORITHM_REFERENCE.md`.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-3'>{algorithmBreakdown.metrics.map(renderMetricCard)}</div>
          </CardContent>
        </Card>
      </div>

      <Card className='shadow-sm'>
        <CardHeader className='space-y-2'>
          <CardTitle className='text-foreground flex items-center gap-2'>
            <FlaskConical className='text-primary h-5 w-5' />
            <span>Pathway Cards</span>
          </CardTitle>
          <CardDescription className='text-sm leading-relaxed'>
            Each card exposes the plain-English rule summary, observed inputs, thresholds, and live
            outcome for a diagnosis pathway.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {sortedDiagnoses.map(diagnosis => {
            const reference = getReviewReferenceSection(diagnosis.id);

            return (
              <article
                key={diagnosis.id}
                className={cn('rounded-2xl border p-5', getReviewCardClasses(diagnosis))}
              >
                <div className='flex flex-wrap items-start justify-between gap-4'>
                  <div className='max-w-3xl space-y-2'>
                    <p className='text-primary/80 text-xs font-semibold tracking-wide uppercase'>
                      Diagnosis pathway
                    </p>
                    <h3 className='text-foreground text-xl font-semibold'>{diagnosis.label}</h3>
                    <p className='text-muted-foreground text-sm leading-relaxed'>
                      {reference.ruleSummary}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'inline-flex rounded-full border px-3 py-1 text-xs font-semibold',
                      getReviewOutcomeClasses(diagnosis)
                    )}
                  >
                    {diagnosis.outcome}
                  </span>
                </div>

                <div className='mt-4 grid gap-3 lg:grid-cols-2'>
                  {diagnosis.criteria.map(criteria => (
                    <div
                      key={`${diagnosis.id}-${criteria.label}`}
                      className='border-border/70 bg-background/80 rounded-xl border p-4'
                    >
                      <div className='flex flex-wrap items-start justify-between gap-3'>
                        <p className='text-foreground text-sm font-semibold'>{criteria.label}</p>
                        <span
                          className={cn(
                            'inline-flex rounded-full px-2 py-0.5 text-xs font-semibold',
                            criteria.met
                              ? 'bg-green-100 text-green-700'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {criteria.met ? 'Met' : 'Not met'}
                        </span>
                      </div>
                      <p className='text-muted-foreground mt-3 text-sm'>
                        <strong className='text-foreground'>Observed:</strong> {criteria.actual}
                      </p>
                      {criteria.threshold && (
                        <p className='text-muted-foreground mt-1 text-sm'>
                          <strong className='text-foreground'>Threshold:</strong>{' '}
                          {criteria.threshold}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {diagnosis.notes && diagnosis.notes.length > 0 && (
                  <div className='border-border/70 bg-background/80 mt-4 rounded-xl border p-4'>
                    <p className='text-foreground text-sm font-semibold'>Implementation notes</p>
                    <ul className='text-muted-foreground mt-2 list-disc space-y-1 pl-5 text-sm'>
                      {diagnosis.notes.map(note => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {reference.clarification && (
                  <div className='mt-4 rounded-xl border border-amber-200 bg-amber-50/80 p-4'>
                    <p className='text-sm font-semibold text-amber-800'>
                      Clarification still called out in the written reference
                    </p>
                    <p className='mt-2 text-sm leading-relaxed text-amber-800/90'>
                      {reference.clarification}
                    </p>
                  </div>
                )}

                <div className='border-border/70 mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm'>
                  <a
                    href={`#${reference.anchorId}`}
                    className='text-primary font-medium underline-offset-4 hover:underline'
                  >
                    Jump to written reference
                  </a>
                  <p className='text-muted-foreground text-xs'>
                    Mirrors {reference.documentPath} → {reference.sectionTitle}
                  </p>
                </div>
              </article>
            );
          })}
        </CardContent>
      </Card>

      <Card className='shadow-sm'>
        <CardHeader className='space-y-2'>
          <CardTitle className='text-foreground flex items-center gap-2'>
            <BookOpenText className='text-primary h-5 w-5' />
            <span>Written Algorithm Crosswalk</span>
          </CardTitle>
          <CardDescription className='text-sm leading-relaxed'>
            These summaries mirror `docs/ALGORITHM_REFERENCE.md` so the live viewer and written
            algorithm tell the same story. Threshold editing and freeform tuning stay out of scope
            in this phase.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {sortedDiagnoses.map(diagnosis => {
            const reference = getReviewReferenceSection(diagnosis.id);

            return (
              <article
                key={reference.anchorId}
                id={reference.anchorId}
                className='border-border/70 bg-background/80 rounded-2xl border p-5'
              >
                <div className='flex flex-wrap items-start justify-between gap-4'>
                  <div className='space-y-2'>
                    <p className='text-foreground text-sm font-semibold'>
                      {reference.sectionTitle}
                    </p>
                    <p className='text-muted-foreground text-xs'>{reference.documentPath}</p>
                  </div>
                  <span className='bg-muted text-muted-foreground inline-flex rounded-full px-2.5 py-1 text-xs font-medium'>
                    {diagnosis.label}
                  </span>
                </div>
                <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
                  {reference.ruleSummary}
                </p>
                <ul className='text-muted-foreground mt-3 list-disc space-y-1 pl-5 text-sm'>
                  {reference.ruleBullets.map(ruleBullet => (
                    <li key={ruleBullet}>{ruleBullet}</li>
                  ))}
                </ul>
                {reference.clarification && (
                  <div className='mt-4 rounded-xl border border-amber-200 bg-amber-50/80 p-4'>
                    <p className='text-sm font-semibold text-amber-800'>Open clarification</p>
                    <p className='mt-2 text-sm leading-relaxed text-amber-800/90'>
                      {reference.clarification}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </CardContent>
      </Card>
    </section>
  );
}
