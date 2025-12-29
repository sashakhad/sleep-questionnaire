import { UseFormReturn } from 'react-hook-form';
import { QuestionnaireFormData } from '@/validations/questionnaire';
import { NumberField } from '../form-fields/NumberField';
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
import { Coffee, Wine, Activity, AlertCircle } from 'lucide-react';

interface LifestyleSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

export function LifestyleSection({ form }: LifestyleSectionProps) {
  const caffeinePerDay = form.watch('lifestyle.caffeinePerDay');
  const lastCaffeineTime = form.watch('lifestyle.lastCaffeineTime');
  const alcoholPerWeek = form.watch('lifestyle.alcoholPerWeek');
  const exerciseDaysPerWeek = form.watch('lifestyle.exerciseDaysPerWeek');

  const lateCaffeine = lastCaffeineTime && parseInt(lastCaffeineTime.split(':')[0] ?? '0') >= 14; // After 2 PM

  return (
    <div className='space-y-6'>
      <div className='text-lg font-medium'>Lifestyle Factors Affecting Sleep</div>

      <Alert className='alert-info'>
        <Activity className='text-primary h-4 w-4' />
        <AlertDescription className='text-foreground/90'>
          Your daily habits including caffeine consumption, alcohol use, and exercise patterns can
          significantly impact your sleep quality and timing.
        </AlertDescription>
      </Alert>

      {/* Caffeine section */}
      <div className='border-border bg-card/50 space-y-4 rounded-xl border p-5'>
        <div className='flex items-center space-x-2'>
          <Coffee className='h-5 w-5 text-amber-700' />
          <h3 className='text-muted-foreground text-sm font-semibold tracking-wide uppercase'>
            Caffeine Consumption
          </h3>
        </div>

        <NumberField
          control={form.control}
          name='lifestyle.caffeinePerDay'
          label='How many servings of caffeinated food or beverages do you consume per day?'
          placeholder='Number of servings'
          description='Include coffee, tea, iced tea, sodas, energy drinks, and chocolate'
          min={0}
          max={20}
        />

        {caffeinePerDay >= 1 && (
          <FormField
            control={form.control}
            name='lifestyle.lastCaffeineTime'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  What time do you have your final caffeinated food or beverage?
                </FormLabel>
                <FormControl>
                  <Input type='time' {...field} className='max-w-xs' />
                </FormControl>
                <FormDescription>
                  Caffeine can affect sleep for 6-8 hours after consumption
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {/* Alcohol section */}
      <div className='border-border bg-card/50 space-y-4 rounded-xl border p-5'>
        <div className='flex items-center space-x-2'>
          <Wine className='h-5 w-5 text-purple-600' />
          <h3 className='text-muted-foreground text-sm font-semibold tracking-wide uppercase'>
            Alcohol Consumption (Weekly)
          </h3>
        </div>

        <NumberField
          control={form.control}
          name='lifestyle.alcoholPerWeek'
          label='How many alcoholic drinks do you have per week?'
          placeholder='Number of drinks'
          description='Include beer, wine, cocktails, and all other alcoholic beverages'
          min={0}
          max={50}
        />
      </div>

      {/* Exercise section */}
      <div className='border-border bg-card/50 space-y-4 rounded-xl border p-5'>
        <div className='flex items-center space-x-2'>
          <Activity className='h-5 w-5 text-green-600' />
          <h3 className='text-muted-foreground text-sm font-semibold tracking-wide uppercase'>
            Exercise Habits
          </h3>
        </div>

        <NumberField
          control={form.control}
          name='lifestyle.exerciseDaysPerWeek'
          label='How many days do you exercise during a typical week?'
          placeholder='Days per week'
          min={0}
          max={7}
        />

        {exerciseDaysPerWeek > 0 && (
          <>
            <NumberField
              control={form.control}
              name='lifestyle.exerciseDuration'
              label='How long do you typically exercise?'
              placeholder='Minutes'
              description='Average duration per session in minutes'
              min={0}
              max={300}
            />

            <FormField
              control={form.control}
              name='lifestyle.exerciseEndTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What time does your exercise typically end?</FormLabel>
                  <FormControl>
                    <Input type='time' {...field} className='max-w-xs' />
                  </FormControl>
                  <FormDescription>Late evening exercise can interfere with sleep</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </div>

      {/* Caffeine warnings */}
      {caffeinePerDay > 4 && (
        <Alert className='alert-warning'>
          <Coffee className='h-4 w-4 text-amber-600' />
          <AlertDescription className='text-amber-900'>
            <strong>High Caffeine Intake</strong>
            <br />
            You&apos;re consuming more than 4 caffeinated beverages per day. High caffeine intake
            can lead to increased anxiety, disrupted sleep, and dependency. Consider gradually
            reducing your intake, especially in the afternoon and evening.
          </AlertDescription>
        </Alert>
      )}

      {lateCaffeine && (
        <Alert className='alert-warning'>
          <AlertCircle className='h-4 w-4 text-amber-600' />
          <AlertDescription className='text-amber-900'>
            <strong>Late Caffeine Consumption</strong>
            <br />
            You&apos;re consuming caffeine after 2 PM. Caffeine has a half-life of 5-6 hours,
            meaning it can significantly impact your ability to fall asleep and sleep quality. Try
            to have your last caffeinated beverage before noon.
          </AlertDescription>
        </Alert>
      )}

      {/* Alcohol warnings */}
      {alcoholPerWeek > 14 && (
        <Alert className='alert-danger'>
          <Wine className='h-4 w-4 text-red-600' />
          <AlertDescription className='text-red-900'>
            <strong>High Alcohol Consumption</strong>
            <br />
            You&apos;re consuming more than 14 alcoholic drinks per week. While alcohol may
            initially help you fall asleep, it significantly disrupts sleep architecture, reducing
            REM sleep and causing frequent awakenings. Consider reducing alcohol intake, especially
            within 3 hours of bedtime.
          </AlertDescription>
        </Alert>
      )}

      {alcoholPerWeek > 7 && alcoholPerWeek <= 14 && (
        <Alert>
          <Wine className='h-4 w-4' />
          <AlertDescription>
            Moderate alcohol consumption can still impact sleep quality. Alcohol disrupts sleep
            cycles and can cause early morning awakenings. Try to avoid alcohol within 3 hours of
            bedtime for better sleep.
          </AlertDescription>
        </Alert>
      )}

      {/* Exercise feedback */}
      {exerciseDaysPerWeek === 0 && (
        <Alert className='alert-warning'>
          <Activity className='h-4 w-4 text-amber-600' />
          <AlertDescription className='text-amber-900'>
            <strong>No Regular Exercise</strong>
            <br />
            Regular exercise is one of the best ways to improve sleep quality. Even moderate
            exercise like a 30-minute walk can significantly improve sleep. Try to incorporate some
            physical activity into your daily routine, preferably in the morning or afternoon.
          </AlertDescription>
        </Alert>
      )}

      {exerciseDaysPerWeek >= 5 && (
        <Alert className='alert-success'>
          <Activity className='h-4 w-4 text-green-600' />
          <AlertDescription className='text-green-900'>
            <strong>Great Exercise Habits!</strong>
            <br />
            You&apos;re exercising regularly, which is excellent for sleep quality. Just make sure
            to finish vigorous exercise at least 3 hours before bedtime to allow your body
            temperature and arousal levels to decrease.
          </AlertDescription>
        </Alert>
      )}

      {/* Late exercise warning */}
      {form.watch('lifestyle.exerciseEndTime') &&
        parseInt(form.watch('lifestyle.exerciseEndTime')?.split(':')[0] ?? '0') >= 20 && (
          <Alert>
            <Activity className='h-4 w-4' />
            <AlertDescription>
              Exercising within 3 hours of bedtime can make it harder to fall asleep. Your body
              temperature and arousal levels need time to decrease after exercise. Try to schedule
              workouts earlier in the day if possible.
            </AlertDescription>
          </Alert>
        )}
    </div>
  );
}
