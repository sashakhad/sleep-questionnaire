import { UseFormReturn } from 'react-hook-form';
import { QuestionnaireFormData } from '@/validations/questionnaire';
import { CheckboxField } from '../form-fields/CheckboxField';
import { RadioGroupField } from '../form-fields/RadioGroupField';
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
import { Stethoscope, Info } from 'lucide-react';

interface SleepDisorderDiagnosesSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}


const osaTreatmentOptions = [
  { value: 'cpap', label: 'CPAP' },
  { value: 'dental_device', label: 'Dental device' },
  { value: 'other', label: 'Other' },
];

const rlsTreatmentOptions = [
  { value: 'iron', label: 'Iron supplements' },
  { value: 'dopamine', label: 'Dopamine agonists' },
  { value: 'gabapentin', label: 'Gabapentin' },
  { value: 'other', label: 'Other medication' },
];

export function SleepDisorderDiagnosesSection({ form }: SleepDisorderDiagnosesSectionProps) {
  const diagnosedOSA = form.watch('sleepDisorderDiagnoses.diagnosedOSA');
  const osaTreated = form.watch('sleepDisorderDiagnoses.osaTreated');
  const osaTreatmentEffective = form.watch('sleepDisorderDiagnoses.osaTreatmentEffective');
  const diagnosedRLS = form.watch('sleepDisorderDiagnoses.diagnosedRLS');
  const rlsTreated = form.watch('sleepDisorderDiagnoses.rlsTreated');
  const rlsTreatmentEffective = form.watch('sleepDisorderDiagnoses.rlsTreatmentEffective');

  return (
    <div className='space-y-6'>
      <div className='text-lg font-medium'>Sleep Disorder History</div>

      <Alert className='alert-info'>
        <Stethoscope className='text-primary h-4 w-4' />
        <AlertDescription className='text-foreground/90'>
          Please let us know if you have been diagnosed with any sleep disorders. This information
          helps us provide more accurate recommendations and understand your sleep health history.
        </AlertDescription>
      </Alert>

      {/* Sleep Apnea Section */}
      <div className='border-border bg-card/50 space-y-4 rounded-xl border p-5'>
        <h3 className='text-muted-foreground text-sm font-semibold tracking-wide uppercase'>
          Obstructive Sleep Apnea (OSA)
        </h3>

        <CheckboxField
          control={form.control}
          name='sleepDisorderDiagnoses.diagnosedOSA'
          label='I have been diagnosed with obstructive sleep apnea'
          description='Such as obstructive sleep apnea, primary snoring, or central sleep apnea'
        />

        {diagnosedOSA && (
          <div className='bg-muted/30 space-y-4 rounded-lg p-4'>
            <RadioGroupField
              control={form.control}
              name='sleepDisorderDiagnoses.osaSeverity'
              label='How severe is your condition?'
              options={[
                { value: 'mild', label: 'Mild' },
                { value: 'moderate', label: 'Moderate' },
                { value: 'severe', label: 'Severe' },
              ]}
            />

            <CheckboxField
              control={form.control}
              name='sleepDisorderDiagnoses.osaTreated'
              label='Are you being treated for your sleep apnea?'
            />

            {osaTreated && (
              <>
                <FormField
                  control={form.control}
                  name='sleepDisorderDiagnoses.osaTreatmentType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-base font-medium'>
                        What type of treatment do you use?
                      </FormLabel>
                      <p className='text-muted-foreground text-sm'>Check all that apply</p>
                      <div className='mt-3 space-y-2'>
                        {osaTreatmentOptions.map(option => (
                          <FormItem
                            key={option.value}
                            className='hover:bg-muted/50 has-[[data-state=checked]]:border-primary/20 has-[[data-state=checked]]:bg-primary/5 flex flex-row items-center space-y-0 space-x-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors'
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.value)}
                                onCheckedChange={checked => {
                                  return checked
                                    ? field.onChange([...field.value, option.value])
                                    : field.onChange(
                                        field.value?.filter((value: string) => value !== option.value)
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className='text-foreground/90 cursor-pointer font-normal'>
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CheckboxField
                  control={form.control}
                  name='sleepDisorderDiagnoses.osaTreatmentEffective'
                  label='My treatment is effective'
                  description='Uncheck if your treatment is not fully effective'
                />

                {osaTreatmentEffective === false && (
                  <Alert className='alert-warning'>
                    <Info className='h-4 w-4 text-amber-600' />
                    <AlertDescription className='text-amber-900'>
                      You indicated that despite being treated for sleep apnea, you are still having
                      symptoms. Please discuss this with your primary care provider. You may benefit
                      from a consultation with a sleep specialist.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Restless Legs Syndrome Section */}
      <div className='border-border bg-card/50 space-y-4 rounded-xl border p-5'>
        <h3 className='text-muted-foreground text-sm font-semibold tracking-wide uppercase'>
          Restless Legs Syndrome (RLS)
        </h3>

        <CheckboxField
          control={form.control}
          name='sleepDisorderDiagnoses.diagnosedRLS'
          label='I have been diagnosed with restless legs syndrome (RLS) or periodic limb movement disorder'
        />

        {diagnosedRLS && (
          <div className='bg-muted/30 space-y-4 rounded-lg p-4'>
            <CheckboxField
              control={form.control}
              name='sleepDisorderDiagnoses.rlsTreated'
              label='Are you being treated for RLS?'
            />

            {rlsTreated && (
              <>
                <FormField
                  control={form.control}
                  name='sleepDisorderDiagnoses.rlsTreatment'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-base font-medium'>
                        What treatment do you use?
                      </FormLabel>
                      <p className='text-muted-foreground text-sm'>Check all that apply</p>
                      <div className='mt-3 space-y-2'>
                        {rlsTreatmentOptions.map(option => (
                          <FormItem
                            key={option.value}
                            className='hover:bg-muted/50 has-[[data-state=checked]]:border-primary/20 has-[[data-state=checked]]:bg-primary/5 flex flex-row items-center space-y-0 space-x-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors'
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.value)}
                                onCheckedChange={checked => {
                                  return checked
                                    ? field.onChange([...field.value, option.value])
                                    : field.onChange(
                                        field.value?.filter((value: string) => value !== option.value)
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className='text-foreground/90 cursor-pointer font-normal'>
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormDescription className='text-muted-foreground mt-3'>
                        Common treatments include ferrous gluconate or ferrous sulfate supplementation
                        for individuals with ferritin levels below 75mcg/ml
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CheckboxField
                  control={form.control}
                  name='sleepDisorderDiagnoses.rlsTreatmentEffective'
                  label='My treatment is effective'
                  description='Uncheck if your treatment is not fully effective'
                />

                {rlsTreatmentEffective === false && (
                  <Alert className='alert-warning'>
                    <Info className='h-4 w-4 text-amber-600' />
                    <AlertDescription className='text-amber-900'>
                      You indicated that despite being treated for restless legs syndrome, you are
                      still having symptoms. Please discuss this with your primary care provider.
                      You may benefit from a consultation with a sleep specialist.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Info about untreated conditions */}
      {diagnosedOSA && !osaTreated && (
        <Alert className='alert-warning'>
          <Info className='h-4 w-4 text-amber-600' />
          <AlertDescription className='text-amber-900'>
            You have been diagnosed with sleep apnea but are not currently receiving treatment.
            Untreated sleep apnea can lead to serious health complications including high blood
            pressure, heart disease, and stroke. Please discuss treatment options with your
            healthcare provider.
          </AlertDescription>
        </Alert>
      )}

      {diagnosedRLS && !rlsTreated && (
        <Alert>
          <Info className='h-4 w-4' />
          <AlertDescription>
            You have been diagnosed with RLS but are not currently receiving treatment. Treatment
            can significantly improve your sleep quality. Consider discussing options with your
            healthcare provider.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
