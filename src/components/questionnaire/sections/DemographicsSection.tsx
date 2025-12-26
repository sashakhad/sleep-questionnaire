import { UseFormReturn } from 'react-hook-form';
import { QuestionnaireFormData } from '@/validations/questionnaire';
import { NumberField } from '../form-fields/NumberField';
import { SelectField } from '../form-fields/SelectField';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Info } from 'lucide-react';

interface DemographicsSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

export function DemographicsSection({ form }: DemographicsSectionProps) {
  const weight = form.watch('demographics.weight');
  const height = form.watch('demographics.height');
  const yearOfBirth = form.watch('demographics.yearOfBirth');

  // Calculate age from year of birth
  const currentYear = new Date().getFullYear();
  const age = yearOfBirth ? currentYear - yearOfBirth : null;

  // Calculate BMI if we have both weight and height
  let bmi = null;
  if (weight && height && weight > 0 && height > 0) {
    // Convert height from inches to meters, weight from lbs to kg
    const heightInMeters = height * 0.0254;
    const weightInKg = weight * 0.453592;
    bmi = weightInKg / (heightInMeters * heightInMeters);
  }

  return (
    <div className='space-y-6'>
      <div className='text-lg font-medium'>About You</div>

      <Alert className='alert-info'>
        <User className='h-4 w-4 text-primary' />
        <AlertDescription className='text-foreground/90'>
          This information helps us provide more personalized recommendations. Age and body
          measurements can influence sleep patterns and the likelihood of certain sleep disorders.
        </AlertDescription>
      </Alert>

      {/* Year of Birth */}
      <NumberField
        control={form.control}
        name='demographics.yearOfBirth'
        label='What year were you born?'
        placeholder='e.g., 1990'
        min={1900}
        max={new Date().getFullYear()}
        description='Your birth year helps us understand age-related sleep patterns'
      />

      {/* Sex */}
      <SelectField
        control={form.control}
        name='demographics.sex'
        label='Sex'
        placeholder='Select an option'
        options={[
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'other', label: 'Other' },
          { value: 'prefer-not-to-say', label: 'Prefer not to say' },
        ]}
        description='Helps us understand sex-related sleep patterns'
      />

      {/* Weight and Height */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <NumberField
          control={form.control}
          name='demographics.weight'
          label='Weight'
          placeholder='Pounds'
          min={0}
          max={500}
          description='In pounds (lbs)'
        />

        <NumberField
          control={form.control}
          name='demographics.height'
          label='Height'
          placeholder='Inches'
          min={0}
          max={96}
          description="In inches (e.g., 70 for 5'10)"
        />
      </div>

      {/* BMI Display */}
      {bmi && (
        <div className='border-border bg-card/50 rounded-xl border p-5'>
          <h3 className='text-muted-foreground mb-3 text-sm font-semibold tracking-wide uppercase'>
            Body Mass Index (BMI)
          </h3>
          <div className='flex items-center space-x-4'>
            <div className='bg-primary/10 text-primary flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold'>
              {bmi.toFixed(1)}
            </div>
            <div className='text-muted-foreground text-sm'>
              {bmi < 18.5
                ? 'Underweight'
                : bmi < 25
                  ? 'Normal weight'
                  : bmi < 30
                    ? 'Overweight'
                    : 'Obese'}
            </div>
          </div>
        </div>
      )}

      {/* Zipcode */}
      <FormField
        control={form.control}
        name='demographics.zipcode'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Zipcode</FormLabel>
            <FormControl>
              <Input placeholder='e.g., 12345' {...field} className='max-w-xs' />
            </FormControl>
            <FormDescription>
              Helps us understand regional patterns and connect you with local resources
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* BMI and Sleep Apnea Warning */}
      {bmi && bmi >= 30 && (
        <Alert className='alert-warning'>
          <Info className='h-4 w-4 text-amber-600' />
          <AlertDescription className='text-amber-900'>
            <strong>BMI and Sleep Apnea Risk</strong>
            <br />A BMI of 30 or higher is associated with increased risk of obstructive sleep
            apnea. This is especially important if you also experience snoring, witnessed breathing
            pauses during sleep, or excessive daytime sleepiness. Consider discussing sleep apnea
            screening with your healthcare provider.
          </AlertDescription>
        </Alert>
      )}

      {/* Age-related sleep info */}
      {age && age >= 65 && (
        <Alert>
          <User className='h-4 w-4' />
          <AlertDescription>
            <strong>Age-Related Sleep Changes</strong>
            <br />
            Sleep patterns naturally change with age. After 65, it&apos;s common to experience:
            <ul className='mt-2 list-inside list-disc space-y-1'>
              <li>Earlier bedtimes and wake times (advanced sleep phase)</li>
              <li>More frequent nighttime awakenings</li>
              <li>Lighter sleep with less deep sleep</li>
              <li>Increased daytime napping</li>
            </ul>
            These changes are normal, but if they significantly impact your quality of life,
            treatments are available.
          </AlertDescription>
        </Alert>
      )}

      {/* Adolescent/young adult sleep info */}
      {age && age >= 12 && age <= 25 && (
        <Alert>
          <User className='h-4 w-4' />
          <AlertDescription>
            <strong>Sleep in Adolescents and Young Adults</strong>
            <br />
            Your age group commonly experiences delayed sleep phase, preferring to stay up late and
            wake up late. This biological tendency often conflicts with school or work schedules. If
            you&apos;re struggling with early morning obligations, you may benefit from light
            therapy and sleep schedule adjustments.
          </AlertDescription>
        </Alert>
      )}

      {/* Completion message */}
      <Alert className='alert-success'>
        <Info className='h-4 w-4 text-green-600' />
        <AlertDescription className='text-green-900'>
          <strong>Almost Done!</strong>
          <br />
          Thank you for providing this information. After you click &quot;Generate Report&quot;
          below, we&apos;ll analyze your responses and create a personalized sleep health report
          with specific recommendations based on your unique situation.
        </AlertDescription>
      </Alert>
    </div>
  );
}
