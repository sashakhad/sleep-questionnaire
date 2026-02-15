import { UseFormReturn } from 'react-hook-form';
import { QuestionnaireFormData } from '@/validations/questionnaire';
import { CheckboxField } from '../form-fields/CheckboxField';
import { RadioGroupField } from '../form-fields/RadioGroupField';
import { NumberField } from '../form-fields/NumberField';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
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
  const timeZoneTravelPerYear = form.watch('chronotype.timeZoneTravelPerYear') ?? 0;

  return (
    <div className='space-y-6'>
      <div className='text-lg font-medium'>Sleep Schedule Preferences</div>

      <Alert className='alert-info'>
        <Clock className='h-4 w-4 text-primary' />
        <AlertDescription className='text-foreground/90'>
          Chronotype or Circadian Sleep Timing — Your natural sleep preferences (chronotype) can
          significantly impact your sleep quality when they don&apos;t align with your work or
          school schedule.
        </AlertDescription>
      </Alert>

      {/* Chronotype preference */}
      <RadioGroupField
        control={form.control}
        name='chronotype.preference'
        label='What is your natural sleep preference?'
        options={[
          {
            value: 'early',
            label:
              'Go to bed early and wake up early (bedtime 8:00 PM or earlier, wake time 4:00 AM or earlier)',
          },
          {
            value: 'late',
            label:
              'Go to bed late and wake up late (bedtime 12:00 AM or later, wake time 8:00 AM or later)',
          },
          {
            value: 'neutral',
            label: 'I have no preference for when I go to bed or wake up',
          },
        ]}
      />

      {/* Social jet lag */}
      <CheckboxField
        control={form.control}
        name='chronotype.socialJetLag'
        label='My work/school schedule requires me to go to bed and wake up at very different times than I would like (2 or more hours difference)'
      />

      {/* Shift work */}
      <CheckboxField
        control={form.control}
        name='chronotype.shiftWork'
        label='Does your job require you to do shift work?'
      />

      {/* Shift work details */}
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

      {/* Past shift work */}
      {!shiftWork && (
        <NumberField
          control={form.control}
          name='chronotype.pastShiftWorkYears'
          label="If you don't currently do shift work, how many years did you do shift work in the past?"
          placeholder='Years'
          min={0}
          max={50}
          description='Enter 0 if you never did shift work'
          allowNull
        />
      )}

      {/* Time zone travel */}
      <NumberField
        control={form.control}
        name='chronotype.timeZoneTravelPerYear'
        label='How many times per year do you travel across time zones?'
        placeholder='0-50'
        min={0}
        max={50}
        allowNull
      />

      {/* Trouble adjusting after travel - show when timeZoneTravelPerYear > 3 */}
      {timeZoneTravelPerYear > 3 && (
        <CheckboxField
          control={form.control}
          name='chronotype.troubleAdjustingAfterTravel'
          label='Do you have trouble adjusting to the time change after travel?'
        />
      )}

      {/* Work/school schedule */}
      <FormField
        control={form.control}
        name='chronotype.earliestWorkSchoolTime'
        render={({ field }) => (
          <FormItem>
            <FormLabel>What is your earliest work/school start time in the morning?</FormLabel>
            <FormControl>
              <Input type='time' {...field} className='max-w-xs' />
            </FormControl>
            <FormDescription>Leave blank if you do not have to be up in the morning.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Delayed Sleep Phase Syndrome warning */}
      {preference === 'late' && (
        <Alert className='alert-warning'>
          <Info className='h-4 w-4 text-amber-600' />
          <AlertDescription className='text-amber-900'>
            <strong>Night Owl Chronotype</strong>
            <br />
            You have a late chronotype preference. If you&apos;re experiencing difficulty waking in
            the morning, daytime tiredness when your work/school schedule requires early wake times,
            or difficulty falling asleep, you may have symptoms of Delayed Sleep Phase Syndrome.
            This is particularly common between ages 12-25 but can affect all ages. Consider
            consulting with a sleep specialist if these issues impact your daily functioning.
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
            You have an early chronotype preference. If you&apos;re waking earlier than desired and
            experiencing evening sleepiness that interferes with activities, you may have symptoms
            of Advanced Sleep Phase Syndrome. This becomes increasingly common after age 70. If
            you&apos;re struggling with your current sleep schedule, consider consulting with a
            behavioral sleep specialist.
          </AlertDescription>
        </Alert>
      )}

      {/* Shift work warning */}
      {(shiftWork || (pastShiftWorkYears && pastShiftWorkYears > 0)) && (
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
