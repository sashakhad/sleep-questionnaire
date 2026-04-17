'use client';

import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import type {
  DiagnosticBreakdown,
  FullReportResult,
  ScoringCriterion,
} from '@/lib/diagnosis-report-types';
import {
  DIAGNOSIS_EDS_WEIGHTS_IDS,
  DIAGNOSIS_THRESHOLD_MAP,
  EDS_WEIGHTS,
  EDS_WEIGHT_DEFINITIONS,
  EDS_WEIGHT_KEYS,
  THRESHOLDS,
  THRESHOLD_DEFINITIONS,
  type EDSWeightKey,
  type EDSWeightsConfig,
  type ThresholdConfig,
  type ThresholdKey,
} from '@/lib/diagnosis-shared';

interface DecisionTreeViewProps {
  report: FullReportResult | null;
  loading: boolean;
  error: string | null;
  thresholdOverrides: Partial<ThresholdConfig>;
  edsWeightOverrides: Partial<EDSWeightsConfig>;
  onThresholdChange: (key: ThresholdKey, value: number | null) => void;
  onEDSWeightChange: (key: EDSWeightKey, value: number | null) => void;
  onResetAll: () => void;
}

function handleNumericChange(
  rawValue: string,
  onChange: (value: number | null) => void
) {
  if (rawValue === '') {
    onChange(null);
    return;
  }
  const parsedValue = Number(rawValue);
  onChange(Number.isFinite(parsedValue) ? parsedValue : null);
}

function isDiagnosisActive(diagnosis: DiagnosticBreakdown): boolean {
  const outcomeLower = diagnosis.outcome.toLowerCase();
  if (outcomeLower.includes('not flagged') || outcomeLower.includes('not reported')) {
    return false;
  }
  return true;
}

function getOutcomePillClasses(diagnosis: DiagnosticBreakdown): string {
  if (!isDiagnosisActive(diagnosis)) {
    return 'border-border/70 bg-muted/60 text-muted-foreground';
  }
  const outcomeLower = diagnosis.outcome.toLowerCase();
  if (outcomeLower.includes('mild') || outcomeLower.includes('warning')) {
    return 'border-amber-200 bg-amber-50 text-amber-800';
  }
  return 'border-primary/30 bg-primary/10 text-primary';
}

interface VerdictSummaryProps {
  report: FullReportResult;
}

function VerdictSummary({ report }: VerdictSummaryProps) {
  const flaggedLabels: string[] = [];
  const notFlaggedLabels: string[] = [];

  if (report.hasInsomnia) {
    flaggedLabels.push(`Insomnia (${report.insomniaSeverity})`);
  } else {
    notFlaggedLabels.push('Insomnia');
  }

  if (report.hasEDS) {
    flaggedLabels.push(`EDS (${report.edsSeverity})`);
  } else {
    notFlaggedLabels.push('EDS');
  }

  if (report.hasOSA) {
    flaggedLabels.push('Probable sleep apnea');
  } else if (report.hasMildRespiratoryDisturbance) {
    flaggedLabels.push('Mild respiratory disturbance');
  } else {
    notFlaggedLabels.push('Sleep apnea');
  }

  if (report.hasCOMISA) flaggedLabels.push('COMISA');
  else notFlaggedLabels.push('COMISA');

  if (report.hasRLS) flaggedLabels.push('RLS');
  else notFlaggedLabels.push('RLS');

  if (report.hasNarcolepsy) flaggedLabels.push('Narcolepsy');
  else notFlaggedLabels.push('Narcolepsy');

  if (report.hasNightmares) flaggedLabels.push('Nightmare disorder');
  else if (report.hasBadDreamWarning) flaggedLabels.push('Bad dream warning');
  else notFlaggedLabels.push('Nightmares');

  if (report.hasChronicFatigueSymptoms) flaggedLabels.push('Chronic fatigue / fibromyalgia');
  else notFlaggedLabels.push('Chronic fatigue');

  if (report.hasInsufficientSleep) flaggedLabels.push('Insufficient sleep');
  else notFlaggedLabels.push('Insufficient sleep');

  if (report.chronotypeType === 'delayed') flaggedLabels.push('Delayed sleep phase');

  return (
    <div className='bg-card rounded-2xl border p-5'>
      <p className='text-muted-foreground text-xs font-semibold tracking-wide uppercase'>
        Verdict for this patient
      </p>
      <div className='mt-3 space-y-3'>
        <div>
          <p className='text-primary text-sm font-semibold'>Flagged</p>
          {flaggedLabels.length === 0 ? (
            <p className='text-muted-foreground mt-1 text-sm'>
              No disorders flagged for this patient.
            </p>
          ) : (
            <div className='mt-1 flex flex-wrap gap-2'>
              {flaggedLabels.map(label => (
                <span
                  key={label}
                  className='border-primary/30 bg-primary/10 text-primary rounded-full border px-3 py-1 text-xs font-semibold'
                >
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className='text-muted-foreground text-sm font-semibold'>Not flagged</p>
          <div className='mt-1 flex flex-wrap gap-2'>
            {notFlaggedLabels.map(label => (
              <span
                key={label}
                className='border-border/70 bg-background text-muted-foreground rounded-full border px-3 py-1 text-xs'
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface CriterionRowProps {
  criterion: ScoringCriterion;
}

function CriterionRow({ criterion }: CriterionRowProps) {
  return (
    <li className='flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between'>
      <div className='flex flex-1 items-start gap-3'>
        <div
          className={cn(
            'mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full',
            criterion.met
              ? 'bg-primary/15 text-primary'
              : 'bg-muted text-muted-foreground'
          )}
          aria-hidden='true'
        >
          {criterion.met ? (
            <Check className='h-3 w-3' strokeWidth={3} />
          ) : (
            <X className='h-3 w-3' strokeWidth={3} />
          )}
        </div>
        <div className='flex-1 space-y-0.5'>
          <p className='text-sm font-medium'>{criterion.label}</p>
          <p className='text-muted-foreground text-xs leading-relaxed'>
            Patient value: <span className='text-foreground font-medium'>{criterion.actual}</span>
          </p>
          {criterion.threshold && (
            <p className='text-muted-foreground text-xs leading-relaxed'>
              Threshold: <span className='text-foreground font-medium'>{criterion.threshold}</span>
            </p>
          )}
        </div>
      </div>
      <span
        className={cn(
          'h-fit flex-none rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap',
          criterion.met
            ? 'border-primary/30 bg-primary/10 text-primary'
            : 'border-border/70 bg-muted text-muted-foreground'
        )}
      >
        {criterion.met ? 'Met' : 'Not met'}
      </span>
    </li>
  );
}

interface InlineThresholdInputProps {
  label: string;
  description: string;
  unit?: string | undefined;
  defaultValue: number;
  overrideValue: number | undefined;
  onChange: (value: number | null) => void;
}

function InlineThresholdInput({
  label,
  description,
  unit,
  defaultValue,
  overrideValue,
  onChange,
}: InlineThresholdInputProps) {
  const isOverridden = overrideValue !== undefined;
  return (
    <div
      className={cn(
        'rounded-xl border p-3',
        isOverridden ? 'border-primary/40 bg-primary/5' : 'border-border/70 bg-background'
      )}
    >
      <div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
        <div className='space-y-1'>
          <p className='text-sm font-medium'>{label}</p>
          <p className='text-muted-foreground text-xs leading-relaxed'>{description}</p>
          <p className='text-muted-foreground text-xs'>
            Default: {defaultValue}
            {unit ? ` ${unit}` : ''}
          </p>
        </div>
        <div className='flex w-full flex-col gap-2 md:w-40'>
          <Input
            type='number'
            inputMode='decimal'
            step='any'
            value={overrideValue ?? ''}
            placeholder={String(defaultValue)}
            className={cn(isOverridden && 'border-primary/50 ring-primary/20')}
            onChange={event => handleNumericChange(event.target.value, onChange)}
          />
          {isOverridden && (
            <Button variant='ghost' size='sm' onClick={() => onChange(null)}>
              Reset to default
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface DiagnosisCardProps {
  diagnosis: DiagnosticBreakdown;
  thresholdOverrides: Partial<ThresholdConfig>;
  edsWeightOverrides: Partial<EDSWeightsConfig>;
  onThresholdChange: (key: ThresholdKey, value: number | null) => void;
  onEDSWeightChange: (key: EDSWeightKey, value: number | null) => void;
}

function DiagnosisCard({
  diagnosis,
  thresholdOverrides,
  edsWeightOverrides,
  onThresholdChange,
  onEDSWeightChange,
}: DiagnosisCardProps) {
  const [thresholdsOpen, setThresholdsOpen] = useState(false);

  const active = isDiagnosisActive(diagnosis);
  const thresholdKeys = DIAGNOSIS_THRESHOLD_MAP[diagnosis.id] ?? [];
  const showEDSWeights = DIAGNOSIS_EDS_WEIGHTS_IDS.includes(diagnosis.id);

  const activeThresholdOverrides = thresholdKeys.filter(
    key => thresholdOverrides[key] !== undefined
  );
  const activeWeightOverrides = showEDSWeights
    ? EDS_WEIGHT_KEYS.filter(key => edsWeightOverrides[key] !== undefined)
    : [];
  const totalActiveOverrides = activeThresholdOverrides.length + activeWeightOverrides.length;

  const canEditThresholds = thresholdKeys.length > 0 || showEDSWeights;

  return (
    <Card
      className={cn(
        'overflow-hidden border shadow-sm',
        active ? 'border-primary/20' : 'border-border/70'
      )}
    >
      <CardHeader className='gap-3'>
        <div className='flex flex-wrap items-start justify-between gap-3'>
          <CardTitle className='text-lg font-semibold'>{diagnosis.label}</CardTitle>
          <span
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-semibold',
              getOutcomePillClasses(diagnosis)
            )}
          >
            {diagnosis.outcome}
          </span>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div>
          <p className='text-muted-foreground text-xs font-semibold tracking-wide uppercase'>
            Decision trail
          </p>
          <ul className='divide-border/60 mt-2 divide-y'>
            {diagnosis.criteria.map((criterion, index) => (
              <CriterionRow key={`${diagnosis.id}-criterion-${index}`} criterion={criterion} />
            ))}
          </ul>
        </div>

        {diagnosis.notes && diagnosis.notes.length > 0 && (
          <div className='border-border/70 bg-muted/40 rounded-xl border p-3 text-sm leading-relaxed'>
            {diagnosis.notes.map((note, index) => (
              <p key={`${diagnosis.id}-note-${index}`}>{note}</p>
            ))}
          </div>
        )}

        {canEditThresholds && (
          <div className='border-border/70 rounded-xl border'>
            <button
              type='button'
              className={cn(
                'hover:bg-muted/50 flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition-colors',
                thresholdsOpen && 'bg-muted/40'
              )}
              onClick={() => setThresholdsOpen(open => !open)}
              aria-expanded={thresholdsOpen}
            >
              <span className='flex items-center gap-2'>
                <SlidersHorizontal className='text-muted-foreground h-4 w-4' />
                <span className='text-sm font-medium'>Thresholds for this screen</span>
                {totalActiveOverrides > 0 && (
                  <span className='bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-semibold'>
                    {totalActiveOverrides} override{totalActiveOverrides === 1 ? '' : 's'}
                  </span>
                )}
              </span>
              <ChevronDown
                className={cn(
                  'text-muted-foreground h-4 w-4 transition-transform',
                  thresholdsOpen && 'rotate-180'
                )}
              />
            </button>
            {thresholdsOpen && (
              <div className='border-t px-4 py-4'>
                <div className='space-y-3'>
                  {thresholdKeys.map(key => {
                    const definition = THRESHOLD_DEFINITIONS[key];
                    return (
                      <InlineThresholdInput
                        key={key}
                        label={definition.label}
                        description={definition.description}
                        unit={definition.unit}
                        defaultValue={THRESHOLDS[key]}
                        overrideValue={thresholdOverrides[key]}
                        onChange={value => onThresholdChange(key, value)}
                      />
                    );
                  })}

                  {showEDSWeights && (
                    <>
                      {thresholdKeys.length > 0 && (
                        <div className='border-border/60 border-t pt-3' />
                      )}
                      <p className='text-muted-foreground text-xs font-semibold tracking-wide uppercase'>
                        EDS activity weights
                      </p>
                      {EDS_WEIGHT_KEYS.map(key => {
                        const definition = EDS_WEIGHT_DEFINITIONS[key];
                        return (
                          <InlineThresholdInput
                            key={key}
                            label={definition.label}
                            description={definition.description}
                            defaultValue={EDS_WEIGHTS[key]}
                            overrideValue={edsWeightOverrides[key]}
                            onChange={value => onEDSWeightChange(key, value)}
                          />
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MetricsBar({ metrics }: { metrics: FullReportResult['algorithmBreakdown'] extends infer T ? T : never }) {
  if (!metrics) return null;
  return (
    <div className='bg-muted/40 rounded-2xl border p-4'>
      <p className='text-muted-foreground text-xs font-semibold tracking-wide uppercase'>
        Computed metrics
      </p>
      <div className='mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6'>
        {metrics.metrics.map(metric => (
          <div key={metric.label} className='bg-background rounded-xl border p-3'>
            <p className='text-muted-foreground text-xs'>{metric.label}</p>
            <p className='text-foreground mt-1 text-sm font-semibold'>{metric.value}</p>
            {metric.note && (
              <p className='text-muted-foreground mt-1 text-xs leading-relaxed'>{metric.note}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DecisionTreeView({
  report,
  loading,
  error,
  thresholdOverrides,
  edsWeightOverrides,
  onThresholdChange,
  onEDSWeightChange,
  onResetAll,
}: DecisionTreeViewProps) {
  if (loading && !report) {
    return (
      <Alert className='border-primary/20 bg-primary/5'>
        <AlertDescription>Running the algorithm with the selected inputs…</AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert className='border-destructive/30 bg-destructive/10'>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!report) {
    return (
      <Alert>
        <AlertDescription>
          Select a scenario or enter a custom profile to see the algorithm&apos;s decision tree.
        </AlertDescription>
      </Alert>
    );
  }

  const breakdown = report.algorithmBreakdown;
  const totalOverrides =
    Object.keys(thresholdOverrides).length + Object.keys(edsWeightOverrides).length;

  return (
    <div className='space-y-6'>
      <VerdictSummary report={report} />

      {totalOverrides > 0 && (
        <div className='border-primary/30 bg-primary/5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3'>
          <p className='text-primary text-sm font-medium'>
            {totalOverrides} threshold {totalOverrides === 1 ? 'override' : 'overrides'} active
          </p>
          <Button variant='outline' size='sm' onClick={onResetAll}>
            Reset all overrides
          </Button>
        </div>
      )}

      {breakdown ? (
        <>
          <MetricsBar metrics={breakdown} />

          <div>
            <p className='text-muted-foreground text-xs font-semibold tracking-wide uppercase'>
              Decision tree
            </p>
            <p className='text-muted-foreground mt-1 text-sm'>
              Each card below shows one screen the algorithm evaluated. Open the
              &quot;Thresholds for this screen&quot; row to tweak the cutoffs live.
            </p>
            <div className='mt-4 space-y-4'>
              {breakdown.diagnoses.map(diagnosis => (
                <DiagnosisCard
                  key={diagnosis.id}
                  diagnosis={diagnosis}
                  thresholdOverrides={thresholdOverrides}
                  edsWeightOverrides={edsWeightOverrides}
                  onThresholdChange={onThresholdChange}
                  onEDSWeightChange={onEDSWeightChange}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <Alert>
          <AlertDescription>
            Algorithm breakdown is unavailable. Make sure the diagnose endpoint returned with
            `?debug=1` for admin sessions.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
