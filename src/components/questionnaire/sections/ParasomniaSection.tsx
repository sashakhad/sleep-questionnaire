import { UseFormReturn } from 'react-hook-form';
import { QuestionnaireFormData } from '@/validations/questionnaire';
import { CheckboxField } from '../form-fields/CheckboxField';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';

interface ParasomniaSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

const nightBehaviors = [
  { value: 'walk', label: 'Walk' },
  { value: 'eating', label: 'Eating' },
  { value: 'confused', label: 'Appear confused' },
  { value: 'upset', label: 'Are very upset and cannot be calmed' },
];

export function ParasomniaSection({ form }: ParasomniaSectionProps) {
  const hasNightBehaviors = form.watch('parasomnia.nightBehaviors')?.length > 0;
  const remembersEvents = form.watch('parasomnia.remembersEvents');
  const actsOutDreams = form.watch('parasomnia.actsOutDreams');

  return (
    <div className='space-y-6'>
      <div className='text-lg font-medium'>Sleep Behaviors and Parasomnias</div>

      <Alert className='alert-info'>
        <Info className='text-primary h-4 w-4' />
        <AlertDescription className='text-foreground/90'>
          Parasomnias are unusual behaviors during sleep that can affect your safety and sleep
          quality. These include sleepwalking, sleep talking, night terrors, and other behaviors.
        </AlertDescription>
      </Alert>

      {/* Night behaviors */}
      <FormField
        control={form.control}
        name='parasomnia.nightBehaviors'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-base'>
              Have you been told that you wake in the middle of the night and: (check all that
              apply)
            </FormLabel>
            <div className='mt-2 space-y-2'>
              {nightBehaviors.map(behavior => (
                <FormItem
                  key={behavior.value}
                  className='flex flex-row items-start space-y-0 space-x-3'
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(behavior.value)}
                      onCheckedChange={checked => {
                        return checked
                          ? field.onChange([...field.value, behavior.value])
                          : field.onChange(
                              field.value?.filter((value: string) => value !== behavior.value)
                            );
                      }}
                    />
                  </FormControl>
                  <FormLabel className='font-normal'>{behavior.label}</FormLabel>
                </FormItem>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Memory of events - only show if they have night behaviors */}
      {hasNightBehaviors && (
        <>
          <CheckboxField
            control={form.control}
            name='parasomnia.remembersEvents'
            label='I have a clear memory of these events'
            description="Most people with parasomnias don't remember the events"
          />

          <CheckboxField
            control={form.control}
            name='parasomnia.actsOutDreams'
            label='I act out my dreams'
            description='This may indicate REM Behavioral Disorder'
          />

          <CheckboxField
            control={form.control}
            name='parasomnia.hasInjuredOrLeftHome'
            label='I have injured myself or others, or I have left my home'
            description='This is a serious safety concern that should be addressed immediately'
          />
        </>
      )}

      {/* RBD Warning */}
      {remembersEvents && actsOutDreams && (
        <Alert className='alert-danger'>
          <AlertTriangle className='h-4 w-4 text-red-600' />
          <AlertDescription className='text-red-900'>
            <strong>Important Safety Notice</strong>
            <br />
            Your answers suggest you should be evaluated for REM Behavioral Disorder (RBD), which is
            more common among men over 65. The immediate risk is injury to yourself or a bed
            partner. We suggest you prioritize discussing your symptoms with a sleep specialist or
            neurologist who may order a sleep study.
          </AlertDescription>
        </Alert>
      )}

      {/* Bedwetting */}
      <CheckboxField
        control={form.control}
        name='parasomnia.bedwetting'
        label='I wet the bed more than 1 night per month'
        description='If yes, we suggest discussing this with your primary care doctor or an endocrinologist'
      />

      {/* Safety warning for parasomnia behaviors */}
      {hasNightBehaviors && (
        <Alert className='alert-warning'>
          <AlertTriangle className='h-4 w-4 text-amber-600' />
          <AlertDescription className='text-amber-900'>
            <strong>Safety Measures Recommended</strong>
            <br />
            The most important initial step is to assure your safety and others who live in your
            home. Some parasomnias (nocturnal eating and cooking, sleepwalking) can result in
            injuries. Until you receive treatment, take safety measures by using alarms and alerting
            others in your home that you should be observed or calmly guided back to bed.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
