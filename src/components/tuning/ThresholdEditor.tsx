'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  EDS_WEIGHT_KEYS,
  EDS_WEIGHT_DEFINITIONS,
  EDS_WEIGHTS,
  THRESHOLD_DEFINITIONS,
  THRESHOLD_SECTIONS,
  THRESHOLDS,
  type EDSWeightKey,
  type EDSWeightsConfig,
  type ThresholdConfig,
  type ThresholdKey,
} from '@/lib/diagnosis-shared';

interface ThresholdEditorProps {
  thresholdOverrides: Partial<ThresholdConfig>;
  edsWeightOverrides: Partial<EDSWeightsConfig>;
  onThresholdChange: (key: ThresholdKey, value: number | null) => void;
  onEDSWeightChange: (key: EDSWeightKey, value: number | null) => void;
  onResetThresholdSection: (keys: ThresholdKey[]) => void;
  onResetEDSWeights: () => void;
  onResetAll: () => void;
}

function getOverrideCount(
  thresholdOverrides: Partial<ThresholdConfig>,
  edsWeightOverrides: Partial<EDSWeightsConfig>
): number {
  return Object.keys(thresholdOverrides).length + Object.keys(edsWeightOverrides).length;
}

function formatUnitLabel(unit: string | undefined): string {
  return unit ? ` ${unit}` : '';
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

export function ThresholdEditor({
  thresholdOverrides,
  edsWeightOverrides,
  onThresholdChange,
  onEDSWeightChange,
  onResetThresholdSection,
  onResetEDSWeights,
  onResetAll,
}: ThresholdEditorProps) {
  const totalOverrideCount = getOverrideCount(thresholdOverrides, edsWeightOverrides);

  return (
    <Card className='border-primary/20 bg-card/80 shadow-sm'>
      <CardHeader className='space-y-3'>
        <div className='flex flex-wrap items-start justify-between gap-3'>
          <div className='space-y-1'>
            <CardTitle className='text-xl'>Threshold Editor</CardTitle>
            <CardDescription>
              Adjust the live algorithm parameters without editing code.
            </CardDescription>
          </div>
          <div className='flex items-center gap-2'>
            <span className='bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold'>
              {totalOverrideCount} override{totalOverrideCount === 1 ? '' : 's'}
            </span>
            <Button variant='outline' size='sm' onClick={onResetAll}>
              Reset All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {THRESHOLD_SECTIONS.map(section => {
          const activeSectionOverrides = section.keys.filter(key => thresholdOverrides[key] !== undefined);

          return (
            <details
              key={section.id}
              open={activeSectionOverrides.length > 0}
              className='border-border/70 bg-background/70 rounded-2xl border'
            >
              <summary className='cursor-pointer list-none px-4 py-3'>
                <div className='flex items-center justify-between gap-3'>
                  <div className='space-y-1'>
                    <p className='text-sm font-semibold'>{section.label}</p>
                    <p className='text-muted-foreground text-xs'>
                      {section.keys.length} setting{section.keys.length === 1 ? '' : 's'}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    {activeSectionOverrides.length > 0 && (
                      <span className='bg-primary/10 text-primary rounded-full px-2.5 py-1 text-xs font-semibold'>
                        {activeSectionOverrides.length} active
                      </span>
                    )}
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={event => {
                        event.preventDefault();
                        onResetThresholdSection(section.keys);
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </summary>
              <div className='space-y-3 border-t px-4 py-4'>
                {section.keys.map(key => {
                  const definition = THRESHOLD_DEFINITIONS[key];
                  const overrideValue = thresholdOverrides[key];
                  const defaultValue = THRESHOLDS[key];
                  const isOverridden = overrideValue !== undefined;

                  return (
                    <div
                      key={key}
                      className={cn(
                        'rounded-xl border p-3',
                        isOverridden ? 'border-primary/30 bg-primary/5' : 'border-border/70 bg-card/70'
                      )}
                    >
                      <div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
                        <div className='space-y-1'>
                          <p className='text-sm font-medium'>{definition.label}</p>
                          <p className='text-muted-foreground text-xs leading-relaxed'>
                            {definition.description}
                          </p>
                          <p className='text-muted-foreground text-xs'>
                            Default: {defaultValue}
                            {formatUnitLabel(definition.unit)}
                          </p>
                        </div>
                        <div className='flex w-full flex-col gap-2 md:w-36'>
                          <Input
                            type='number'
                            inputMode='decimal'
                            step='any'
                            value={overrideValue ?? ''}
                            placeholder={String(defaultValue)}
                            className={cn(isOverridden && 'border-primary/50 ring-primary/20')}
                            onChange={event => {
                              handleNumericChange(event.target.value, value => {
                                onThresholdChange(key, value);
                              });
                            }}
                          />
                          {isOverridden && (
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => {
                                onThresholdChange(key, null);
                              }}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </details>
          );
        })}

        <details open={Object.keys(edsWeightOverrides).length > 0} className='border-border/70 bg-background/70 rounded-2xl border'>
          <summary className='cursor-pointer list-none px-4 py-3'>
            <div className='flex items-center justify-between gap-3'>
              <div className='space-y-1'>
                <p className='text-sm font-semibold'>EDS Activity Weights</p>
                <p className='text-muted-foreground text-xs'>
                  Control how each daytime dozing activity contributes to the EDS score.
                </p>
              </div>
              <div className='flex items-center gap-2'>
                {Object.keys(edsWeightOverrides).length > 0 && (
                  <span className='bg-primary/10 text-primary rounded-full px-2.5 py-1 text-xs font-semibold'>
                    {Object.keys(edsWeightOverrides).length} active
                  </span>
                )}
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={event => {
                    event.preventDefault();
                    onResetEDSWeights();
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </summary>
          <div className='space-y-3 border-t px-4 py-4'>
            {EDS_WEIGHT_KEYS.map(typedKey => {
              const definition = EDS_WEIGHT_DEFINITIONS[typedKey];
              const overrideValue = edsWeightOverrides[typedKey];
              const defaultValue = EDS_WEIGHTS[typedKey];
              const isOverridden = overrideValue !== undefined;

              return (
                <div
                  key={typedKey}
                  className={cn(
                    'rounded-xl border p-3',
                    isOverridden ? 'border-primary/30 bg-primary/5' : 'border-border/70 bg-card/70'
                  )}
                >
                  <div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
                    <div className='space-y-1'>
                      <p className='text-sm font-medium'>{definition.label}</p>
                      <p className='text-muted-foreground text-xs leading-relaxed'>
                        {definition.description}
                      </p>
                      <p className='text-muted-foreground text-xs'>Default weight: {defaultValue}</p>
                    </div>
                    <div className='flex w-full flex-col gap-2 md:w-36'>
                      <Input
                        type='number'
                        inputMode='decimal'
                        step='any'
                        value={overrideValue ?? ''}
                        placeholder={String(defaultValue)}
                        className={cn(isOverridden && 'border-primary/50 ring-primary/20')}
                        onChange={event => {
                          handleNumericChange(event.target.value, value => {
                            onEDSWeightChange(typedKey, value);
                          });
                        }}
                      />
                      {isOverridden && (
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => {
                            onEDSWeightChange(typedKey, null);
                          }}
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </details>
      </CardContent>
    </Card>
  );
}
