import { UseFormReturn } from 'react-hook-form';
import { QuestionnaireFormData } from '@/validations/questionnaire';
import { CheckboxField } from '../form-fields/CheckboxField';
import { NumberField } from '../form-fields/NumberField';
import { RadioGroupField } from '../form-fields/RadioGroupField';
import { SelectField } from '../form-fields/SelectField';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Sun } from 'lucide-react';

interface DaytimeSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

const fallAsleepOptions = [
  { value: 'stoplight', label: 'Stopped at a stop light', weight: 2 },
  { value: 'lectures', label: 'During lectures or work meetings', weight: 1 },
  { value: 'working', label: 'While working or studying', weight: 1 },
  { value: 'conversation', label: 'During a conversation', weight: 2 },
  { value: 'evening', label: 'While engaged in a quiet activity during the evening', weight: 1 },
  { value: 'meal', label: 'While eating a meal', weight: 2 },
];

const weaknessOptions = [
  { value: 'feel_weak', label: 'I feel weak' },
  { value: 'brace_myself', label: 'I have to brace myself so that I do not fall' },
  { value: 'fallen', label: 'I have fallen down' },
];

export function DaytimeSection({ form }: DaytimeSectionProps) {
  return (
    <div className='space-y-8'>
      <div className='flex items-center gap-3'>
        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600'>
          <Sun className='h-5 w-5' />
        </div>
        <div>
          <p className='text-foreground text-lg font-semibold'>Daytime Experience</p>
          <p className='text-muted-foreground text-sm'>
            Please tell us about how you feel during the day
          </p>
        </div>
      </div>

      {/* Planned naps */}
      <div className='border-border/60 bg-card/50 space-y-4 rounded-xl border p-5'>
        <h3 className='text-muted-foreground text-sm font-semibold tracking-wide uppercase'>
          Planned Naps
        </h3>

        <NumberField
          control={form.control}
          name='daytime.plannedNaps.daysPerWeek'
          label='I take planned naps how many days per week?'
          min={0}
          max={7}
          placeholder='0-7'
        />

        {form.watch('daytime.plannedNaps.daysPerWeek') > 0 && (
          <SelectField
            control={form.control}
            name='daytime.plannedNaps.duration'
            label='How long are your naps typically?'
            options={[
              { value: '0-10', label: '0-10 minutes' },
              { value: '15-30', label: '15-30 minutes' },
              { value: '30-90', label: '30-90 minutes' },
              { value: '>90', label: 'Longer than 90 minutes' },
            ]}
          />
        )}
      </div>

      {/* Fall asleep during activities */}
      <div className='border-border/60 bg-card/50 space-y-4 rounded-xl border p-5'>
        <FormField
          control={form.control}
          name='daytime.fallAsleepDuring'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-base font-medium'>
                During a typical week, how often do you fall asleep while:
              </FormLabel>
              <p className='text-muted-foreground text-sm'>Check all that apply</p>
              <div className='mt-3 space-y-2'>
                {fallAsleepOptions.map(option => (
                  <FormItem
                    key={option.value}
                    className='hover:bg-muted/50 has-[[data-state=checked]]:border-primary/20 has-[[data-state=checked]]:bg-primary/5 flex flex-row items-center space-y-0 space-x-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors'
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(option.value)}
                        onCheckedChange={checked => {
                          return checked
                            ? field.onChange([...field.value, option.value])
                            : field.onChange(
                                field.value?.filter((value: string) => value !== option.value)
                              );
                        }}
                      />
                    </FormControl>
                    <FormLabel className='text-foreground/90 cursor-pointer font-normal'>
                      {option.label}
                    </FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Tiredness interferes */}
      <CheckboxField
        control={form.control}
        name='daytime.tirednessInterferes'
        label='My tiredness interferes with my daily activities'
      />

      {/* Tiredness severity scale - only show if tiredness interferes */}
      {form.watch('daytime.tirednessInterferes') && (
        <div className='border-border/60 bg-card/50 space-y-4 rounded-xl border p-5'>
          <FormField
            control={form.control}
            name='daytime.tirednessSeverity'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base font-medium'>
                  How severe is the interference?
                </FormLabel>
                <FormDescription className='text-muted-foreground'>
                  1 = a nuisance, 10 = a safety concern (e.g., sleep-related accidents)
                </FormDescription>
                <div className='pt-6 pb-2'>
                  <div className='text-muted-foreground mb-4 flex justify-between text-xs font-medium'>
                    <span>1 - Nuisance</span>
                    <span>5 - Moderate</span>
                    <span>10 - Safety Concern</span>
                  </div>
                  <FormControl>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={field.value ? [field.value] : [5]}
                      onValueChange={value => field.onChange(value[0])}
                      className='w-full'
                    />
                  </FormControl>
                  <div className='mt-4 text-center'>
                    <span className='bg-primary/10 text-primary inline-flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold'>
                      {field.value ?? 5}
                    </span>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Critical safety warning for severity > 8 */}
          {(form.watch('daytime.tirednessSeverity') ?? 0) > 8 && (
            <Alert className='border-red-200/80 bg-red-50/80'>
              <AlertTriangle className='h-5 w-5 text-red-600' />
              <AlertDescription className='text-red-900'>
                <strong className='mb-2 block text-red-700'>Important Safety Warning</strong>
                You should seek immediate help from a healthcare professional. Until you have done
                so, you should consider avoiding potentially dangerous activities such as driving,
                biking, or jobs involving high-risk activities like construction or operating heavy
                equipment.
                <br />
                <br />
                <strong className='text-red-700'>The good news</strong> is that there are many
                fast-acting and safe treatments for excessive daytime sleepiness that may put you or
                others at risk of injury.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Tired but can't sleep - only show if severity is 6 or less */}
      {form.watch('daytime.tirednessInterferes') &&
        (form.watch('daytime.tirednessSeverity') ?? 5) <= 6 && (
          <RadioGroupField
            control={form.control}
            name='daytime.tiredButCantSleep'
            label='I feel tired but cannot fall asleep:'
            options={[
              { value: 'everyday', label: 'Everyday' },
              { value: '5+days', label: 'At least 5 days a week' },
              { value: '3-5days', label: 'Between 3 and 5 days a week' },
              { value: '1-3days', label: '1-3 days a week' },
              { value: '<1day', label: 'Less than 1 day a week' },
            ]}
          />
        )}

      {/* Dreams while falling asleep */}
      <CheckboxField
        control={form.control}
        name='daytime.dreamsWhileFallingAsleep'
        label='I regularly have dreams while falling asleep or during daytime naps'
        description='This may be related to narcolepsy or sleep deprivation'
      />

      {/* Weakness when excited */}
      <div className='border-border/60 bg-card/50 space-y-4 rounded-xl border p-5'>
        <FormField
          control={form.control}
          name='daytime.weaknessWhenExcited'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-base font-medium'>When I laugh or feel excited:</FormLabel>
              <p className='text-muted-foreground text-sm'>Check all that apply</p>
              <div className='mt-3 space-y-2'>
                {weaknessOptions.map(option => (
                  <FormItem
                    key={option.value}
                    className='hover:bg-muted/50 has-[[data-state=checked]]:border-primary/20 has-[[data-state=checked]]:bg-primary/5 flex flex-row items-center space-y-0 space-x-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors'
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(option.value)}
                        onCheckedChange={checked => {
                          return checked
                            ? field.onChange([...field.value, option.value])
                            : field.onChange(
                                field.value?.filter((value: string) => value !== option.value)
                              );
                        }}
                      />
                    </FormControl>
                    <FormLabel className='text-foreground/90 cursor-pointer font-normal'>
                      {option.label}
                    </FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Sleep paralysis */}
      <CheckboxField
        control={form.control}
        name='daytime.sleepParalysis'
        label='I sometimes wake up and feel like my body is paralyzed'
        description='This may be related to narcolepsy or sleep disorders'
      />

      {/* Diagnosed narcolepsy */}
      <CheckboxField
        control={form.control}
        name='daytime.diagnosedNarcolepsy'
        label='Have you been diagnosed with narcolepsy or hypersomnia?'
        description='E.g., idiopathic, post viral, post concussion'
      />

      {/* Pain and Chronic Fatigue Screening */}
      <div className='border-border/60 bg-card/50 space-y-4 rounded-xl border p-5'>
        <h3 className='text-muted-foreground text-sm font-semibold tracking-wide uppercase'>
          Pain and Energy Levels
        </h3>

        <CheckboxField
          control={form.control}
          name='daytime.nonRestorativeSleep'
          label="My sleep does not feel restorative - I wake up tired even after a full night's sleep"
          description='Non-restorative sleep can indicate underlying conditions'
        />

        <CheckboxField
          control={form.control}
          name='daytime.painAffectsSleep'
          label='Pain affects my ability to fall asleep or stay asleep'
        />

        {form.watch('daytime.painAffectsSleep') && (
          <FormField
            control={form.control}
            name='daytime.painSeverity'
            render={({ field }) => (
              <FormItem className='bg-muted/30 rounded-lg p-4'>
                <FormLabel className='font-medium'>
                  How severe is your pain on a scale of 1-10?
                </FormLabel>
                <FormDescription className='text-muted-foreground'>
                  1 = minimal, 10 = worst pain imaginable
                </FormDescription>
                <div className='pt-6 pb-2'>
                  <div className='text-muted-foreground mb-4 flex justify-between text-xs font-medium'>
                    <span>1 - Minimal</span>
                    <span>5 - Moderate</span>
                    <span>10 - Severe</span>
                  </div>
                  <FormControl>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={field.value ? [field.value] : [5]}
                      onValueChange={value => field.onChange(value[0])}
                      className='w-full'
                    />
                  </FormControl>
                  <div className='mt-4 text-center'>
                    <span className='bg-primary/10 text-primary inline-flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold'>
                      {field.value ?? 5}
                    </span>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <CheckboxField
          control={form.control}
          name='daytime.muscleJointPain'
          label='I experience muscle or joint pain that contributes to my fatigue'
          description='This may be associated with fibromyalgia or other conditions'
        />
      </div>

      {/* Chronic Fatigue Screening Warning */}
      {form.watch('daytime.nonRestorativeSleep') &&
        form.watch('daytime.muscleJointPain') &&
        form.watch('daytime.tirednessInterferes') && (
          <Alert className='border-amber-200/80 bg-amber-50/80'>
            <AlertTriangle className='h-4 w-4 text-amber-600' />
            <AlertDescription className='text-amber-900/90'>
              <strong className='text-amber-800'>Potential Chronic Fatigue Symptoms</strong>
              <br />
              You have endorsed symptoms of non-restorative sleep, muscle/joint pain, and daytime
              tiredness. These are all symptoms that can be associated with fibromyalgia, chronic
              fatigue syndrome, post-viral illness (e.g., long COVID), or Lyme disease. We suggest
              discussing these symptoms with your primary care doctor who may refer you to a
              rheumatologist or other specialist.
            </AlertDescription>
          </Alert>
        )}
    </div>
  );
}
