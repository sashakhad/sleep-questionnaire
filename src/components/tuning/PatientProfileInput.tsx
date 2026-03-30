'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch, type Control, type FieldValues, type Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckboxField } from '@/components/questionnaire/form-fields/CheckboxField';
import { NumberField } from '@/components/questionnaire/form-fields/NumberField';
import { SelectField } from '@/components/questionnaire/form-fields/SelectField';
import { cn } from '@/lib/utils';
import { defaultReviewScenario, diagnosisScenarios, getDiagnosisScenario } from '@/lib/diagnosis-scenarios';
import { getTuningScenarioData, type TuningMode, TUNING_OUTCOME_FIELDS } from '@/lib/diagnosis-tuning';
import { EDS_WEIGHT_DEFINITIONS, EDS_WEIGHT_KEYS } from '@/lib/diagnosis-shared';
import { questionnaireSchema, type QuestionnaireFormData } from '@/validations/questionnaire';
import { ChevronDown } from 'lucide-react';

interface PatientProfileInputProps {
  mode: TuningMode;
  selectedScenarioId: string;
  onModeChange: (mode: TuningMode) => void;
  onScenarioChange: (scenarioId: string) => void;
  onCustomDataChange: (data: QuestionnaireFormData) => void;
  onCustomValidityChange: (isValid: boolean) => void;
}

interface OptionDefinition {
  value: string;
  label: string;
}

interface CheckboxArrayFieldProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  description?: string;
  options: OptionDefinition[];
}

interface TimeInputFieldProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  description?: string;
}

interface InputSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const sexOptions: OptionDefinition[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'transgender', label: 'Transgender' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

const minuteIncrementOptions: OptionDefinition[] = [
  { value: '10', label: '10 minutes' },
  { value: '20', label: '20 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '40', label: '40 minutes' },
  { value: '50', label: '50 minutes' },
  { value: '60', label: '60 minutes' },
  { value: '70', label: '70 minutes' },
  { value: '80', label: '80 minutes' },
  { value: '90', label: '90 minutes' },
  { value: '100', label: '100 minutes' },
  { value: '110', label: '110 minutes' },
  { value: '120', label: '120 minutes' },
  { value: '>120', label: 'More than 120 minutes' },
];

const daytimeSleepOptions: OptionDefinition[] = EDS_WEIGHT_KEYS.map(key => ({
  value: key,
  label: EDS_WEIGHT_DEFINITIONS[key].label,
}));

const weaknessOptions: OptionDefinition[] = [
  { value: 'feel_weak', label: 'I feel weak' },
  { value: 'brace_myself', label: 'I need to brace myself' },
  { value: 'fallen', label: 'I have fallen down' },
];

const supplementOptions: OptionDefinition[] = [
  { value: 'melatonin', label: 'Melatonin' },
  { value: 'benadryl', label: 'Benadryl' },
  { value: 'tylenol_pm', label: 'Tylenol PM' },
  { value: 'nyquil', label: 'Nyquil' },
  { value: 'unisom', label: 'Unisom' },
];

const prescriptionOptions: OptionDefinition[] = [
  { value: 'antidepressants', label: 'Antidepressants' },
  { value: 'antipsychotic', label: 'Antipsychotics' },
  { value: 'benzos', label: 'Benzodiazepines' },
  { value: 'z_drugs', label: 'Z-drugs' },
];

const mentalHealthOptions: OptionDefinition[] = [
  { value: 'anxiety', label: 'Anxiety' },
  { value: 'depression', label: 'Depression' },
  { value: 'ptsd', label: 'PTSD' },
];

const medicalConditionOptions: OptionDefinition[] = [
  { value: 'hypertension', label: 'Hypertension' },
  { value: 'heart_disease', label: 'Heart disease' },
];

function CheckboxArrayField<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
  options,
}: CheckboxArrayFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedValues: string[] = Array.isArray(field.value)
          ? field.value.filter((value: unknown): value is string => typeof value === 'string')
          : [];

        return (
          <FormItem className='space-y-3'>
            <div className='space-y-1'>
              <FormLabel>{label}</FormLabel>
              {description && <FormDescription>{description}</FormDescription>}
            </div>
            <div className='grid gap-2 sm:grid-cols-2'>
              {options.map(option => (
                <label
                  key={option.value}
                  className='border-border/70 hover:border-primary/30 hover:bg-primary/5 flex cursor-pointer items-start gap-3 rounded-xl border bg-card/70 p-3 transition-colors'
                >
                  <Checkbox
                    checked={selectedValues.includes(option.value)}
                    onCheckedChange={checked => {
                      if (checked) {
                        field.onChange([...selectedValues, option.value]);
                        return;
                      }

                      field.onChange(selectedValues.filter(value => value !== option.value));
                    }}
                  />
                  <span className='text-sm leading-relaxed'>{option.label}</span>
                </label>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

function TimeInputField<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
}: TimeInputFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type='time' value={field.value ?? ''} onChange={field.onChange} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function InputSection({
  title,
  description,
  children,
  defaultOpen = false,
}: InputSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className='border-border/70 bg-background/70 rounded-2xl border'>
      <button
        type='button'
        onClick={() => {
          setIsOpen(currentState => !currentState);
        }}
        className='flex w-full items-start justify-between gap-4 px-4 py-4 text-left'
      >
        <div className='space-y-1'>
          <h3 className='text-sm font-semibold tracking-wide uppercase'>{title}</h3>
          <p className='text-muted-foreground text-sm leading-relaxed'>{description}</p>
        </div>
        <ChevronDown
          className={cn(
            'text-muted-foreground mt-0.5 h-4 w-4 shrink-0 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && <div className='grid gap-4 border-t px-4 py-4'>{children}</div>}
    </section>
  );
}

export function PatientProfileInput({
  mode,
  selectedScenarioId,
  onModeChange,
  onScenarioChange,
  onCustomDataChange,
  onCustomValidityChange,
}: PatientProfileInputProps) {
  const activeScenario = getDiagnosisScenario(selectedScenarioId) ?? defaultReviewScenario;
  const form = useForm<QuestionnaireFormData>({
    resolver: zodResolver(questionnaireSchema),
    mode: 'onChange',
    defaultValues: getTuningScenarioData(activeScenario.id),
  });
  const plannedNapDays = useWatch({
    control: form.control,
    name: 'daytime.plannedNaps.daysPerWeek',
  });
  const sleepinessInterferes = useWatch({
    control: form.control,
    name: 'daytime.sleepinessInterferes',
  });
  const legCramps = useWatch({
    control: form.control,
    name: 'restlessLegs.legCramps',
  });
  const nightmareCount = useWatch({
    control: form.control,
    name: 'nightmares.nightmaresPerWeek',
  });
  const badDreamCount = useWatch({
    control: form.control,
    name: 'nightmares.badDreamsPerWeek',
  });
  const watchedValues = useWatch({ control: form.control });

  useEffect(() => {
    const nextData = getTuningScenarioData(activeScenario.id);
    form.reset(nextData);
    onCustomDataChange(nextData);
  }, [activeScenario.id, form, onCustomDataChange]);

  useEffect(() => {
    onCustomDataChange(form.getValues());
  }, [form, onCustomDataChange, watchedValues]);

  useEffect(() => {
    onCustomValidityChange(form.formState.isValid);
  }, [form.formState.isValid, onCustomValidityChange]);

  useEffect(() => {
    const currentNapsPerWeek = form.getValues('daytime.plannedNaps.napsPerWeek');
    if (currentNapsPerWeek !== plannedNapDays) {
      form.setValue('daytime.plannedNaps.napsPerWeek', plannedNapDays);
    }

    if (plannedNapDays === 0 && form.getValues('daytime.plannedNaps.duration') !== null) {
      form.setValue('daytime.plannedNaps.duration', null);
    }
  }, [form, plannedNapDays]);

  useEffect(() => {
    const shouldShowNightmares = (nightmareCount ?? 0) > 0;
    if (form.getValues('nightmares.hasNightmares') !== shouldShowNightmares) {
      form.setValue('nightmares.hasNightmares', shouldShowNightmares);
    }
  }, [form, nightmareCount]);

  useEffect(() => {
    const shouldShowBadDreams = (badDreamCount ?? 0) > 0;
    if (form.getValues('nightmares.hasBadDreams') !== shouldShowBadDreams) {
      form.setValue('nightmares.hasBadDreams', shouldShowBadDreams);
    }
  }, [badDreamCount, form]);

  useEffect(() => {
    if (!sleepinessInterferes && form.getValues('daytime.sleepinessSeverity') !== null) {
      form.setValue('daytime.sleepinessSeverity', null);
    }
  }, [form, sleepinessInterferes]);

  useEffect(() => {
    if (!legCramps && form.getValues('restlessLegs.legCrampsPerWeek') !== null) {
      form.setValue('restlessLegs.legCrampsPerWeek', null);
    }
  }, [form, legCramps]);

  return (
    <Card className='border-primary/20 bg-card/80 shadow-sm'>
      <CardHeader className='space-y-4'>
        <div className='space-y-1'>
          <CardTitle className='text-xl'>Patient Profile Input</CardTitle>
          <CardDescription>
            Use a named scenario or edit the compact clinical input set directly.
          </CardDescription>
        </div>

        <div className='bg-background grid grid-cols-2 rounded-xl border p-1'>
          <Button
            variant={mode === 'scenario' ? 'default' : 'ghost'}
            className={cn('w-full', mode !== 'scenario' && 'text-muted-foreground')}
            onClick={() => {
              onModeChange('scenario');
            }}
          >
            Scenario Picker
          </Button>
          <Button
            variant={mode === 'custom' ? 'default' : 'ghost'}
            className={cn('w-full', mode !== 'custom' && 'text-muted-foreground')}
            onClick={() => {
              onModeChange('custom');
            }}
          >
            Custom Profile
          </Button>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='border-border/70 bg-background/70 space-y-3 rounded-2xl border p-4'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div className='space-y-1'>
              <p className='text-sm font-semibold'>Scenario</p>
              <p className='text-muted-foreground text-xs'>
                All custom edits start from the selected scenario data.
              </p>
            </div>
          </div>

          <div className='grid gap-3 md:grid-cols-[minmax(0,14rem)_1fr]'>
            <div className='space-y-2'>
              <label className='text-sm font-medium' htmlFor='tuning-scenario-select'>
                Named scenario
              </label>
              <select
                id='tuning-scenario-select'
                className='border-input bg-background ring-offset-background focus:ring-ring h-10 w-full rounded-md border px-3 text-sm focus:ring-2 focus:outline-none'
                value={activeScenario.id}
                onChange={event => {
                  onScenarioChange(event.target.value);
                }}
              >
                {diagnosisScenarios.map(scenario => (
                  <option key={scenario.id} value={scenario.id}>
                    {scenario.label}
                  </option>
                ))}
              </select>
            </div>

            <div className='border-border/70 bg-card/70 rounded-xl border p-4'>
              <p className='text-sm font-semibold'>{activeScenario.label}</p>
              <p className='text-muted-foreground mt-1 text-sm leading-relaxed'>
                {activeScenario.description}
              </p>
              <div className='mt-3 flex flex-wrap gap-2'>
                {TUNING_OUTCOME_FIELDS.filter(field => {
                  return activeScenario.expected[field.key] !== false && activeScenario.expected[field.key] !== 'none';
                }).map(field => (
                  <span
                    key={`${activeScenario.id}-${field.key}`}
                    className='bg-primary/10 text-primary rounded-full px-2.5 py-1 text-xs font-semibold'
                  >
                    {field.label}: {String(activeScenario.expected[field.key])}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {mode === 'custom' ? (
          <Form {...form}>
            <form className='space-y-4'>
              <div className='rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-900'>
                Edit only the fields the algorithm actually uses. Hidden questionnaire fields keep
                the current scenario defaults so the payload stays valid.
              </div>

              <InputSection
                title='Demographics'
                description='These fields drive age and BMI risk calculations.'
                defaultOpen={true}
              >
                <div className='grid gap-4 md:grid-cols-2'>
                  <NumberField
                    control={form.control}
                    name='demographics.yearOfBirth'
                    label='Year of birth'
                    min={1900}
                    max={new Date().getFullYear() - 12}
                  />
                  <SelectField
                    control={form.control}
                    name='demographics.sex'
                    label='Sex'
                    options={sexOptions}
                  />
                  <NumberField
                    control={form.control}
                    name='demographics.weight'
                    label='Weight'
                    min={0}
                    description='Pounds'
                  />
                  <NumberField
                    control={form.control}
                    name='demographics.height'
                    label='Height'
                    min={0}
                    description='Inches'
                  />
                </div>
              </InputSection>

              <InputSection
                title='Scheduled Sleep'
                description='Weekday sleep timing and sleep continuity.'
              >
                <div className='grid gap-4 md:grid-cols-2'>
                  <TimeInputField
                    control={form.control}
                    name='scheduledSleep.lightsOutTime'
                    label='Lights out'
                  />
                  <TimeInputField
                    control={form.control}
                    name='scheduledSleep.wakeupTime'
                    label='Wake time'
                  />
                  <SelectField
                    control={form.control}
                    name='scheduledSleep.minutesToFallAsleep'
                    label='Sleep onset latency'
                    options={minuteIncrementOptions}
                  />
                  <SelectField
                    control={form.control}
                    name='scheduledSleep.minutesAwakeAtNight'
                    label='Wake after sleep onset'
                    options={minuteIncrementOptions}
                  />
                </div>
              </InputSection>

              <InputSection
                title='Unscheduled Sleep'
                description='Weekend or free-day timing and sleep continuity.'
              >
                <div className='grid gap-4 md:grid-cols-2'>
                  <TimeInputField
                    control={form.control}
                    name='unscheduledSleep.lightsOutTime'
                    label='Lights out'
                  />
                  <TimeInputField
                    control={form.control}
                    name='unscheduledSleep.wakeupTime'
                    label='Wake time'
                  />
                  <SelectField
                    control={form.control}
                    name='unscheduledSleep.minutesToFallAsleep'
                    label='Sleep onset latency'
                    options={minuteIncrementOptions}
                  />
                  <SelectField
                    control={form.control}
                    name='unscheduledSleep.minutesAwakeAtNight'
                    label='Wake after sleep onset'
                    options={minuteIncrementOptions}
                  />
                </div>
              </InputSection>

              <InputSection
                title='Daytime Symptoms'
                description='The main EDS, fatigue, pain, and narcolepsy screen inputs.'
              >
                <CheckboxArrayField
                  control={form.control}
                  name='daytime.fallAsleepDuring'
                  label='Dozing activities'
                  description='Check every activity where the patient falls asleep during a typical week.'
                  options={daytimeSleepOptions}
                />

                <div className='grid gap-4 md:grid-cols-2'>
                  <CheckboxField
                    control={form.control}
                    name='daytime.sleepinessInterferes'
                    label='Sleepiness interferes with daily activities'
                  />
                  <CheckboxField
                    control={form.control}
                    name='daytime.nonRestorativeSleep'
                    label='Sleep feels non-restorative'
                  />
                  <CheckboxField
                    control={form.control}
                    name='daytime.painAffectsSleep'
                    label='Pain affects sleep'
                  />
                  <CheckboxField
                    control={form.control}
                    name='daytime.jointMusclePain'
                    label='Joint or muscle pain is present'
                  />
                  <CheckboxField
                    control={form.control}
                    name='daytime.diagnosedNarcolepsy'
                    label='Already diagnosed with narcolepsy'
                  />
                  <CheckboxField
                    control={form.control}
                    name='daytime.sleepParalysis'
                    label='Sleep paralysis present'
                  />
                </div>

                {sleepinessInterferes && (
                  <NumberField
                    control={form.control}
                    name='daytime.sleepinessSeverity'
                    label='Sleepiness severity'
                    min={1}
                    max={10}
                  />
                )}

                <div className='grid gap-4 md:grid-cols-2'>
                  <NumberField
                    control={form.control}
                    name='daytime.plannedNaps.daysPerWeek'
                    label='Planned naps days per week'
                    min={0}
                    max={7}
                  />
                  {plannedNapDays > 0 && (
                    <SelectField
                      control={form.control}
                      name='daytime.plannedNaps.duration'
                      label='Planned nap duration'
                      options={minuteIncrementOptions}
                    />
                  )}
                  <NumberField
                    control={form.control}
                    name='daytime.tirednessRating'
                    label='Tiredness rating'
                    min={1}
                    max={10}
                  />
                  <NumberField
                    control={form.control}
                    name='daytime.fatigueRating'
                    label='Fatigue rating'
                    min={1}
                    max={10}
                  />
                </div>

                <CheckboxArrayField
                  control={form.control}
                  name='daytime.weaknessWhenExcited'
                  label='Weakness when excited'
                  description='Cataplexy-type indicators used by the narcolepsy screen.'
                  options={weaknessOptions}
                />
              </InputSection>

              <InputSection
                title='Breathing'
                description='Core sleep apnea and respiratory disturbance indicators.'
              >
                <div className='grid gap-4 md:grid-cols-3'>
                  <CheckboxField
                    control={form.control}
                    name='breathingDisorders.snores'
                    label='Snoring'
                  />
                  <CheckboxField
                    control={form.control}
                    name='breathingDisorders.stopsBreathing'
                    label='Witnessed breathing pauses'
                  />
                  <CheckboxField
                    control={form.control}
                    name='breathingDisorders.mouthBreathes'
                    label='Mouth breathing'
                  />
                </div>
              </InputSection>

              <InputSection
                title='Restless Legs'
                description='RLS and leg cramp pathway inputs.'
              >
                <div className='grid gap-4 md:grid-cols-2'>
                  <CheckboxField
                    control={form.control}
                    name='restlessLegs.troubleLyingStill'
                    label='Trouble lying still'
                  />
                  <CheckboxField
                    control={form.control}
                    name='restlessLegs.urgeToMoveLegs'
                    label='Urge to move legs'
                  />
                  <CheckboxField
                    control={form.control}
                    name='restlessLegs.movementRelieves'
                    label='Movement relieves symptoms'
                  />
                  <CheckboxField
                    control={form.control}
                    name='restlessLegs.legCramps'
                    label='Nocturnal leg cramps'
                  />
                </div>

                {legCramps && (
                  <NumberField
                    control={form.control}
                    name='restlessLegs.legCrampsPerWeek'
                    label='Leg cramp nights per week'
                    min={0}
                    max={7}
                  />
                )}
              </InputSection>

              <InputSection
                title='Nightmares'
                description='Counts only; the related booleans are derived automatically.'
              >
                <div className='grid gap-4 md:grid-cols-2'>
                  <NumberField
                    control={form.control}
                    name='nightmares.nightmaresPerWeek'
                    label='Nightmares per week'
                    min={0}
                    max={7}
                  />
                  <NumberField
                    control={form.control}
                    name='nightmares.badDreamsPerWeek'
                    label='Bad dreams per week'
                    min={0}
                    max={7}
                  />
                </div>
              </InputSection>

              <InputSection
                title='Medications'
                description='Relevant medications and comorbid conditions for the medication-related pathway.'
              >
                <CheckboxArrayField
                  control={form.control}
                  name='sleepHygiene.supplements'
                  label='Sleep-affecting supplements'
                  options={supplementOptions}
                />
                <CheckboxArrayField
                  control={form.control}
                  name='sleepHygiene.prescriptionMeds'
                  label='Sleep-affecting prescription medications'
                  options={prescriptionOptions}
                />
                <CheckboxArrayField
                  control={form.control}
                  name='mentalHealth.diagnosedMentalHealthConditions'
                  label='Mental health diagnoses'
                  options={mentalHealthOptions}
                />
                <CheckboxArrayField
                  control={form.control}
                  name='mentalHealth.diagnosedMedicalConditions'
                  label='Relevant medical conditions'
                  options={medicalConditionOptions}
                />
              </InputSection>
            </form>
          </Form>
        ) : (
          <div className='border-border/70 bg-background/70 space-y-4 rounded-2xl border p-4'>
            <p className='text-sm leading-relaxed'>
              Scenario mode uses the fixed scenario payload directly. Choose a named example above to
              re-run the algorithm instantly without touching the reduced clinical form.
            </p>
            <div className='grid gap-3 md:grid-cols-2'>
              {TUNING_OUTCOME_FIELDS.map(field => (
                <div
                  key={field.key}
                  className='border-border/70 bg-card/70 flex items-center justify-between rounded-xl border px-3 py-2 text-sm'
                >
                  <span className='text-muted-foreground'>{field.label}</span>
                  <span className='font-medium'>{String(activeScenario.expected[field.key])}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
