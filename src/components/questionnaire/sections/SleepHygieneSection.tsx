import { UseFormReturn } from 'react-hook-form'
import { QuestionnaireFormData } from '@/validations/questionnaire'
import { CheckboxField } from '../form-fields/CheckboxField'
import { NumberField } from '../form-fields/NumberField'
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormMessage,
  FormDescription 
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Pill, Info } from 'lucide-react'
import { prescriptionMedOptions, supplementOptions } from '@/lib/sleep-medication-labels'

interface SleepHygieneSectionProps {
  form: UseFormReturn<QuestionnaireFormData>
}

export function SleepHygieneSection({ form }: SleepHygieneSectionProps) {
  const supplements = form.watch('sleepHygiene.supplements')
  const prescriptionMeds = form.watch('sleepHygiene.prescriptionMeds')
  const stimulants = form.watch('sleepHygiene.stimulants')
  const smokesNicotine = form.watch('sleepHygiene.smokesNicotine')

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">
        Sleep Medications and Supplements
      </div>

      <Alert className="alert-info">
        <Pill className="h-4 w-4 text-primary" />
        <AlertDescription className="text-foreground/90">
          Understanding what medications and supplements you take helps us provide better 
          recommendations. Some substances can significantly impact sleep quality and timing.
        </AlertDescription>
      </Alert>

      {/* Supplements */}
      <FormField
        control={form.control}
        name="sleepHygiene.supplements"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">
              What supplements or over-the-counter medications do you take for sleep? (check all that apply)
            </FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {supplementOptions.map((option) => (
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
                  <FormLabel className="font-normal text-sm">
                    {option.label}
                  </FormLabel>
                </FormItem>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {supplements && supplements.length > 0 && (
        <NumberField
          control={form.control}
          name="sleepHygiene.supplementsFrequencyPerWeek"
          label="How many nights a week do you take these supplements or over-the-counter sleep medications?"
          placeholder="0-7"
          min={0}
          max={7}
          description="Enter the average number of nights per week. We focus report warnings on sleep aids used 3 or more nights per week."
        />
      )}

      {/* Other supplements */}
      <FormField
        control={form.control}
        name="sleepHygiene.supplementsOther"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Other supplements or OTC medications for sleep</FormLabel>
            <FormControl>
              <Input placeholder="Enter any other supplements..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Prescription medications */}
      <FormField
        control={form.control}
        name="sleepHygiene.prescriptionMeds"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">
              What prescription medications do you take for sleep? (check all that apply)
            </FormLabel>
            <div className="space-y-2 mt-2">
              {prescriptionMedOptions.map((option) => (
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
                  <FormLabel className="font-normal text-sm">
                    {option.label}
                  </FormLabel>
                </FormItem>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {prescriptionMeds && prescriptionMeds.length > 0 && (
        <NumberField
          control={form.control}
          name="sleepHygiene.prescriptionMedsFrequencyPerWeek"
          label="How many nights a week do you take these prescription sleep medications?"
          placeholder="0-7"
          min={0}
          max={7}
          description="Enter the average number of nights per week. We focus report warnings on sleep medications used 3 or more nights per week."
        />
      )}

      {/* Other prescription medications */}
      <FormField
        control={form.control}
        name="sleepHygiene.prescriptionMedsOther"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Other prescription sleep medications</FormLabel>
            <FormControl>
              <Input placeholder="Enter any other prescriptions..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Stimulants */}
      <FormField
        control={form.control}
        name="sleepHygiene.stimulants"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Are you prescribed stimulants?</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Adderall, Ritalin, Vyvanse, Provigil/Nuvigil, Wakix, methylphenidate..."
                {...field}
              />
            </FormControl>
            <FormDescription>
              If yes, please specify the medication name. Common stimulants include: Adderall, Ritalin, Vyvanse, Provigil/Nuvigil, Wakix, amphetamines, methylphenidate
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Stimulant timing */}
      {stimulants && (
        <FormField
          control={form.control}
          name="sleepHygiene.stimulantTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What time do you take your stimulant medication?</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  className="max-w-xs"
                />
              </FormControl>
              <FormDescription>
                Late afternoon stimulants can interfere with sleep
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Nicotine */}
      <CheckboxField
        control={form.control}
        name="sleepHygiene.smokesNicotine"
        label="I smoke cigarettes or use nicotine patches"
        description="Nicotine can significantly impact sleep quality"
      />

      {smokesNicotine && (
        <Alert className="alert-warning">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-900">
            <strong>Tobacco or Nicotine Use</strong>
            <br />
            Use of tobacco and nicotine can cause sleep disruption and has significant health risks.
            We strongly recommend discussing these substances with your primary care doctor to
            discuss strategies to discontinue use.
          </AlertDescription>
        </Alert>
      )}

      {/* Medication dependence warning */}
      {prescriptionMeds && prescriptionMeds.length > 0 && (
        <Alert className="alert-warning">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-900">
            <strong>Prescription Sleep Medications</strong>
            <br />
            Long-term use of sleep medications can lead to dependence and may mask underlying 
            sleep disorders. Your sleep report will include links and next steps for healthy 
            management of these medications.
          </AlertDescription>
        </Alert>
      )}

      {/* Multiple medications warning */}
      {supplements && prescriptionMeds && 
       (supplements.length + prescriptionMeds.length) > 3 && (
        <Alert className="alert-danger">
          <Pill className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-900">
            <strong>Multiple Sleep Aids Detected</strong>
            <br />
            You&apos;re using multiple sleep aids, which may indicate significant sleep difficulties. 
            This combination approach can lead to interactions and side effects. Your sleep report 
            will include links and next steps for healthy management of these medications.
          </AlertDescription>
        </Alert>
      )}

      {/* THC/CBD info */}
      {supplements?.includes('cbd') && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            If you use THC or other cannabis products to address anxiety or sleep problems, 
            it&apos;s important to understand that THC and other compounds have a direct impact 
            on your sleep stages and can result in short-term withdrawal effects when discontinued.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
