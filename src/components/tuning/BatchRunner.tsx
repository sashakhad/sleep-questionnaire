'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TUNING_OUTCOME_FIELDS, type TuningBatchScenarioResult } from '@/lib/diagnosis-tuning';

interface BatchRunnerProps {
  results: TuningBatchScenarioResult[] | null;
  loading: boolean;
  hasOverrides: boolean;
  error: string | null;
  onRunAllScenarios: () => void;
}

function formatOutcomeValue(value: string | boolean): string {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  return value;
}

function getOutcomeCellClasses(value: string | boolean, changed: boolean): string {
  if (changed) {
    return 'border-amber-300 bg-amber-50 text-amber-900';
  }

  if (value === true || value === 'mild' || value === 'moderate-to-severe') {
    return 'border-primary/20 bg-primary/5 text-primary';
  }

  return 'border-border/70 bg-background text-muted-foreground';
}

export function BatchRunner({
  results,
  loading,
  hasOverrides,
  error,
  onRunAllScenarios,
}: BatchRunnerProps) {
  return (
    <Card className='border-primary/20 bg-card/80 shadow-sm'>
      <CardHeader className='space-y-3'>
        <div className='flex flex-wrap items-start justify-between gap-3'>
          <div className='space-y-1'>
            <CardTitle className='text-xl'>Batch Scenario Runner</CardTitle>
            <CardDescription>
              Re-run every named scenario and spot which outputs changed under the current override set.
            </CardDescription>
          </div>
          <Button onClick={onRunAllScenarios} disabled={loading}>
            {loading ? 'Running...' : 'Run All Scenarios'}
          </Button>
        </div>
        <p className='text-muted-foreground text-sm'>
          {hasOverrides
            ? 'Cells highlighted in amber changed relative to the default algorithm.'
            : 'Run the matrix now to get a baseline across all existing scenarios.'}
        </p>
      </CardHeader>
      <CardContent>
        {error && (
          <div className='mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900'>
            {error}
          </div>
        )}

        {!results && !loading && (
          <div className='text-muted-foreground rounded-2xl border border-dashed px-4 py-8 text-center text-sm'>
            No batch results yet. Run all scenarios to generate the comparison matrix.
          </div>
        )}

        {results && (
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[1200px] border-separate border-spacing-0'>
              <thead>
                <tr>
                  <th className='bg-background sticky left-0 z-10 border-b px-3 py-3 text-left text-xs font-semibold tracking-wide uppercase'>
                    Scenario
                  </th>
                  <th className='bg-background border-b px-3 py-3 text-left text-xs font-semibold tracking-wide uppercase'>
                    Expected mismatches
                  </th>
                  <th className='bg-background border-b px-3 py-3 text-left text-xs font-semibold tracking-wide uppercase'>
                    Changed outputs
                  </th>
                  {TUNING_OUTCOME_FIELDS.map(field => (
                    <th
                      key={field.key}
                      className='bg-background border-b px-3 py-3 text-left text-xs font-semibold tracking-wide uppercase'
                    >
                      {field.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map(result => (
                  <tr key={result.scenarioId}>
                    <td className='bg-background sticky left-0 z-10 border-b px-3 py-3 align-top'>
                      <div className='space-y-1'>
                        <p className='text-sm font-semibold'>{result.label}</p>
                        <p className='text-muted-foreground text-xs leading-relaxed'>
                          {result.description}
                        </p>
                      </div>
                    </td>
                    <td className='border-b px-3 py-3 align-top'>
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-1 text-xs font-semibold',
                          result.mismatchCount === 0
                            ? 'bg-primary/10 text-primary'
                            : 'bg-amber-100 text-amber-900'
                        )}
                      >
                        {result.mismatchCount}
                      </span>
                    </td>
                    <td className='border-b px-3 py-3 align-top'>
                      <span className='text-sm font-medium'>{result.diffs.length}</span>
                    </td>
                    {TUNING_OUTCOME_FIELDS.map(field => {
                      const overriddenValue = result.overriddenOutcome[field.key];
                      const defaultValue = result.defaultOutcome[field.key];
                      const changed = overriddenValue !== defaultValue;

                      return (
                        <td key={`${result.scenarioId}-${field.key}`} className='border-b px-3 py-3 align-top'>
                          <div
                            className={cn(
                              'rounded-xl border px-3 py-2 text-sm font-medium',
                              getOutcomeCellClasses(overriddenValue, changed)
                            )}
                            title={
                              changed
                                ? `Default: ${String(defaultValue)} | Overridden: ${String(overriddenValue)}`
                                : undefined
                            }
                          >
                            {formatOutcomeValue(overriddenValue)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
