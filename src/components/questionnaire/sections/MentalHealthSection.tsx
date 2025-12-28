import { UseFormReturn } from 'react-hook-form';
import { QuestionnaireFormData } from '@/validations/questionnaire';
import { CheckboxField } from '../form-fields/CheckboxField';
import { RadioGroupField } from '../form-fields/RadioGroupField';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, AlertCircle, Heart, Stethoscope } from 'lucide-react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

interface MentalHealthSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

// Medical conditions that can affect sleep
const medicalConditions = [
  { value: 'hypertension', label: 'High blood pressure' },
  { value: 'heart_disease', label: 'Heart disease' },
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'thyroid', label: 'Thyroid disorder' },
  { value: 'gerd', label: 'GERD / Acid reflux' },
  { value: 'asthma', label: 'Asthma / COPD' },
  { value: 'chronic_pain', label: 'Chronic pain condition' },
  { value: 'arthritis', label: 'Arthritis' },
  { value: 'neurological', label: "Neurological condition (Parkinson's, MS, etc.)" },
  { value: 'cancer', label: 'Cancer (current or past)' },
  { value: 'kidney', label: 'Kidney disease' },
  { value: 'other_medical', label: 'Other medical condition' },
];

// Mental health conditions that can affect sleep
const mentalHealthConditions = [
  { value: 'depression', label: 'Depression' },
  { value: 'anxiety', label: 'Anxiety disorder' },
  { value: 'ptsd', label: 'PTSD / Trauma' },
  { value: 'bipolar', label: 'Bipolar disorder' },
  { value: 'ocd', label: 'OCD' },
  { value: 'panic', label: 'Panic disorder' },
  { value: 'adhd', label: 'ADHD' },
  { value: 'substance', label: 'Substance use disorder' },
  { value: 'eating', label: 'Eating disorder' },
  { value: 'other_mental', label: 'Other mental health condition' },
];

export function MentalHealthSection({ form }: MentalHealthSectionProps) {
  const worriesAffectSleep = form.watch('mentalHealth.worriesAffectSleep');
  const anxietyInBed = form.watch('mentalHealth.anxietyInBed');
  const timeInBedTrying = form.watch('mentalHealth.timeInBedTrying');
  const cancelsAfterPoorSleep = form.watch('mentalHealth.cancelsAfterPoorSleep');

  const hasSignificantAnxiety = (worriesAffectSleep && anxietyInBed) || timeInBedTrying;
  const moderateToSevereInsomnia = cancelsAfterPoorSleep !== 'never';

  return (
    <div className='space-y-6'>
      <div className='text-lg font-medium'>Mental Health and Sleep</div>

      <Alert className='alert-info'>
        <Brain className='text-primary h-4 w-4' />
        <AlertDescription className='text-foreground/90'>
          Mental health and sleep have a bidirectional relationship. Anxiety and worry can prevent
          sleep, while poor sleep can worsen mental health symptoms. Understanding this connection
          helps us provide better support.
        </AlertDescription>
      </Alert>

      {/* Worries about next day */}
      <CheckboxField
        control={form.control}
        name='mentalHealth.worriesAffectSleep'
        label='Worries about the next day often contribute to my difficulty falling asleep or extend my nighttime awakenings'
      />

      {/* Anxiety in bed */}
      <CheckboxField
        control={form.control}
        name='mentalHealth.anxietyInBed'
        label='I have anxiety or persistent rumination while in bed at night'
        description='Racing thoughts, worry loops, or inability to quiet your mind'
      />

      {/* Time in bed trying */}
      <CheckboxField
        control={form.control}
        name='mentalHealth.timeInBedTrying'
        label='I spend time in bed trying to sleep'
        description='Lying awake for extended periods hoping sleep will come'
      />

      {/* Cancel activities */}
      <RadioGroupField
        control={form.control}
        name='mentalHealth.cancelsAfterPoorSleep'
        label='How often do you cancel activities following a night of poor sleep?'
        options={[
          { value: 'never', label: 'Never' },
          { value: '1-2week', label: '1-2 times a week' },
          { value: '3+week', label: '3 or more times a week' },
        ]}
      />

      {/* Medical History Section */}
      <div className='border-border bg-card/50 space-y-4 rounded-xl border p-5'>
        <div className='flex items-center space-x-2'>
          <Stethoscope className='text-primary h-5 w-5' />
          <h3 className='text-muted-foreground text-sm font-semibold tracking-wide uppercase'>
            Medical History
          </h3>
        </div>
        <FormField
          control={form.control}
          name='mentalHealth.diagnosedMedicalConditions'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-base'>
                Have you been diagnosed or are being treated for any of the following medical
                conditions? (check all that apply)
              </FormLabel>
              <FormDescription>These conditions can affect sleep quality</FormDescription>
              <div className='mt-2 grid grid-cols-1 gap-2 md:grid-cols-2'>
                {medicalConditions.map(condition => (
                  <FormItem
                    key={condition.value}
                    className='flex flex-row items-start space-y-0 space-x-3'
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(condition.value)}
                        onCheckedChange={checked => {
                          return checked
                            ? field.onChange([...field.value, condition.value])
                            : field.onChange(
                                field.value?.filter((value: string) => value !== condition.value)
                              );
                        }}
                      />
                    </FormControl>
                    <FormLabel className='text-sm font-normal'>{condition.label}</FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Mental Health History Section */}
      <div className='border-border bg-card/50 space-y-4 rounded-xl border p-5'>
        <div className='flex items-center space-x-2'>
          <Brain className='h-5 w-5 text-purple-600' />
          <h3 className='text-muted-foreground text-sm font-semibold tracking-wide uppercase'>
            Mental Health History
          </h3>
        </div>
        <FormField
          control={form.control}
          name='mentalHealth.diagnosedMentalHealthConditions'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-base'>
                Have you been diagnosed or are being treated for any of the following mental health
                conditions? (check all that apply)
              </FormLabel>
              <FormDescription>Mental health conditions often impact sleep</FormDescription>
              <div className='mt-2 grid grid-cols-1 gap-2 md:grid-cols-2'>
                {mentalHealthConditions.map(condition => (
                  <FormItem
                    key={condition.value}
                    className='flex flex-row items-start space-y-0 space-x-3'
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(condition.value)}
                        onCheckedChange={checked => {
                          return checked
                            ? field.onChange([...field.value, condition.value])
                            : field.onChange(
                                field.value?.filter((value: string) => value !== condition.value)
                              );
                        }}
                      />
                    </FormControl>
                    <FormLabel className='text-sm font-normal'>{condition.label}</FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Currently receiving treatment */}
        <CheckboxField
          control={form.control}
          name='mentalHealth.currentlyReceivingTreatment'
          label='I am currently receiving treatment for one or more of these conditions'
          description='Includes medication, therapy, or other treatment'
        />
      </div>

      {/* Sleep anxiety warning */}
      {hasSignificantAnxiety && (
        <Alert className='alert-warning'>
          <Brain className='h-4 w-4 text-amber-600' />
          <AlertDescription className='text-amber-900'>
            <strong>Sleep-Related Anxiety Detected</strong>
            <br />
            It&apos;s likely that your anxiety related to sleep is interfering with your ability to
            surrender to sleep at night. This creates a vicious cycle where worry about sleep
            prevents sleep, which increases worry. Consider these strategies:
            <ul className='mt-2 list-inside list-disc space-y-1'>
              <li>
                Practice relaxation techniques before bed (deep breathing, progressive muscle
                relaxation)
              </li>
              <li>
                Keep a worry journal - write down concerns before bed to &quot;park&quot; them
              </li>
              <li>Limit time in bed when not sleeping (get up after 20 minutes if awake)</li>
              <li>Consider Cognitive Behavioral Therapy for Insomnia (CBT-I)</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Moderate to severe insomnia */}
      {moderateToSevereInsomnia && (
        <Alert className='alert-danger'>
          <AlertCircle className='h-4 w-4 text-red-600' />
          <AlertDescription className='text-red-900'>
            <strong>Significant Sleep Impact on Daily Life</strong>
            <br />
            Your sleep difficulties are significantly impacting your daily functioning. This level
            of impairment suggests moderate to severe insomnia that warrants professional
            evaluation. We strongly recommend consulting with a sleep specialist or mental health
            professional who can provide targeted treatment.
          </AlertDescription>
        </Alert>
      )}

      {/* Performance anxiety */}
      {timeInBedTrying && (
        <Alert>
          <Brain className='h-4 w-4' />
          <AlertDescription>
            <strong>Sleep Effort Paradox</strong>
            <br />
            The harder you try to sleep, the more elusive it becomes. Sleep is a passive process
            that cannot be forced. Instead of &quot;trying&quot; to sleep:
            <ul className='mt-2 list-inside list-disc space-y-1'>
              <li>Focus on relaxation rather than sleep</li>
              <li>If not asleep within 20 minutes, get up and do a quiet activity</li>
              <li>Return to bed only when genuinely sleepy</li>
              <li>Use your bed only for sleep and intimacy, not for worrying</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Positive message for those without issues */}
      {!worriesAffectSleep &&
        !anxietyInBed &&
        !timeInBedTrying &&
        cancelsAfterPoorSleep === 'never' && (
          <Alert className='alert-success'>
            <Heart className='h-4 w-4 text-green-600' />
            <AlertDescription className='text-green-900'>
              <strong>Good Mental Sleep Health!</strong>
              <br />
              You don&apos;t appear to have significant anxiety or worry related to sleep. This is
              excellent as it means your mind isn&apos;t creating barriers to natural sleep.
              Continue maintaining this healthy relationship with sleep.
            </AlertDescription>
          </Alert>
        )}

      {/* General mental health resources */}
      <Alert>
        <Brain className='h-4 w-4' />
        <AlertDescription>
          <strong>Mental Health Resources</strong>
          <br />
          If you&apos;re experiencing anxiety, depression, or other mental health concerns that
          affect your sleep, remember that help is available. Mental health professionals can
          provide evidence-based treatments that address both sleep and emotional well-being.
          Don&apos;t hesitate to reach out for support when needed.
        </AlertDescription>
      </Alert>
    </div>
  );
}
