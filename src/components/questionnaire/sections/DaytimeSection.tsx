import { UseFormReturn } from 'react-hook-form'
import { QuestionnaireFormData } from '@/validations/questionnaire'
import { CheckboxField } from '../form-fields/CheckboxField'
import { NumberField } from '../form-fields/NumberField'
import { RadioGroupField } from '../form-fields/RadioGroupField'
import { SelectField } from '../form-fields/SelectField'
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormMessage 
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'

interface DaytimeSectionProps {
  form: UseFormReturn<QuestionnaireFormData>
}

const fallAsleepOptions = [
  { value: 'stoplight', label: 'Stopped at a stop light', weight: 2 },
  { value: 'lectures', label: 'During lectures or work meetings', weight: 1 },
  { value: 'working', label: 'While working or studying', weight: 1 },
  { value: 'conversation', label: 'During a conversation', weight: 2 },
  { value: 'evening', label: 'While engaged in a quiet activity during the evening', weight: 1 },
  { value: 'meal', label: 'While eating a meal', weight: 2 },
]

const weaknessOptions = [
  { value: 'feel_weak', label: 'I feel weak' },
  { value: 'brace_myself', label: 'I have to brace myself so that I do not fall' },
  { value: 'fallen', label: 'I have fallen down' },
]

export function DaytimeSection({ form }: DaytimeSectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">
        Please tell us about how you feel during the day:
      </div>

      {/* Planned naps */}
      <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
        <h3 className="font-medium">Planned Naps</h3>
        
        <NumberField
          control={form.control}
          name="daytime.plannedNaps.daysPerWeek"
          label="I take planned naps how many days per week?"
          min={0}
          max={7}
          placeholder="0-7"
        />

        {form.watch('daytime.plannedNaps.daysPerWeek') > 0 && (
          <SelectField
            control={form.control}
            name="daytime.plannedNaps.duration"
            label="How long are your naps typically?"
            options={[
              { value: '0-10', label: '0-10 minutes' },
              { value: '15-30', label: '15-30 minutes' },
              { value: '30-90', label: '30-90 minutes' },
              { value: '>90', label: 'Longer than 90 minutes' },
            ]}
          />
        )}
      </div>

      {/* Fall asleep during activities */}
      <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
        <FormField
          control={form.control}
          name="daytime.fallAsleepDuring"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">
                During a typical week, how often do you fall asleep while: (check all that apply)
              </FormLabel>
              <div className="space-y-2 mt-2">
                {fallAsleepOptions.map((option) => (
                  <FormItem
                    key={option.value}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(option.value)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, option.value])
                            : field.onChange(
                                field.value?.filter((value: string) => value !== option.value)
                              )
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {option.label}
                    </FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Tiredness interferes */}
      <CheckboxField
        control={form.control}
        name="daytime.tirednessInterferes"
        label="My tiredness interferes with my daily activities"
      />

      {/* Tired but can't sleep */}
      {form.watch('daytime.tirednessInterferes') && (
        <RadioGroupField
          control={form.control}
          name="daytime.tiredButCantSleep"
          label="I feel tired but cannot fall asleep:"
          options={[
            { value: 'everyday', label: 'Everyday' },
            { value: '5+days', label: 'At least 5 days a week' },
            { value: '3-5days', label: 'Between 3 and 5 days a week' },
            { value: '1-3days', label: '1-3 days a week' },
            { value: '<1day', label: 'Less than 1 day a week' },
          ]}
        />
      )}

      {/* Dreams while falling asleep */}
      <CheckboxField
        control={form.control}
        name="daytime.dreamsWhileFallingAsleep"
        label="I regularly have dreams while falling asleep or during daytime naps"
        description="This may be related to narcolepsy or sleep deprivation"
      />

      {/* Weakness when excited */}
      <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
        <FormField
          control={form.control}
          name="daytime.weaknessWhenExcited"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">
                When I laugh or feel excited: (check all that apply)
              </FormLabel>
              <div className="space-y-2 mt-2">
                {weaknessOptions.map((option) => (
                  <FormItem
                    key={option.value}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(option.value)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, option.value])
                            : field.onChange(
                                field.value?.filter((value: string) => value !== option.value)
                              )
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {option.label}
                    </FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Sleep paralysis */}
      <CheckboxField
        control={form.control}
        name="daytime.sleepParalysis"
        label="I sometimes wake up and feel like my body is paralyzed"
        description="This may be related to narcolepsy or sleep disorders"
      />

      {/* Diagnosed narcolepsy */}
      <CheckboxField
        control={form.control}
        name="daytime.diagnosedNarcolepsy"
        label="Have you been diagnosed with narcolepsy or hypersomnia?"
        description="E.g., idiopathic, post viral, post concussion"
      />
    </div>
  )
}
