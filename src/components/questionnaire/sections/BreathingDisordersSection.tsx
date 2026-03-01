import { UseFormReturn } from 'react-hook-form';
import { QuestionnaireFormData } from '@/validations/questionnaire';
import { CheckboxField } from '../form-fields/CheckboxField';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface BreathingDisordersSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

export function BreathingDisordersSection({ form }: BreathingDisordersSectionProps) {
  const mouthBreathes = form.watch('breathingDisorders.mouthBreathes');
  const snores = form.watch('breathingDisorders.snores');
  const stopsBreathing = form.watch('breathingDisorders.stopsBreathing');

  return (
    <div className='space-y-6'>
      <div className='text-lg font-medium'>Sleep Related Breathing Symptoms</div>

      <Alert className='alert-info'>
        <AlertCircle className='text-primary h-4 w-4' />
        <AlertDescription className='text-foreground/90'>
          Diagnosis and treatment of sleep related breathing disorders is exceedingly important as
          they contribute to significant health problems.
        </AlertDescription>
      </Alert>

      {/* Snoring */}
      <CheckboxField
        control={form.control}
        name='breathingDisorders.snores'
        label='I have been told that I snore'
      />

      {/* Stop breathing */}
      <CheckboxField
        control={form.control}
        name='breathingDisorders.stopsBreathing'
        label='I have been told that I stop breathing, snort or gasp for air during sleep'
        description='This is a serious symptom that should be evaluated'
      />

      {/* Mouth breathing */}
      <CheckboxField
        control={form.control}
        name='breathingDisorders.mouthBreathes'
        label='I mouth breathe'
      />

      {/* Dry mouth - only show if they mouth breathe */}
      {mouthBreathes && (
        <CheckboxField
          control={form.control}
          name='breathingDisorders.wakesWithDryMouth'
          label='I frequently wake up with a dry mouth'
        />
      )}

      {/* Warning message if symptoms detected */}
      {(snores || stopsBreathing) && (
        <Alert className='alert-warning'>
          <AlertCircle className='h-4 w-4 text-amber-600' />
          <AlertDescription className='text-amber-900'>
            Based on your responses, we will provide important information in the report which will
            include discussion of treatment options with your sleep specialist or primary care
            doctor. Sleep breathing disorders can significantly impact your health.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
