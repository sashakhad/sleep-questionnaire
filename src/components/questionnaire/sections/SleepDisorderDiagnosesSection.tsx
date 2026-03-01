import { UseFormReturn } from 'react-hook-form';
import { QuestionnaireFormData } from '@/validations/questionnaire';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Stethoscope } from 'lucide-react';

interface SleepDisorderDiagnosesSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

const diagnosedDisorderOptions = [
  { value: 'narcolepsy', label: 'Narcolepsy' },
  { value: 'hypersomnia', label: 'Hypersomnia' },
  { value: 'insomnia', label: 'Insomnia' },
  { value: 'parasomnia', label: 'Parasomnia (sleepwalking or sleep terrors)' },
  { value: 'nocturnal_enuresis', label: 'Nocturnal enuresis (bedwetting)' },
  { value: 'circadian_rhythm', label: 'Circadian Rhythm Disorder' },
  { value: 'rls', label: 'Restless Legs Syndrome and/or Periodic Limb Movement Disorder' },
  { value: 'obstructive_sleep_apnea', label: 'Obstructive Sleep Apnea Syndrome' },
  { value: 'central_sleep_apnea', label: 'Central Sleep Apnea Syndrome' },
  { value: 'insufficient_sleep', label: 'Insufficient Sleep' },
  { value: 'rem_behavior_disorder', label: 'REM Behavior Disorder' },
];

export function SleepDisorderDiagnosesSection({ form }: SleepDisorderDiagnosesSectionProps) {
  return (
    <div className='space-y-6'>
      <div className='text-lg font-medium'>Sleep Disorder History</div>

      <Alert className='alert-info'>
        <Stethoscope className='text-primary h-4 w-4' />
        <AlertDescription className='text-foreground/90'>
          Please let us know if you have been diagnosed with any sleep disorders. This information
          helps us provide more accurate recommendations and understand your sleep health history.
        </AlertDescription>
      </Alert>

      {/* Diagnosed disorders checklist */}
      <div className='border-border bg-card/50 space-y-4 rounded-xl border p-5'>
        <FormField
          control={form.control}
          name='sleepDisorderDiagnoses.diagnosedDisorders'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-base'>
                Have you been diagnosed with any of the following? (check all that apply)
              </FormLabel>
              <div className='mt-2 grid grid-cols-1 gap-2 md:grid-cols-2'>
                {diagnosedDisorderOptions.map(option => (
                  <FormItem
                    key={option.value}
                    className='flex flex-row items-start space-y-0 space-x-3'
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(option.value)}
                        onCheckedChange={checked => {
                          return checked
                            ? field.onChange([...(field.value || []), option.value])
                            : field.onChange(
                                field.value?.filter((value: string) => value !== option.value)
                              );
                        }}
                      />
                    </FormControl>
                    <FormLabel className='text-sm font-normal'>{option.label}</FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Other diagnosis description */}
        <FormField
          control={form.control}
          name='sleepDisorderDiagnoses.otherDiagnosisDescription'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other diagnosis (please describe)</FormLabel>
              <FormControl>
                <Input placeholder='Enter any other diagnoses...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
