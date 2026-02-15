import { UseFormReturn } from 'react-hook-form'
import { QuestionnaireFormData } from '@/validations/questionnaire'
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

interface SleepHygieneSectionProps {
  form: UseFormReturn<QuestionnaireFormData>
}

const otcSleepAidsOptions = [
  { value: 'melatonin', label: 'Melatonin' },
  { value: 'benadryl', label: 'Benadryl (diphenhydramine)' },
  { value: 'nyquil', label: 'NyQuil' },
  { value: 'unisom', label: 'Unisom (doxylamine succinate)' },
  { value: 'tylenol_pm', label: 'Tylenol PM / Advil PM' },
]

const supplementOptions = [
  { value: 'l_theanine', label: 'L-theanine' },
  { value: 'cbd', label: 'CBD' },
  { value: 'magnesium', label: 'Magnesium' },
  { value: 'valerian', label: 'Valerian root' },
]

const prescriptionMedOptions = [
  { value: 'benzos', label: 'Benzodiazepines — Estazolam (ProSom), Flurazepam (Dalmane), Temazepam (Restoril), Triazolam (Halcion), Lorazepam (Ativan), Diazepam (Valium), Clonazepam (Klonopin)' },
  { value: 'z_drugs', label: 'Non-benzodiazepine hypnotics — Zolpidem (Ambien), Eszopiclone (Lunesta), Zaleplon (Sonata)' },
  { value: 'orexin', label: 'Dual Orexin Receptor Antagonists — Daridorexant (Quviviq), Lemborexant (Dayvigo), Suvorexant (Belsomra)' },
  { value: 'antidepressants', label: 'Sedating antidepressants — Trazodone, Mirtazapine, Doxepin, Amitriptyline' },
  { value: 'melatonin_agonist', label: 'Melatonin Receptor Agonists — Ramelteon (Rozerem)' },
  { value: 'antipsychotic', label: 'Antipsychotic — Quetiapine (Seroquel), Olanzapine (Zyprexa), Risperidone (Risperdal)' },
]

const sleepAffectingMedsOptions = [
  { value: 'ssri_snri', label: 'SSRIs/SNRIs (e.g., Lexapro/escitalopram, Zoloft/sertraline, Effexor/venlafaxine, Cymbalta/duloxetine)' },
  { value: 'steroids', label: 'Steroids (e.g., Prednisone)' },
  { value: 'pde5', label: 'PDE-5 inhibitors (e.g., Sildenafil/Viagra, Tadalafil/Cialis)' },
  { value: 'antihistamines', label: 'Antihistamines (e.g., Cetirizine/Zyrtec, Loratadine/Claritin)' },
  { value: 'antiemetics', label: 'Antiemetics (e.g., Ondansetron/Zofran, Metoclopramide/Reglan)' },
]

export function SleepHygieneSection({ form }: SleepHygieneSectionProps) {
  const supplements = form.watch('sleepHygiene.supplements')
  const prescriptionMeds = form.watch('sleepHygiene.prescriptionMeds')
  const stimulants = form.watch('sleepHygiene.stimulants')

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

      {/* OTC Supplements - two groups */}
      <FormField
        control={form.control}
        name="sleepHygiene.supplements"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">
              What supplements or over-the-counter medications do you take for sleep? (check all that apply)
            </FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground">OTC Sleep Aids</h4>
                {otcSleepAidsOptions.map((option) => (
                  <FormItem
                    key={option.value}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(option.value)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...(field.value ?? []), option.value])
                            : field.onChange(
                                (field.value ?? []).filter((value: string) => value !== option.value)
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
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground">Supplements</h4>
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
                            ? field.onChange([...(field.value ?? []), option.value])
                            : field.onChange(
                                (field.value ?? []).filter((value: string) => value !== option.value)
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
            </div>
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
                          ? field.onChange([...(field.value ?? []), option.value])
                          : field.onChange(
                              (field.value ?? []).filter((value: string) => value !== option.value)
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

      {/* Sleep-affecting medications */}
      <FormField
        control={form.control}
        name="sleepHygiene.sleepAffectingMeds"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">
              Are you taking any medications that can affect sleep? (check all that apply)
            </FormLabel>
            <div className="space-y-2 mt-2">
              {sleepAffectingMedsOptions.map((option) => (
                <FormItem
                  key={option.value}
                  className="flex flex-row items-start space-x-3 space-y-0"
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(option.value)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...(field.value ?? []), option.value])
                          : field.onChange(
                              (field.value ?? []).filter((value: string) => value !== option.value)
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

      {/* Stimulants */}
      <FormField
        control={form.control}
        name="sleepHygiene.stimulants"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Are you prescribed stimulants?</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Adderall, Ritalin, Vyvanse..."
                {...field}
              />
            </FormControl>
            <FormDescription>
              If yes, please specify the medication name
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

      {/* Medication dependence warning */}
      {prescriptionMeds && prescriptionMeds.length > 0 && (
        <Alert className="alert-warning">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-900">
            <strong>Prescription Sleep Medications</strong>
            <br />
            Long-term use of sleep medications can lead to dependence and may mask underlying 
            sleep disorders. If you&apos;ve been using sleep medications for more than a few weeks, 
            consider discussing alternative treatments like Cognitive Behavioral Therapy for 
            Insomnia (CBT-I) with your healthcare provider.
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
            This combination approach can lead to interactions and side effects. We strongly 
            recommend consulting with a sleep specialist to address the underlying causes of 
            your sleep problems rather than relying on multiple medications.
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
