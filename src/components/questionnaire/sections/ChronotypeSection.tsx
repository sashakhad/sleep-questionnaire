import { UseFormReturn } from 'react-hook-form';
import { QuestionnaireFormData } from '@/validations/questionnaire';
import { CheckboxField } from '../form-fields/CheckboxField';
import { RadioGroupField } from '../form-fields/RadioGroupField';
import { NumberField } from '../form-fields/NumberField';
import { TimeField } from '../form-fields/TimeField';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, Info } from 'lucide-react';

interface ChronotypeSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

export function ChronotypeSection({ form }: ChronotypeSectionProps) {
  const shiftWork = form.watch('chronotype.shiftWork');
  const pastShiftWorkYears = form.watch('chronotype.pastShiftWorkYears');
  const preference = form.watch('chronotype.preference');

  return (
    <div className='space-y-6'>
      <div className='text-lg font-medium'>Sleep Schedule Preferences</div>

      <Alert className='alert-info'>
        <Clock className='text-primary h-4 w-4' />
        <AlertDescription className='text-foreground/90'>
          Your natural sleep preferences (chronotype) can significantly impact your sleep quality
          when they don&apos;t align with your work or school schedule.
        </AlertDescription>
      </Alert>

      {/* Chronotype preference */}
      <RadioGroupField
        control={form.control}
        name='chronotype.preference'
        label='What is your natural sleep preference?'
        options={[
          { value: 'early', label: 'Go to bed early and wake up early (morning person)' },
          { value: 'late', label: 'Go to bed late and wake up late (night owl)' },
          { value: 'flexible', label: 'I have no preference and have a flexible sleep schedule' },
        ]}
      />

      {/* Preference strength - only show if early or late preference */}
      {(preference === 'early' || preference === 'late') && (
        <div className='border-border bg-card/50 space-y-4 rounded-xl border p-5'>
          <RadioGroupField
            control={form.control}
            name='chronotype.preferenceStrength'
            label={`How strong is your ${preference === 'early' ? 'morning' : 'night owl'} preference?`}
            options={[
              { value: 'slight', label: 'Slight - I have a mild preference' },
              { value: 'moderate', label: 'Moderate - It affects my daily schedule' },
              { value: 'strong', label: 'Strong - It significantly impacts my lifestyle' },
            ]}
          />
        </div>
      )}

      {/* Shift work */}
      <CheckboxField
        control={form.control}
        name='chronotype.shiftWork'
        label='My job requires me to do shift work'
      />

      {/* Shift work details - nested under shift work checkbox */}
      {shiftWork && (
        <div className='border-border bg-card/50 space-y-4 rounded-xl border p-5'>
          <FormField
            control={form.control}
            name='chronotype.shiftType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>What type of shift do you work?</FormLabel>
                <FormControl>
                  <Input placeholder='e.g., rotating, evenings, graveyard...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <NumberField
            control={form.control}
            name='chronotype.shiftDaysPerWeek'
            label='How many days a week do you work shifts?'
            placeholder='0-7'
            min={0}
            max={7}
          />
        </div>
      )}

      {/* Past shift work - only show if NOT currently doing shift work */}
      {!shiftWork && (
        <NumberField
          control={form.control}
          name='chronotype.pastShiftWorkYears'
          label="If you don't currently do shift work, how many years did you do shift work in the past?"
          placeholder='Years'
          min={0}
          max={50}
          description='Enter 0 if you never did shift work'
        />
      )}

      {/* Time zone travel */}
      <CheckboxField
        control={form.control}
        name='chronotype.frequentTimeZoneTravel'
        label='I travel across time zones more than 1 time a month'
        description='Frequent jet lag can disrupt your circadian rhythm'
      />

      {/* Work/school schedule - only show when user has a set schedule preference */}
      {(preference === 'early' || preference === 'late' || shiftWork) && (
        <TimeField
          control={form.control}
          name='chronotype.workSchoolTime'
          label='On scheduled/work/school days, what time do you have to be at work/school?'
          defaultPeriod='AM'
          description='Leave blank if your schedule varies significantly'
        />
      )}

      {/* Delayed Sleep Phase Syndrome warning */}
      {preference === 'late' && (
        <Alert className='alert-warning'>
          <Info className='h-4 w-4 text-amber-600' />
          <AlertDescription className='text-amber-900'>
            <strong>Night Owl Chronotype</strong>
            <br />
            You have a late chronotype preference. Difficulty waking in the morning, daytime
            tiredness and difficulty falling asleep are symptoms of Delayed Sleep Phase Syndrome.
            This is particularly common between ages 12-25 but can affect all ages. Consider
            consulting with a sleep specialist if these issues impact your daily functioning. More
            details will be provided in the report with links to education and recommendations on
            our website.
          </AlertDescription>
        </Alert>
      )}

      {/* Advanced Sleep Phase Syndrome info */}
      {preference === 'early' && (
        <Alert>
          <Clock className='h-4 w-4' />
          <AlertDescription>
            <strong>Morning Person Chronotype</strong>
            <br />
            You have an early chronotype preference. Waking earlier than desired and experiencing
            evening sleepiness that interferes with activities are symptoms of Advanced Sleep Phase
            Syndrome. These may increase after the age of 55. More details will be provided in the
            report with links to education and recommendations on our website.
          </AlertDescription>
        </Alert>
      )}

      {/* Shift work warning */}
      {(shiftWork || (pastShiftWorkYears !== null && pastShiftWorkYears !== undefined && pastShiftWorkYears > 0)) && (
        <Alert className='alert-warning'>
          <Clock className='h-4 w-4 text-amber-600' />
          <AlertDescription className='text-amber-900'>
            <strong>Shift Work Impact</strong>
            <br />
            Shift work can significantly disrupt your circadian rhythm and sleep quality. This can
            lead to increased risk of various health issues. If you&apos;re experiencing sleep
            difficulties related to shift work, specialized strategies and possibly medical
            consultation may help improve your sleep.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
