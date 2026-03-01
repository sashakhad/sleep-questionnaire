import { UseFormReturn } from 'react-hook-form';
import { getYear } from 'date-fns';
import { QuestionnaireFormData } from '@/validations/questionnaire';
import { NumberField } from '../form-fields/NumberField';
import { SelectField } from '../form-fields/SelectField';
import { YearComboboxField } from '../form-fields/YearComboboxField';
import { HeightField } from '../form-fields/HeightField';
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
  const sex = form.watch('demographics.sex');

  const currentYear = getYear(new Date());
  const isValidYear = yearOfBirth && yearOfBirth >= 1900 && yearOfBirth <= currentYear;
  const age = isValidYear ? currentYear - yearOfBirth : null;

  // Calculate BMI only when both values are in reasonable ranges
  // This prevents showing nonsense BMI while user is still typing
  // Minimum reasonable values: height >= 36 inches (3 feet), weight >= 50 lbs
  const isReasonableHeight = height && height >= 36 && height <= 96;
  const isReasonableWeight = weight && weight >= 50 && weight <= 500;
  
  let bmi: number | null = null;
  if (isReasonableWeight && isReasonableHeight) {
    // Convert height from inches to meters, weight from lbs to kg
    const heightInMeters = height * 0.0254;
    const weightInKg = weight * 0.453592;
    bmi = weightInKg / (heightInMeters * heightInMeters);
  }

  return (
    <div className='space-y-6'>
      <Alert className='alert-info'>
        <User className='text-primary h-4 w-4' />
        <AlertDescription className='text-foreground/90'>
          This information helps us provide more accurate recommendations. Age and body
          measurements can influence sleep patterns and the likelihood of certain sleep disorders.
        </AlertDescription>
      </Alert>

      {/* Year of Birth */}
      <YearComboboxField
        control={form.control}
        name='demographics.yearOfBirth'
        label='What year were you born?'
        placeholder='Select your birth year...'
        minYear={1920}
        maxYear={currentYear - 12}
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
          { value: 'transgender', label: 'Transgender' },
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
          label='Weight (lbs)'
          placeholder='e.g., 150'
          min={50}
          max={600}
        />

        <HeightField
          control={form.control}
          name='demographics.height'
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
      {age && age >= 55 && (
        <Alert>
          <User className='h-4 w-4' />
          <AlertDescription>
            <strong>Age-Related Sleep Changes</strong>
            <br />
            Sleep naturally changes with age. After 55, it&apos;s common to experience:
            <ul className='mt-2 list-inside list-disc space-y-1'>
              <li>Increasingly earlier bedtimes and wake times</li>
              <li>More frequent nighttime awakenings</li>
              <li>Perceiving sleep as lighter and more disrupted</li>
            </ul>
            These changes are normal and you will receive guidance in the sleep report
            to improve your sleep health and quality of life.
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
            Prior to the age of 25 there is a biological tendency for a delayed sleep phase, a
            preference to stay up late and wake up late. This may conflict with school or work
            schedules. If you&apos;re struggling with early morning obligations, you can shift your
            schedule. In your sleep report you will receive guidance on next steps to maintain a
            healthy schedule that does not interfere with your daily activities and improves your
            sleep health and quality of life.
          </AlertDescription>
        </Alert>
      )}

      {/* Women >45 perimenopausal info */}
      {age && age >= 45 && sex === 'female' && (
        <Alert>
          <User className='h-4 w-4' />
          <AlertDescription>
            <strong>Sleep and Hormonal Changes</strong>
            <br />
            Sleep disturbance in women in your age group is often related to pre- and perimenopausal
            hormone-related changes. We will provide you with specific information and guidance
            regarding these changes in your sleep report.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
