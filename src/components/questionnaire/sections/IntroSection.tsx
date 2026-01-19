import { UseFormReturn } from 'react-hook-form';
import { AlertCircle, Lock, FileText, Clock, Moon, Sun, Heart } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { QuestionnaireFormData } from '@/validations/questionnaire';

interface IntroSectionProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

export function IntroSection({ form }: IntroSectionProps) {
  return (
    <div className='space-y-8'>
      {/* Welcome Hero */}
      <div className='text-center'>
        <div className='from-primary/20 to-accent/20 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br'>
          <Moon className='text-primary h-10 w-10' />
        </div>
        <h1 className='text-foreground mb-4 text-3xl font-bold tracking-tight md:text-4xl'>
          Welcome to Your Sleep Assessment
        </h1>
        <p className='text-muted-foreground mx-auto max-w-xl text-lg'>
          Improving sleep health includes identifying sleep disorders and optimizing your sleep
          habits to improve your well-being, longevity, and general happiness and health.
        </p>
      </div>

      {/* What to Expect - Feature Cards */}
      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='group border-border/50 bg-card/50 hover:border-primary/20 hover:bg-card rounded-xl border p-5 transition-all'>
          <div className='bg-primary/10 text-primary group-hover:bg-primary/15 mb-3 flex h-10 w-10 items-center justify-center rounded-lg transition-colors'>
            <Clock className='h-5 w-5' />
          </div>
          <h3 className='text-foreground mb-1 font-semibold'>Questionnaire: 15-20 Minutes</h3>
          <p className='text-muted-foreground text-sm'>
            Complete at your own pace with progress saved automatically and a free personalized
            report with recommendations provided.
          </p>
        </div>

        <div className='group border-border/50 bg-card/50 hover:border-primary/20 hover:bg-card rounded-xl border p-5 transition-all'>
          <div className='bg-primary/10 text-primary group-hover:bg-primary/15 mb-3 flex h-10 w-10 items-center justify-center rounded-lg transition-colors'>
            <Sun className='h-5 w-5' />
          </div>
          <h3 className='text-foreground mb-1 font-semibold'>We Evaluate Nighttime & Daytime</h3>
          <p className='text-muted-foreground text-sm'>
            Your day and nighttime habits so that we can support your health and well being.
            Questions about your sleep patterns, daily energy, attention, and happiness.
          </p>
        </div>

        <div className='group border-border/50 bg-card/50 hover:border-primary/20 hover:bg-card rounded-xl border p-5 transition-all'>
          <div className='bg-primary/10 text-primary group-hover:bg-primary/15 mb-3 flex h-10 w-10 items-center justify-center rounded-lg transition-colors'>
            <FileText className='h-5 w-5' />
          </div>
          <h3 className='text-foreground mb-1 font-semibold'>Free & Anonymous Report</h3>
          <p className='text-muted-foreground text-sm'>
            You will receive a free and personalized anonymous report with specific guidance on your
            next steps to improve your sleep health or address a probable sleep disorder.
          </p>
        </div>

        <div className='group border-border/50 bg-card/50 hover:border-primary/20 hover:bg-card rounded-xl border p-5 transition-all'>
          <div className='bg-primary/10 text-primary group-hover:bg-primary/15 mb-3 flex h-10 w-10 items-center justify-center rounded-lg transition-colors'>
            <Heart className='h-5 w-5' />
          </div>
          <h3 className='text-foreground mb-1 font-semibold'>Expert Guidance</h3>
          <p className='text-muted-foreground text-sm'>
            Our website provides you with essential science-based sleep information and will guide
            you toward the next steps. Recommendations are provided by our board certified sleep
            doctors.
          </p>
        </div>
      </div>

      {/* Info Alerts */}
      <div className='space-y-4'>
        <Alert className='border-primary/20 bg-primary/5'>
          <Lock className='text-primary h-4 w-4' />
          <AlertDescription className='text-foreground/90'>
            <strong className='text-foreground'>Your Privacy is Protected</strong>
            <br />
            <span className='text-muted-foreground'>
              The information provided will be de-identified and not linked to you unless you choose
              to receive services from our sleep experts. We are bound by federal and state laws to
              protect your privacy.
            </span>
          </AlertDescription>
        </Alert>

        <Alert className='border-amber-500/20 bg-amber-50/50'>
          <AlertCircle className='h-4 w-4 text-amber-600' />
          <AlertDescription className='text-foreground/90'>
            <strong className='text-foreground'>Before You Begin</strong>
            <br />
            <span className='text-muted-foreground'>
              Remember to think about the average over the last typical week. If you were on
              vacation or sick, please think about your most recent typical work/school week.
            </span>
          </AlertDescription>
        </Alert>
      </div>

      {/* Disclaimer */}
      <div className='border-border bg-card/50 space-y-4 rounded-xl border p-5'>
        <h3 className='text-foreground font-semibold'>Important Disclaimer</h3>
        <p className='text-muted-foreground text-sm leading-relaxed'>
          This questionnaire does not provide a sleep diagnosis and is not a substitute for medical
          evaluation. It may miss certain sleep or medical problems. You are encouraged to share
          your results with your primary care clinician to discuss any concerns and possible next
          steps to improve your sleep health. Please discuss all symptoms or questions with your
          primary care clinician.
        </p>

        <FormField
          control={form.control}
          name='intro.acceptedDisclaimer'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-y-0 space-x-3 rounded-lg border border-amber-200/50 bg-amber-50/30 p-4'>
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel className='text-foreground cursor-pointer font-medium'>
                  I have read and understand the service that we provide
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>

      {/* Call to Action */}
      <div className='from-primary/5 via-primary/10 to-accent/5 rounded-xl bg-gradient-to-r p-6 text-center'>
        <p className='text-foreground/80 text-sm font-medium'>
          Ready to understand your sleep better?
        </p>
        <p className='text-muted-foreground mt-1 text-xs'>
          Accept the disclaimer above, then click{' '}
          <span className='text-primary font-medium'>&quot;Continue&quot;</span> to begin your
          assessment
        </p>
      </div>
    </div>
  );
}
