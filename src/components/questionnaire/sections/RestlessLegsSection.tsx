import { UseFormReturn } from 'react-hook-form';
import { QuestionnaireFormData } from '@/validations/questionnaire';
import { CheckboxField } from '../form-fields/CheckboxField';
import { RadioGroupField } from '../form-fields/RadioGroupField';
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
import { AlertCircle, Info } from 'lucide-react';

interface RestlessLegsSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

const treatmentOptions = [
  { value: 'iron', label: 'Iron supplements' },
  { value: 'dopamine', label: 'Dopamine agonists' },
  { value: 'gabapentin', label: 'Gabapentin' },
  { value: 'other', label: 'Other medication' },
];

const rlsFrequencyOptions = [
  { value: 'every-night', label: 'Every night' },
  { value: 'most-nights', label: 'Most nights (4-6 per week)' },
  { value: 'some-nights', label: 'Some nights (1-3 per week)' },
  { value: 'rarely', label: 'Rarely (less than once a week)' },
];

const rlsOnsetTimeOptions = [
  { value: 'evening', label: 'Evening' },
  { value: 'bedtime', label: 'At bedtime' },
  { value: 'both', label: 'Both evening and bedtime' },
];

export function RestlessLegsSection({ form }: RestlessLegsSectionProps) {
  const diagnosed = form.watch('restlessLegs.diagnosed');
  const hardToLieStill = form.watch('restlessLegs.hardToLieStill');
  const movementRelieves = form.watch('restlessLegs.movementRelieves');
  const hasSymptoms = hardToLieStill && movementRelieves;

  return (
    <div className='space-y-6'>
      <div className='text-lg font-medium'>Movement Disorders</div>

      <Alert className='alert-info'>
        <Info className='h-4 w-4 text-primary' />
        <AlertDescription className='text-foreground/90'>
          Restless Legs Syndrome (RLS) and Periodic Limb Movements — Restless legs syndrome is a
          relatively common disorder that increases discomfort in bed and interferes with your
          ability to fall asleep. RLS can be associated with insufficient availability of dopamine,
          low levels of ferritin, pregnancy, or as an unwanted effect of some medications including
          SSRIs.
        </AlertDescription>
      </Alert>

      {/* Diagnosed with RLS */}
      <CheckboxField
        control={form.control}
        name='restlessLegs.diagnosed'
        label='Have you been diagnosed with restless legs syndrome (RLS) or periodic limb movement disorder?'
      />

      {/* If diagnosed, show treatment options */}
      {diagnosed && (
        <div className='border-border bg-card/50 space-y-4 rounded-xl border p-5'>
          <FormField
            control={form.control}
            name='restlessLegs.treatment'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base font-medium'>
                  Are you being treated for RLS?
                </FormLabel>
                <p className='text-muted-foreground text-sm'>Check all that apply</p>
                <div className='mt-3 space-y-2'>
                  {treatmentOptions.map(option => (
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
                <FormDescription className='text-muted-foreground mt-3'>
                  Common treatments include ferrous gluconate or ferrous sulfate supplementation for
                  individuals with ferritin levels below 75mcg/ml
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {/* RLS Symptoms */}
      <div className='space-y-4'>
        <h3 className='font-medium'>Please answer the following about your legs at bedtime:</h3>

        <CheckboxField
          control={form.control}
          name='restlessLegs.hardToLieStill'
          label='It is hard to sit still before bedtime and/or lie still when trying to fall asleep at night because of discomfort in my legs.'
        />

        <CheckboxField
          control={form.control}
          name='restlessLegs.movementRelieves'
          label='The discomfort in my legs is relieved when I stretch or move around.'
        />

        {/* Follow-up questions when both are checked */}
        {hasSymptoms && (
          <div className='border-border bg-card/50 space-y-4 rounded-xl border p-5'>
            <RadioGroupField
              control={form.control}
              name='restlessLegs.rlsFrequency'
              label='How often do you experience these symptoms?'
              options={rlsFrequencyOptions}
            />

            <FormField
              control={form.control}
              name='restlessLegs.rlsSeverity'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base font-medium'>
                    How severe are your symptoms?
                  </FormLabel>
                  <FormDescription className='text-muted-foreground'>
                    1 = Mild, 10 = Severe
                  </FormDescription>
                  <div className='pt-6 pb-2'>
                    <div className='text-muted-foreground mb-4 flex justify-between text-xs font-medium'>
                      <span>1 - Mild</span>
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

            <RadioGroupField
              control={form.control}
              name='restlessLegs.rlsOnsetTime'
              label='When do your symptoms typically begin?'
              options={rlsOnsetTimeOptions}
            />
          </div>
        )}

        <CheckboxField
          control={form.control}
          name='restlessLegs.daytimeDiscomfort'
          label='Do you have leg discomfort during the day?'
        />
      </div>

      {/* Warning message if symptoms but not diagnosed */}
      {!diagnosed && hasSymptoms && (
        <Alert className='alert-warning'>
          <AlertCircle className='h-4 w-4 text-amber-600' />
          <AlertDescription className='text-amber-900'>
            Your answers suggest that you may have restless legs syndrome. We strongly encourage you
            to discuss treatment options with your sleep specialist or primary care doctor. RLS is
            often exacerbated when someone is sleep deprived, using excessive caffeine, or
            experiencing increased stress.
          </AlertDescription>
        </Alert>
      )}

      {/* Info for diagnosed but not treated */}
      {diagnosed && form.watch('restlessLegs.treatment')?.length === 0 && (
        <Alert>
          <Info className='h-4 w-4' />
          <AlertDescription>
            You have been diagnosed with RLS but are not currently receiving treatment. Treatment
            can significantly improve your sleep quality. Consider discussing options with your
            healthcare provider.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
