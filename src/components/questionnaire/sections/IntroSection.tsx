import { AlertCircle, Lock, FileText, Clock, Moon, Sun, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function IntroSection() {
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
          This comprehensive questionnaire will help us understand your sleep patterns and provide
          you with personalized recommendations to improve your sleep health.
        </p>
      </div>

      {/* What to Expect - Feature Cards */}
      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='group border-border/50 bg-card/50 hover:border-primary/20 hover:bg-card rounded-xl border p-5 transition-all'>
          <div className='bg-primary/10 text-primary group-hover:bg-primary/15 mb-3 flex h-10 w-10 items-center justify-center rounded-lg transition-colors'>
            <Clock className='h-5 w-5' />
          </div>
          <h3 className='text-foreground mb-1 font-semibold'>15-20 Minutes</h3>
          <p className='text-muted-foreground text-sm'>
            Complete at your own pace with progress saved automatically
          </p>
        </div>

        <div className='group border-border/50 bg-card/50 hover:border-primary/20 hover:bg-card rounded-xl border p-5 transition-all'>
          <div className='bg-primary/10 text-primary group-hover:bg-primary/15 mb-3 flex h-10 w-10 items-center justify-center rounded-lg transition-colors'>
            <Sun className='h-5 w-5' />
          </div>
          <h3 className='text-foreground mb-1 font-semibold'>Daytime & Nighttime</h3>
          <p className='text-muted-foreground text-sm'>
            Questions about your daily energy and nightly sleep patterns
          </p>
        </div>

        <div className='group border-border/50 bg-card/50 hover:border-primary/20 hover:bg-card rounded-xl border p-5 transition-all'>
          <div className='bg-primary/10 text-primary group-hover:bg-primary/15 mb-3 flex h-10 w-10 items-center justify-center rounded-lg transition-colors'>
            <FileText className='h-5 w-5' />
          </div>
          <h3 className='text-foreground mb-1 font-semibold'>Personalized Report</h3>
          <p className='text-muted-foreground text-sm'>
            Receive a detailed sleep health report with actionable insights
          </p>
        </div>

        <div className='group border-border/50 bg-card/50 hover:border-primary/20 hover:bg-card rounded-xl border p-5 transition-all'>
          <div className='bg-primary/10 text-primary group-hover:bg-primary/15 mb-3 flex h-10 w-10 items-center justify-center rounded-lg transition-colors'>
            <Sparkles className='h-5 w-5' />
          </div>
          <h3 className='text-foreground mb-1 font-semibold'>Expert Guidance</h3>
          <p className='text-muted-foreground text-sm'>
            Get recommendations based on 4 decades of sleep medicine expertise
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
              Most questions apply to the last week. If you were on vacation or sick, please think
              about your most recent typical work/school week.
            </span>
          </AlertDescription>
        </Alert>
      </div>

      {/* Call to Action */}
      <div className='from-primary/5 via-primary/10 to-accent/5 rounded-xl bg-gradient-to-r p-6 text-center'>
        <p className='text-foreground/80 text-sm font-medium'>
          Ready to understand your sleep better?
        </p>
        <p className='text-muted-foreground mt-1 text-xs'>
          Click <span className='text-primary font-medium'>&quot;Continue&quot;</span> below to
          begin your assessment
        </p>
      </div>
    </div>
  );
}
