import { UseFormReturn } from 'react-hook-form';
import { QuestionnaireFormData } from '@/validations/questionnaire';
import { CheckboxField } from '../form-fields/CheckboxField';
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
import { AlertCircle, Info } from 'lucide-react';

interface RestlessLegsSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

const treatmentOptions = [
  { value: 'iron', label: 'Iron supplements' },
  { value: 'dopamine', label: 'Dopamine agonists' },
  { value: 'gabapentin', label: 'Gabapentin' },
  { value: 'other', label: 'Other medication' },
];

export function RestlessLegsSection({ form }: RestlessLegsSectionProps) {
  const diagnosed = form.watch('restlessLegs.diagnosed');
  const hasSymptoms =
    form.watch('restlessLegs.troubleLyingStill') ||
    form.watch('restlessLegs.urgeToMoveLegs') ||
    form.watch('restlessLegs.movementRelieves');

  return (
    <div className='space-y-6'>
      <div className='text-lg font-medium'>Restless Legs Syndrome (RLS) and Movement Disorders</div>

      <Alert className='alert-info'>
        <Info className='h-4 w-4 text-primary' />
        <AlertDescription className='text-foreground/90'>
          Restless legs syndrome is a relatively common disorder that increases discomfort in bed
          and interferes with your ability to fall asleep. RLS can be associated with insufficient
          availability of dopamine, low levels of ferritin, pregnancy, or as an unwanted effect of
          some medications including SSRIs.
        </AlertDescription>
      </Alert>

      {/* Diagnosed with RLS */}
      <CheckboxField
        control={form.control}
        name='restlessLegs.diagnosed'
        label='Have you been diagnosed with restless legs syndrome (RLS) or periodic limb movement disorder?'
      />

      {/* If diagnosed, show treatment options */}
      {diagnosed && (
        <div className='border-border bg-card/50 space-y-4 rounded-xl border p-5'>
          <FormField
            control={form.control}
            name='restlessLegs.treatment'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base font-medium'>
                  Are you being treated for RLS?
                </FormLabel>
                <p className='text-muted-foreground text-sm'>Check all that apply</p>
                <div className='mt-3 space-y-2'>
                  {treatmentOptions.map(option => (
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
                  Common treatments include ferrous gluconate or ferrous sulfate supplementation for
                  individuals with ferritin levels below 75mcg/ml
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {/* RLS Symptoms */}
      <div className='space-y-4'>
        <h3 className='font-medium'>Please answer the following about your legs at bedtime:</h3>

        <CheckboxField
          control={form.control}
          name='restlessLegs.troubleLyingStill'
          label='Do you have trouble lying still while trying to fall asleep at night?'
        />

        <CheckboxField
          control={form.control}
          name='restlessLegs.urgeToMoveLegs'
          label='Do you have an urge to move your legs while lying in bed at night?'
        />

        <CheckboxField
          control={form.control}
          name='restlessLegs.movementRelieves'
          label='Does movement relieve the uncomfortable feelings in your legs?'
        />

        <CheckboxField
          control={form.control}
          name='restlessLegs.daytimeDiscomfort'
          label='Do you have leg discomfort during the day?'
        />
      </div>

      {/* Warning message if symptoms but not diagnosed */}
      {!diagnosed && hasSymptoms && (
        <Alert className='alert-warning'>
          <AlertCircle className='h-4 w-4 text-amber-600' />
          <AlertDescription className='text-amber-900'>
            Your answers suggest that you may have restless legs syndrome. We strongly encourage you
            to discuss treatment options with your sleep specialist or primary care doctor. RLS is
            often exacerbated when someone is sleep deprived, using excessive caffeine, or
            experiencing increased stress.
          </AlertDescription>
        </Alert>
      )}

      {/* Info for diagnosed but not treated */}
      {diagnosed && form.watch('restlessLegs.treatment')?.length === 0 && (
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
