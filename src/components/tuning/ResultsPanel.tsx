'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { DiagnosticBreakdown, FullReportResult } from '@/lib/diagnosis-report-types';

interface ResultsPanelProps {
  report: FullReportResult | null;
  loading: boolean;
  error: string | null;
}

interface SummaryBadge {
  label: string;
  value: string;
  active: boolean;
}

function isDiagnosisActive(diagnosis: DiagnosticBreakdown): boolean {
  return !diagnosis.outcome.toLowerCase().includes('not flagged');
}

function getOutcomeClasses(diagnosis: DiagnosticBreakdown): string {
  if (!isDiagnosisActive(diagnosis)) {
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

function getSummaryBadges(report: FullReportResult): SummaryBadge[] {
  return [
    {
      label: 'Avg weekly sleep',
      value: `${report.avgWeeklySleep.toFixed(1)}h`,
      active: true,
    },
    {
      label: 'EDS',
      value: report.hasEDS ? report.edsSeverity : 'none',
      active: report.hasEDS,
    },
    {
      label: 'Insomnia',
      value: report.hasInsomnia ? report.insomniaSeverity : 'none',
      active: report.hasInsomnia,
    },
    {
      label: 'Sleep apnea',
      value: report.hasOSA ? 'probable' : report.hasMildRespiratoryDisturbance ? 'mild' : 'none',
      active: report.hasOSA || report.hasMildRespiratoryDisturbance,
    },
    {
      label: 'COMISA',
      value: report.hasCOMISA ? 'flagged' : 'none',
      active: report.hasCOMISA,
    },
    {
      label: 'Narcolepsy',
      value: report.hasNarcolepsy ? 'flagged' : 'none',
      active: report.hasNarcolepsy,
    },
  ];
}

export function ResultsPanel({ report, loading, error }: ResultsPanelProps) {
  const algorithmBreakdown = report?.algorithmBreakdown;
  const summaryBadges = report ? getSummaryBadges(report) : [];

  return (
    <Card className='border-primary/20 bg-card/80 shadow-sm'>
      <CardHeader className='space-y-3'>
        <CardTitle className='text-xl'>Results Panel</CardTitle>
        <CardDescription>
          See the live algorithm output, the computed metrics, and the exact criteria that were met.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {loading && (
          <Alert className='border-primary/20 bg-primary/5'>
            <AlertDescription>Recalculating the report with the current inputs...</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className='border-destructive/30 bg-destructive/10'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!report && !loading && !error && (
          <Alert>
            <AlertDescription>Results will appear here once the first diagnosis request finishes.</AlertDescription>
          </Alert>
        )}

        {report && (
          <>
            <div className='flex flex-wrap gap-2'>
              {summaryBadges.map(badge => (
                <span
                  key={badge.label}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-semibold',
                    badge.active
                      ? 'border-primary/20 bg-primary/10 text-primary'
                      : 'border-border/70 bg-background text-muted-foreground'
                  )}
                >
                  {badge.label}: {badge.value}
                </span>
              ))}
            </div>

            {algorithmBreakdown && (
              <>
                <details open className='border-border/70 bg-background/70 rounded-2xl border'>
                  <summary className='cursor-pointer list-none px-4 py-3'>
                    <div className='flex items-center justify-between gap-3'>
                      <div className='space-y-1'>
                        <h3 className='text-sm font-semibold tracking-wide uppercase'>Computed Metrics</h3>
                        <p className='text-muted-foreground text-xs'>
                          Recalculated on every input or threshold change.
                        </p>
                      </div>
                      <span className='text-muted-foreground text-xs'>
                        {algorithmBreakdown.metrics.length} metrics
                      </span>
                    </div>
                  </summary>
                  <div className='grid gap-3 border-t px-4 py-4 md:grid-cols-2 xl:grid-cols-3'>
                    {algorithmBreakdown.metrics.map(metric => (
                      <div
                        key={metric.label}
                        className='border-border/70 bg-background/70 rounded-xl border p-4'
                      >
                        <p className='text-sm font-semibold'>{metric.label}</p>
                        <p className='mt-2 text-lg font-semibold'>{metric.value}</p>
                        {metric.note && (
                          <p className='text-muted-foreground mt-2 text-xs leading-relaxed'>
                            {metric.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </details>

                <details open className='border-border/70 bg-background/70 rounded-2xl border'>
                  <summary className='cursor-pointer list-none px-4 py-3'>
                    <div className='flex items-center justify-between gap-3'>
                      <div className='space-y-1'>
                        <h3 className='text-sm font-semibold tracking-wide uppercase'>Diagnosis Cards</h3>
                        <p className='text-muted-foreground text-xs'>
                          Expand a card to inspect exact threshold checks and whether each criterion was met.
                        </p>
                      </div>
                      <span className='text-muted-foreground text-xs'>
                        {algorithmBreakdown.diagnoses.length} pathways
                      </span>
                    </div>
                  </summary>
                  <div className='space-y-3 border-t px-4 py-4'>
                    {algorithmBreakdown.diagnoses.map(diagnosis => (
                      <details
                        key={diagnosis.id}
                        open={isDiagnosisActive(diagnosis)}
                        className='border-border/70 bg-background/70 rounded-2xl border'
                      >
                        <summary className='cursor-pointer list-none px-4 py-3'>
                          <div className='flex flex-wrap items-center justify-between gap-3'>
                            <div className='space-y-1'>
                              <p className='font-semibold'>{diagnosis.label}</p>
                              <p className='text-muted-foreground text-sm'>{diagnosis.outcome}</p>
                            </div>
                            <span
                              className={cn(
                                'rounded-full border px-3 py-1 text-xs font-semibold',
                                getOutcomeClasses(diagnosis)
                              )}
                            >
                              {diagnosis.outcome}
                            </span>
                          </div>
                        </summary>
                        <div className='space-y-3 border-t px-4 py-4'>
                          {diagnosis.criteria.map(criterion => (
                            <div
                              key={`${diagnosis.id}-${criterion.label}`}
                              className={cn(
                                'rounded-xl border p-3',
                                criterion.met
                                  ? 'border-primary/20 bg-primary/5'
                                  : 'border-border/70 bg-card/70'
                              )}
                            >
                              <div className='flex flex-wrap items-start justify-between gap-3'>
                                <div className='space-y-1'>
                                  <p className='text-sm font-medium'>{criterion.label}</p>
                                  <p className='text-muted-foreground text-xs'>
                                    Actual: {criterion.actual}
                                  </p>
                                  {criterion.threshold && (
                                    <p className='text-muted-foreground text-xs'>
                                      Threshold: {criterion.threshold}
                                    </p>
                                  )}
                                </div>
                                <span
                                  className={cn(
                                    'rounded-full px-2.5 py-1 text-xs font-semibold',
                                    criterion.met
                                      ? 'bg-primary/10 text-primary'
                                      : 'bg-muted text-muted-foreground'
                                  )}
                                >
                                  {criterion.met ? 'Met' : 'Not met'}
                                </span>
                              </div>
                            </div>
                          ))}

                          {diagnosis.notes && diagnosis.notes.length > 0 && (
                            <div className='space-y-2 rounded-xl border border-dashed p-3'>
                              <p className='text-sm font-medium'>Notes</p>
                              {diagnosis.notes.map(note => (
                                <p key={note} className='text-muted-foreground text-xs leading-relaxed'>
                                  {note}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </details>
                    ))}
                  </div>
                </details>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
