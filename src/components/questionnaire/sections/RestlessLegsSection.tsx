import { UseFormReturn } from 'react-hook-form';
import { QuestionnaireFormData } from '@/validations/questionnaire';
import { CheckboxField } from '../form-fields/CheckboxField';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';

interface RestlessLegsSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

export function RestlessLegsSection({ form }: RestlessLegsSectionProps) {
  const hasSymptoms =
    form.watch('restlessLegs.troubleLyingStill') ||
    form.watch('restlessLegs.urgeToMoveLegs') ||
    form.watch('restlessLegs.movementRelieves');

  return (
    <div className='space-y-6'>
      <div className='text-lg font-medium'>Restless Legs Syndrome (RLS) and Movement Disorders</div>

      <Alert className='alert-info'>
        <Info className='text-primary h-4 w-4' />
        <AlertDescription className='text-foreground/90'>
          Restless legs syndrome is a relatively common disorder that increases discomfort in bed
          and interferes with your ability to fall asleep. RLS can be associated with insufficient
          availability of dopamine, low levels of ferritin, pregnancy, or as an unwanted effect of
          some medications including SSRIs.
        </AlertDescription>
      </Alert>

      {/* RLS Symptoms */}
      <div className='space-y-4'>
        <h3 className='font-medium'>Please answer the following about your legs at bedtime:</h3>

        <CheckboxField
          control={form.control}
          name='restlessLegs.troubleLyingStill'
          label='I have trouble lying still while trying to fall asleep at night'
        />

        <CheckboxField
          control={form.control}
          name='restlessLegs.urgeToMoveLegs'
          label='I have an urge to move my legs while lying in bed at night'
        />

        <CheckboxField
          control={form.control}
          name='restlessLegs.movementRelieves'
          label='Movement relieves the uncomfortable feelings in my legs'
        />

        <CheckboxField
          control={form.control}
          name='restlessLegs.daytimeDiscomfort'
          label='I have leg discomfort during the day'
        />

        <CheckboxField
          control={form.control}
          name='restlessLegs.legCramps'
          label='I experience leg cramps at night'
          description='Painful muscle contractions in the legs during sleep'
        />
      </div>

      {/* Warning message if symptoms detected */}
      {hasSymptoms && (
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
    </div>
  );
}
