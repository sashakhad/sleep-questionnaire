import { UseFormReturn } from 'react-hook-form';
import { QuestionnaireFormData } from '@/validations/questionnaire';
import { CheckboxField } from '../form-fields/CheckboxField';
import { RadioGroupField } from '../form-fields/RadioGroupField';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface BreathingDisordersSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

const treatmentOptions = [
  { value: 'cpap', label: 'CPAP' },
  { value: 'dental', label: 'Dental appliance' },
  { value: 'other', label: 'Other treatment' },
];

const airwayCrowdingOptions = [
  { value: 'wisdom_teeth', label: 'Wisdom teeth extraction' },
  { value: 'orthodontics', label: 'Orthodontic treatment' },
  { value: 'tonsillectomy', label: 'Tonsillectomy' },
];

export function BreathingDisordersSection({ form }: BreathingDisordersSectionProps) {
  const diagnosed = form.watch('breathingDisorders.diagnosed');
  const snores = form.watch('breathingDisorders.snores');
  const stopsBreathing = form.watch('breathingDisorders.stopsBreathing');
  const wakesWithDryMouth = form.watch('breathingDisorders.wakesWithDryMouth');
  const mouthBreathesDay = form.watch('breathingDisorders.mouthBreathesDay');

  const showWarning =
    !diagnosed &&
    (snores ||
      stopsBreathing ||
      (wakesWithDryMouth && mouthBreathesDay));

  return (
    <div className='space-y-6'>
      <div className='text-lg font-medium'>Sleep Related Breathing Difficulties</div>

      <p className='text-muted-foreground text-sm'>
        Obstructive Sleep Apnea Syndrome and Central Sleep Apnea Syndrome are conditions where
        breathing is repeatedly interrupted during sleep. Risk factors include excess weight, large
        neck circumference, and anatomical features. Untreated sleep apnea can lead to high blood
        pressure, heart disease, stroke, and excessive daytime sleepiness.
      </p>

      <Alert className='alert-info'>
        <AlertCircle className='h-4 w-4 text-primary' />
        <AlertDescription className='text-foreground/90'>
          Diagnosis and treatment of sleep related breathing disorders is exceedingly important as
          they contribute to significant health problems.
        </AlertDescription>
      </Alert>

      {/* Diagnosed with sleep breathing disorder */}
      <CheckboxField
        control={form.control}
        name='breathingDisorders.diagnosed'
        label='Have you been diagnosed with a sleep related breathing disorder?'
        description='Such as obstructive sleep apnea, primary snoring, or central sleep apnea'
      />

      {/* If diagnosed, show severity and treatment */}
      {diagnosed && (
        <div className='border-border bg-card/50 space-y-4 rounded-xl border p-5'>
          <RadioGroupField
            control={form.control}
            name='breathingDisorders.severity'
            label='How severe is your condition?'
            options={[
              { value: 'mild', label: 'Mild' },
              { value: 'moderate', label: 'Moderate' },
              { value: 'severe', label: 'Severe' },
            ]}
          />

          <FormField
            control={form.control}
            name='breathingDisorders.treatment'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base font-medium'>
                  Are you being treated for your sleep breathing problem?
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {/* Snoring */}
      <CheckboxField
        control={form.control}
        name='breathingDisorders.snores'
        label='Have you been told that you snore?'
      />

      {/* Stop breathing */}
      <CheckboxField
        control={form.control}
        name='breathingDisorders.stopsBreathing'
        label='Have you been told that you stop breathing, snort or gasp for air during sleep?'
        description='This is a serious symptom that should be evaluated'
      />

      {/* Dry mouth - standalone */}
      <CheckboxField
        control={form.control}
        name='breathingDisorders.wakesWithDryMouth'
        label='I often wake up with a dry mouth'
      />

      {/* Mouth breathing during day */}
      <CheckboxField
        control={form.control}
        name='breathingDisorders.mouthBreathesDay'
        label='I typically breathe through my mouth during the day'
      />

      {/* Morning headache */}
      <CheckboxField
        control={form.control}
        name='breathingDisorders.morningHeadache'
        label='I often wake up with a headache in the morning'
      />

      {/* Airway crowding */}
      <FormField
        control={form.control}
        name='breathingDisorders.airwayCrowding'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-base font-medium'>
              Have you had any of the following? (check all that apply)
            </FormLabel>
            <div className='mt-3 space-y-2'>
              {airwayCrowdingOptions.map(option => (
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

      {/* Warning message if symptoms but not diagnosed */}
      {showWarning && (
        <Alert className='alert-warning'>
          <AlertCircle className='h-4 w-4 text-amber-600' />
          <AlertDescription className='text-amber-900'>
            Based on your response, you may have a sleep and breathing problem or disorder. We
            strongly recommend that you discuss this with your sleep specialist or primary care
            doctor.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
