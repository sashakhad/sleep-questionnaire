import { UseFormReturn } from 'react-hook-form';
import { QuestionnaireFormData } from '@/validations/questionnaire';
import { NumberField } from '../form-fields/NumberField';
import { CheckboxField } from '../form-fields/CheckboxField';
import { Input } from '@/components/ui/input';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

interface UnscheduledSleepSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

const wakeupReasons = [
  { value: 'urinate', label: 'Need to urinate' },
  { value: 'pain', label: 'Pain' },
  { value: 'noise_light', label: 'Noise or light' },
  { value: 'unknown', label: "Don't know" },
];

export function UnscheduledSleepSection({ form }: UnscheduledSleepSectionProps) {
  const nightWakeups = form.watch('unscheduledSleep.nightWakeups');
  const earlyWakeupDays = form.watch('unscheduledSleep.earlyWakeupDays');
  const plannedNapsPerWeek = form.watch('unscheduledSleep.plannedNapsPerWeek');

  return (
    <div className='space-y-6'>
      <div className='text-lg font-medium'>
        Please tell us about your sleep on unscheduled/weekend/vacation days:
      </div>

      <div className='text-muted-foreground border-primary/20 bg-primary/5 rounded-xl border p-4 text-sm'>
        This section helps us understand your natural sleep patterns when you don&apos;t have work
        or school obligations.
      </div>

      {/* Lights out time */}
      <FormField
        control={form.control}
        name='unscheduledSleep.lightsOutTime'
        render={({ field }) => (
          <FormItem>
            <FormLabel>What time do you turn out the lights and try to fall asleep?</FormLabel>
            <FormControl>
              <Input type='time' {...field} className='max-w-xs' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Time to fall asleep */}
      <NumberField
        control={form.control}
        name='unscheduledSleep.minutesToFallAsleep'
        label='After you turn out the lights, about how long does it take you to fall asleep?'
        placeholder='Minutes'
        description='Enter the number of minutes'
        min={0}
        max={180}
      />

      {/* Night wakeups */}
      <NumberField
        control={form.control}
        name='unscheduledSleep.nightWakeups'
        label='About how many times do you wake up during the night prior to your final wake-up?'
        placeholder='Number of times'
        min={0}
        max={20}
      />

      {/* Wakeup reasons - only show if they wake up more than twice */}
      {nightWakeups > 2 && (
        <div className='border-border/60 bg-card/50 space-y-4 rounded-xl border p-5'>
          <FormField
            control={form.control}
            name='unscheduledSleep.wakeupReasons'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base font-medium'>What wakes you?</FormLabel>
                <p className='text-muted-foreground text-sm'>Check all that apply</p>
                <div className='mt-3 space-y-2'>
                  {wakeupReasons.map(reason => (
                    <FormItem
                      key={reason.value}
                      className='hover:bg-muted/50 has-[[data-state=checked]]:border-primary/20 has-[[data-state=checked]]:bg-primary/5 flex flex-row items-center space-y-0 space-x-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors'
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(reason.value)}
                          onCheckedChange={checked => {
                            return checked
                              ? field.onChange([...field.value, reason.value])
                              : field.onChange(
                                  field.value?.filter((value: string) => value !== reason.value)
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className='text-foreground/90 cursor-pointer font-normal'>
                        {reason.label}
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

      {/* Minutes awake at night */}
      <NumberField
        control={form.control}
        name='unscheduledSleep.minutesAwakeAtNight'
        label='About how many minutes total are you awake during the night?'
        placeholder='Minutes'
        description='Total time awake after initially falling asleep'
        min={0}
        max={480}
      />

      {/* Wake up time */}
      <FormField
        control={form.control}
        name='unscheduledSleep.wakeupTime'
        render={({ field }) => (
          <FormItem>
            <FormLabel>What time do you wake up?</FormLabel>
            <FormControl>
              <Input type='time' {...field} className='max-w-xs' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Get out of bed time */}
      <FormField
        control={form.control}
        name='unscheduledSleep.getOutOfBedTime'
        render={({ field }) => (
          <FormItem>
            <FormLabel>What time do you get out of bed?</FormLabel>
            <FormControl>
              <Input type='time' {...field} className='max-w-xs' />
            </FormControl>
            <FormDescription>This may be different from your wake up time</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Early wakeup days */}
      <NumberField
        control={form.control}
        name='unscheduledSleep.earlyWakeupDays'
        label='How many days a week do you wake up earlier than planned?'
        placeholder='Days per week'
        min={0}
        max={7}
      />

      {/* Early wakeup minutes - only show if they wake up early more than 2 days */}
      {earlyWakeupDays > 2 && (
        <NumberField
          control={form.control}
          name='unscheduledSleep.earlyWakeupMinutes'
          label='How many minutes earlier do you typically wake up?'
          placeholder='Minutes'
          description='Average number of minutes earlier than planned'
          min={0}
          max={180}
        />
      )}

      {/* Alarm clock */}
      <CheckboxField
        control={form.control}
        name='unscheduledSleep.usesAlarm'
        label='Do you use an alarm clock to wake up in the morning?'
        description='On weekends/free days'
      />

      {/* Planned naps */}
      <NumberField
        control={form.control}
        name='unscheduledSleep.plannedNapsPerWeek'
        label='How many planned naps do you take on weekends?'
        placeholder='Number of naps'
        min={0}
        max={14}
      />

      {/* Average nap duration - only show if they take more than 2 naps */}
      {plannedNapsPerWeek > 2 && (
        <NumberField
          control={form.control}
          name='unscheduledSleep.averageNapMinutes'
          label='How long is your average nap?'
          placeholder='Minutes'
          description='Average duration in minutes'
          min={0}
          max={180}
        />
      )}
    </div>
  );
}
