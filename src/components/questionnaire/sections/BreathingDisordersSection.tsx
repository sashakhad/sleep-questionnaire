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

export function BreathingDisordersSection({ form }: BreathingDisordersSectionProps) {
  const diagnosed = form.watch('breathingDisorders.diagnosed');
  const mouthBreathes = form.watch('breathingDisorders.mouthBreathes');

  return (
    <div className='space-y-6'>
      <div className='text-lg font-medium'>Sleep Related Breathing Disorders</div>

      <Alert className='border-blue-200 bg-blue-50'>
        <AlertCircle className='h-4 w-4 text-blue-600' />
        <AlertDescription className='text-blue-900'>
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
        <div className='border-border/60 bg-card/50 space-y-4 rounded-xl border p-5'>
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

      {/* Mouth breathing */}
      <CheckboxField
        control={form.control}
        name='breathingDisorders.mouthBreathes'
        label='Do you mouth breathe?'
      />

      {/* Dry mouth - only show if they mouth breathe */}
      {mouthBreathes && (
        <CheckboxField
          control={form.control}
          name='breathingDisorders.wakesWithDryMouth'
          label='Do you frequently wake up with a dry mouth?'
        />
      )}

      {/* Warning message if symptoms but not diagnosed */}
      {!diagnosed &&
        (form.watch('breathingDisorders.snores') ||
          form.watch('breathingDisorders.stopsBreathing')) && (
          <Alert className='border-amber-200 bg-amber-50'>
            <AlertCircle className='h-4 w-4 text-amber-600' />
            <AlertDescription className='text-amber-900'>
              Based on your responses, we recommend that you discuss treatment options with your
              sleep specialist or primary care doctor. Sleep breathing disorders can significantly
              impact your health.
            </AlertDescription>
          </Alert>
        )}
    </div>
  );
}
