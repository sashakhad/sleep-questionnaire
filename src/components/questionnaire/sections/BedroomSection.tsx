import { UseFormReturn } from 'react-hook-form';
import { QuestionnaireFormData } from '@/validations/questionnaire';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Home, Info } from 'lucide-react';

interface BedroomSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

interface RatingFieldProps {
  control: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  name: string;
  label: string;
  description?: string;
}

function RatingField({ control, name, label, description }: RatingFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='text-base font-medium'>{label}</FormLabel>
          <FormControl>
            <div className='space-y-3 pt-2'>
              <Slider
                min={1}
                max={10}
                step={1}
                value={[field.value]}
                onValueChange={value => field.onChange(value[0])}
                className='w-full'
              />
              <div className='text-muted-foreground flex justify-between text-xs font-medium'>
                <span>1 (Worst)</span>
                <span className='bg-primary/10 text-primary inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold'>
                  {field.value}
                </span>
                <span>10 (Best)</span>
              </div>
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function BedroomSection({ form }: BedroomSectionProps) {
  const relaxing = form.watch('bedroom.relaxing');
  const comfortable = form.watch('bedroom.comfortable');
  const dark = form.watch('bedroom.dark');
  const quiet = form.watch('bedroom.quiet');

  const averageScore = (relaxing + comfortable + dark + quiet) / 4;

  return (
    <div className='space-y-6'>
      <div className='text-lg font-medium'>Bedroom Environment Assessment</div>

      <Alert className='alert-info'>
        <Home className='text-primary h-4 w-4' />
        <AlertDescription className='text-foreground/90'>
          Your bedroom environment plays a crucial role in sleep quality. Please rate your bedroom
          or the place where you typically sleep on a scale of 1-10, with 1 being worst and 10 being
          best.
        </AlertDescription>
      </Alert>

      {/* Relaxing environment */}
      <RatingField
        control={form.control}
        name='bedroom.relaxing'
        label='How relaxing and comfortable is your bedroom environment?'
        description='Consider factors like clutter, decoration, and overall atmosphere'
      />

      {/* Comfortable bed */}
      <RatingField
        control={form.control}
        name='bedroom.comfortable'
        label='How comfortable is your bed and bedding?'
        description='Consider your mattress, pillows, sheets, and blankets'
      />

      {/* Darkness */}
      <RatingField
        control={form.control}
        name='bedroom.dark'
        label="How dark is your bedroom when you're trying to sleep?"
        description='Consider light from windows, electronics, and other sources'
      />

      {/* Quietness */}
      <RatingField
        control={form.control}
        name='bedroom.quiet'
        label='How quiet is your bedroom?'
        description='Consider noise from outside, other rooms, or household members'
      />

      {/* Overall score display */}
      <div className='border-border bg-card/50 rounded-xl border p-5'>
        <h3 className='text-muted-foreground mb-3 text-sm font-semibold tracking-wide uppercase'>
          Overall Bedroom Score
        </h3>
        <div className='flex items-center space-x-4'>
          <div className='bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold'>
            {averageScore.toFixed(1)}
          </div>
          <div className='text-muted-foreground text-sm'>
            {averageScore >= 8
              ? 'Excellent environment!'
              : averageScore >= 6
                ? 'Good, but room for improvement'
                : averageScore >= 4
                  ? 'Several areas need attention'
                  : 'Significant improvements needed'}
          </div>
        </div>
      </div>

      {/* Poor environment warning */}
      {averageScore < 6 && (
        <Alert className='alert-warning'>
          <Info className='h-4 w-4 text-amber-600' />
          <AlertDescription className='text-amber-900'>
            <strong>Room for Improvement</strong>
            <br />
            We provide several recommendations to improve your sleep by improving the comfort of
            your bedroom.
          </AlertDescription>
        </Alert>
      )}

      {/* Specific issue warnings */}
      {dark < 4 && (
        <Alert>
          <Home className='h-4 w-4' />
          <AlertDescription>
            <strong>Light Exposure Issue</strong>
            <br />
            Excessive light in your bedroom can suppress melatonin production and disrupt sleep.
            Even small amounts of light from electronics can impact sleep quality. Consider removing
            or covering all light sources and using blackout curtains.
          </AlertDescription>
        </Alert>
      )}

      {quiet < 4 && (
        <Alert>
          <Home className='h-4 w-4' />
          <AlertDescription>
            <strong>Noise Disturbance</strong>
            <br />
            Noise is significantly impacting your sleep environment. If you share a bed with someone
            who snores, consider separate sleeping arrangements or medical evaluation for the
            snoring. For external noise, try white noise machines, fans, or earplugs designed for
            sleeping.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
