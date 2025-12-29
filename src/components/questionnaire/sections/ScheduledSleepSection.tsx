import { UseFormReturn } from 'react-hook-form';
import { QuestionnaireFormData } from '@/validations/questionnaire';
import { NumberField } from '../form-fields/NumberField';
import { CheckboxField } from '../form-fields/CheckboxField';
import { SelectField } from '../form-fields/SelectField';
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

interface ScheduledSleepSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

const wakeupReasons = [
  { value: 'urinate', label: 'Need to urinate' },
  { value: 'pain', label: 'Pain' },
  { value: 'noise_light', label: 'Noise or light' },
  { value: 'unknown', label: "Don't know" },
];

const preBedActivities = [
  { value: 'phone', label: 'Scrolling on my phone' },
  { value: 'reading', label: 'Reading a book or tablet' },
  { value: 'tv', label: 'Watching television' },
  { value: 'resting', label: 'Resting or meditating' },
];

// 10-minute increment options ending with >120
const minuteIncrementOptions = [
  { value: '10', label: '10 minutes' },
  { value: '20', label: '20 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '40', label: '40 minutes' },
  { value: '50', label: '50 minutes' },
  { value: '60', label: '60 minutes' },
  { value: '70', label: '70 minutes' },
  { value: '80', label: '80 minutes' },
  { value: '90', label: '90 minutes' },
  { value: '100', label: '100 minutes' },
  { value: '110', label: '110 minutes' },
  { value: '120', label: '120 minutes' },
  { value: '>120', label: 'More than 120 minutes' },
];

export function ScheduledSleepSection({ form }: ScheduledSleepSectionProps) {
  const nightWakeups = form.watch('scheduledSleep.nightWakeups');
  const earlyWakeupDays = form.watch('scheduledSleep.earlyWakeupDays');
  const lightsOutTime = form.watch('scheduledSleep.lightsOutTime');
  const getOutOfBedTime = form.watch('scheduledSleep.getOutOfBedTime');

  // Calculate if there's >15 minutes before lights out
  const showPreBedActivity = (() => {
    if (!lightsOutTime || !getOutOfBedTime) {return false;}
    // This would require knowing bed entry time, but we can show it if they have a lights out time
    // For now, we'll show it always as the question asks about time in bed before lights out
    return true;
  })();

  return (
    <div className='space-y-6'>
      <div className='text-lg font-medium'>
        Please tell us about your sleep on work/school nights (for example Sunday-Thursday):
      </div>

      {/* Lights out time */}
      <FormField
        control={form.control}
        name='scheduledSleep.lightsOutTime'
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

      {/* Lights out varies */}
      <CheckboxField
        control={form.control}
        name='scheduledSleep.lightsOutVaries'
        label='Does your lights out time vary more than 2 hours?'
        description='This may indicate irregular sleep patterns'
      />

      {/* Pre-bed activity */}
      {showPreBedActivity && (
        <div className='border-border bg-card/50 space-y-4 rounded-xl border p-5'>
          <FormField
            control={form.control}
            name='scheduledSleep.preBedActivity'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base font-medium'>
                  If you are in bed more than 15 minutes prior to lights out, what are you doing in
                  bed?
                </FormLabel>
                <p className='text-muted-foreground text-sm'>Check all that apply</p>
                <div className='mt-3 space-y-2'>
                  {preBedActivities.map(activity => (
                    <FormItem
                      key={activity.value}
                      className='hover:bg-muted/50 has-[[data-state=checked]]:border-primary/20 has-[[data-state=checked]]:bg-primary/5 flex flex-row items-center space-y-0 space-x-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors'
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(activity.value)}
                          onCheckedChange={checked => {
                            return checked
                              ? field.onChange([...field.value, activity.value])
                              : field.onChange(
                                  field.value?.filter((value: string) => value !== activity.value)
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className='text-foreground/90 cursor-pointer font-normal'>
                        {activity.label}
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

      {/* Time to fall asleep - now as select with 10-minute increments */}
      <SelectField
        control={form.control}
        name='scheduledSleep.minutesToFallAsleep'
        label='After you turn out the lights, about how long does it take you to fall asleep?'
        placeholder='Select time'
        options={minuteIncrementOptions}
      />

      {/* Night wakeups */}
      <NumberField
        control={form.control}
        name='scheduledSleep.nightWakeups'
        label='About how many times do you wake up during the night prior to your final wake-up?'
        placeholder='Number of times'
        min={0}
        max={20}
      />

      {/* Wakeup reasons - only show if they wake up more than twice */}
      {nightWakeups > 2 && (
        <div className='border-border bg-card/50 space-y-4 rounded-xl border p-5'>
          <FormField
            control={form.control}
            name='scheduledSleep.wakeupReasons'
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

      {/* Minutes awake at night - now as select with 10-minute increments */}
      <SelectField
        control={form.control}
        name='scheduledSleep.minutesAwakeAtNight'
        label='About how many minutes total are you awake during the night?'
        placeholder='Select time'
        description='Total time awake after initially falling asleep'
        options={minuteIncrementOptions}
      />

      {/* Wake up time */}
      <FormField
        control={form.control}
        name='scheduledSleep.wakeupTime'
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
        name='scheduledSleep.getOutOfBedTime'
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
        name='scheduledSleep.earlyWakeupDays'
        label='How many days a week do you wake up earlier than planned?'
        placeholder='Days per week'
        min={0}
        max={7}
      />

      {/* Early wakeup minutes - only show if they wake up early more than 2 days */}
      {earlyWakeupDays > 2 && (
        <NumberField
          control={form.control}
          name='scheduledSleep.earlyWakeupMinutes'
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
        name='scheduledSleep.usesAlarm'
        label='I use an alarm clock to wake up in the morning'
      />
    </div>
  );
}
