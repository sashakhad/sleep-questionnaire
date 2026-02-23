import { UseFormReturn } from 'react-hook-form';
import { QuestionnaireFormData } from '@/validations/questionnaire';
import { NumberField } from '../form-fields/NumberField';
import { CheckboxField } from '../form-fields/CheckboxField';
import { SelectField } from '../form-fields/SelectField';
import { TimeField } from '../form-fields/TimeField';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
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

export function UnscheduledSleepSection({ form }: UnscheduledSleepSectionProps) {
  const nightWakeups = form.watch('unscheduledSleep.nightWakeups');

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
      <TimeField
        control={form.control}
        name='unscheduledSleep.lightsOutTime'
        label='What time do you turn out the lights and try to fall asleep?'
      />

      {/* Time to fall asleep - now as select with 10-minute increments */}
      <SelectField
        control={form.control}
        name='unscheduledSleep.minutesToFallAsleep'
        label='After you turn out the lights, about how long does it take you to fall asleep?'
        placeholder='Select time'
        options={minuteIncrementOptions}
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
        <div className='border-border bg-card/50 space-y-4 rounded-xl border p-5'>
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

      {/* Minutes awake at night - now as select with 10-minute increments */}
      <SelectField
        control={form.control}
        name='unscheduledSleep.minutesAwakeAtNight'
        label='About how many minutes total are you awake during the night?'
        placeholder='Select time'
        description='Total time awake after initially falling asleep'
        options={minuteIncrementOptions}
      />

      {/* Wake up time */}
      <TimeField
        control={form.control}
        name='unscheduledSleep.wakeupTime'
        label='What time do you wake up?'
      />

      {/* Get out of bed time */}
      <TimeField
        control={form.control}
        name='unscheduledSleep.getOutOfBedTime'
        label='What time do you get out of bed?'
        description='This may be different from your wake up time'
      />

      {/* Alarm clock */}
      <CheckboxField
        control={form.control}
        name='unscheduledSleep.usesAlarm'
        label='I use an alarm clock to wake up in the morning'
        description='On weekends/free days'
      />
    </div>
  );
}
