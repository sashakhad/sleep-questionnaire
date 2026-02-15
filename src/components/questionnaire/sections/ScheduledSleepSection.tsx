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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ScheduledSleepSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

const wakeupReasons = [
  { value: 'urinate', label: 'Need to urinate' },
  { value: 'pain', label: 'Pain' },
  { value: 'noise_light', label: 'Noise or light' },
  { value: 'unknown', label: "Don't know" },
];

function isLightsOutTimeUnusual(time: string): boolean {
  if (!time || !time.includes(':')) return false;
  const parts = time.split(':').map(Number);
  const h = parts[0] ?? 0;
  const m = parts[1] ?? 0;
  const mins = h * 60 + m;
  // Valid: 20:30-02:00 (1230 mins to 120 mins, spans midnight)
  return mins < 1230 && mins > 120;
}

function isWakeupTimeUnusual(time: string): boolean {
  if (!time || !time.includes(':')) return false;
  const parts = time.split(':').map(Number);
  const h = parts[0] ?? 0;
  const m = parts[1] ?? 0;
  const mins = h * 60 + m;
  // Valid: 05:00-11:00
  return mins < 300 || mins > 660;
}

export function ScheduledSleepSection({ form }: ScheduledSleepSectionProps) {
  const nightWakeups = form.watch('scheduledSleep.nightWakeups');
  const earlyWakeupDays = form.watch('scheduledSleep.earlyWakeupDays');
  const plannedNapsPerWeek = form.watch('scheduledSleep.plannedNapsPerWeek');
  const lightsOutTime = form.watch('scheduledSleep.lightsOutTime');
  const wakeupTime = form.watch('scheduledSleep.wakeupTime');

  return (
    <div className='space-y-6'>
      <div className='text-lg font-medium'>
        Please tell us about your sleep on scheduled/work/school days:
      </div>

      {/* Bedtime */}
      <FormField
        control={form.control}
        name='scheduledSleep.bedtime'
        render={({ field }) => (
          <FormItem>
            <FormLabel>What time do you typically get into bed on work/school nights?</FormLabel>
            <FormControl>
              <Input type='time' {...field} className='max-w-xs' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Lights out time */}
      <FormField
        control={form.control}
        name='scheduledSleep.lightsOutTime'
        render={({ field }) => (
          <FormItem>
            <FormLabel>What time do you typically turn out the lights and try to fall asleep?</FormLabel>
            <FormControl>
              <Input type='time' {...field} className='max-w-xs' />
            </FormControl>
            {isLightsOutTimeUnusual(lightsOutTime) && (
              <Alert className='alert-warning mt-2'>
                <AlertCircle className='h-4 w-4 text-amber-600' />
                <AlertDescription className='text-amber-900'>
                  This bedtime seems unusual. Please double-check that you entered the correct time.
                </AlertDescription>
              </Alert>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Lights out varies */}
      <CheckboxField
        control={form.control}
        name='scheduledSleep.lightsOutVaries'
        label='Does your lights out time typically vary more than 3 hours?'
        description='This may indicate irregular sleep patterns'
      />

      {/* Time to fall asleep */}
      <NumberField
        control={form.control}
        name='scheduledSleep.minutesToFallAsleep'
        label='After you turn out the lights, about how long does it typically take you to fall asleep?'
        placeholder='Minutes'
        description='Enter the number of minutes'
        min={0}
        max={180}
      />

      {/* Night wakeups */}
      <NumberField
        control={form.control}
        name='scheduledSleep.nightWakeups'
        label='About how many times do you typically wake up during the night prior to your final wake-up?'
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
                <FormLabel className='text-base font-medium'>What typically wakes you?</FormLabel>
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
        name='scheduledSleep.minutesAwakeAtNight'
        label='About how many minutes total are you typically awake during the night before your final awakening? (total wake time after falling asleep)'
        placeholder='Minutes'
        description='Total time awake after initially falling asleep'
        min={0}
        max={480}
      />

      {/* Wake up time */}
      <FormField
        control={form.control}
        name='scheduledSleep.wakeupTime'
        render={({ field }) => (
          <FormItem>
            <FormLabel>What time do you typically wake up?</FormLabel>
            <FormControl>
              <Input type='time' {...field} className='max-w-xs' />
            </FormControl>
            {isWakeupTimeUnusual(wakeupTime) && (
              <Alert className='alert-warning mt-2'>
                <AlertCircle className='h-4 w-4 text-amber-600' />
                <AlertDescription className='text-amber-900'>
                  This wake time seems unusual. Please double-check that you entered the correct time.
                </AlertDescription>
              </Alert>
            )}
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
            <FormLabel>What time do you typically get out of bed?</FormLabel>
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
        label='How many days a week do you typically wake up earlier than planned?'
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
        label='Do you typically use an alarm clock to wake up in the morning?'
      />

      {/* Planned naps */}
      <NumberField
        control={form.control}
        name='scheduledSleep.plannedNapsPerWeek'
        label='How many planned naps do you typically take a week?'
        placeholder='Number of naps'
        min={0}
        max={14}
      />

      {/* Average nap duration - only show if they take more than 2 naps */}
      {plannedNapsPerWeek > 2 && (
        <NumberField
          control={form.control}
          name='scheduledSleep.averageNapMinutes'
          label='How long is your average nap typically?'
          placeholder='Minutes'
          description='Average duration in minutes'
          min={0}
          max={180}
        />
      )}
    </div>
  );
}
