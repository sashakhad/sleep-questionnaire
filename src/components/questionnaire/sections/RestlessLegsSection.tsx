import { UseFormReturn } from 'react-hook-form';
import { QuestionnaireFormData } from '@/validations/questionnaire';
import { CheckboxField } from '../form-fields/CheckboxField';
import { NumberField } from '../form-fields/NumberField';
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

  const hasLegCramps = form.watch('restlessLegs.legCramps');
  const legCrampsPerWeek = form.watch('restlessLegs.legCrampsPerWeek') ?? 0;

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

        {/* Leg cramps frequency - only show if they have leg cramps */}
        {hasLegCramps && (
          <div className='bg-muted/30 rounded-lg p-4'>
            <NumberField
              control={form.control}
              name='restlessLegs.legCrampsPerWeek'
              label='How many nights per week do you experience leg cramps?'
              placeholder='0-7'
              min={0}
              max={7}
              description='Enter the average number of nights per week'
            />
          </div>
        )}
      </div>

      {/* Warning message if RLS symptoms detected */}
      {hasSymptoms && (
        <Alert className='alert-warning'>
          <AlertCircle className='h-4 w-4 text-amber-600' />
          <AlertDescription className='text-amber-900'>
            Your answers suggest that you may have restless legs syndrome. We will make additional
            recommendations in your report and provide specific guidance and treatment
            recommendations on our website.
          </AlertDescription>
        </Alert>
      )}

      {/* Leg cramps warning (2+ nights per week) */}
      {legCrampsPerWeek >= 2 && (
        <Alert className='alert-warning'>
          <AlertCircle className='h-4 w-4 text-amber-600' />
          <AlertDescription className='text-amber-900'>
            <strong>Frequent Nocturnal Leg Cramps</strong>
            <br />
            Your nocturnal leg cramps can be sleep disruptors and can be a sign of age, muscle
            fatigue, an electrolyte or other imbalance. They can be more common during pregnancy.
            Since these occur on two or more nights a week, we suggest that you discuss these
            symptoms with your primary care provider.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
