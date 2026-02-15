import { QuestionnaireFormData } from '@/validations/questionnaire';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Moon,
  Brain,
  Heart,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Printer,
  Download,
  ExternalLink,
  ClipboardList,
} from 'lucide-react';

interface ReportSectionProps {
  data: QuestionnaireFormData;
  onDownloadPDF?: () => void;
}

// EDS weighted scoring - activities with x2 weight are more concerning
const EDS_WEIGHTS: Record<string, number> = {
  stoplight: 2, // Very concerning - falling asleep at traffic lights
  lectures: 1,
  working: 1,
  conversation: 2, // Concerning - falling asleep during conversations
  evening: 1,
  meal: 2, // Concerning - falling asleep while eating
};

function calculateEDSScore(fallAsleepDuring: string[]): {
  score: number;
  severity: 'none' | 'mild' | 'moderate' | 'severe';
} {
  let score = 0;
  for (const activity of fallAsleepDuring) {
    score += EDS_WEIGHTS[activity] ?? 1;
  }

  // Severity thresholds based on spec:
  // 3-6 = Mild EDS (possible sleep debt)
  // 7+ = Moderate to Severe EDS (possible narcolepsy/hypersomnia)
  let severity: 'none' | 'mild' | 'moderate' | 'severe' = 'none';
  if (score >= 7) {
    severity = 'severe';
  } else if (score >= 5) {
    severity = 'moderate';
  } else if (score >= 3) {
    severity = 'mild';
  }

  return { score, severity };
}

interface SleepMetrics {
  scheduledTST: number; // Total Sleep Time
  unscheduledTST: number;
  scheduledSE: number; // Sleep Efficiency
  unscheduledSE: number;
  scheduledSOL: number; // Sleep Onset Latency
  unscheduledSOL: number;
  scheduledWASO: number; // Wake After Sleep Onset
  unscheduledWASO: number;
  midSleepScheduled: string;
  midSleepUnscheduled: string;
}

function calculateSleepMetrics(data: QuestionnaireFormData): SleepMetrics {
  // Helper to convert time string to minutes from midnight
  const timeToMinutes = (time: string): number => {
    if (!time) {
      return 0;
    }
    const [hours, minutes] = time.split(':').map(Number);
    return (hours ?? 0) * 60 + (minutes ?? 0);
  };

  // Helper to convert minutes to time string
  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Calculate for scheduled days
  const scheduledBedtime = timeToMinutes(data.scheduledSleep.lightsOutTime);
  const scheduledWaketime = timeToMinutes(data.scheduledSleep.wakeupTime);
  let scheduledTimeInBed = scheduledWaketime - scheduledBedtime;
  if (scheduledTimeInBed < 0) {
    scheduledTimeInBed += 1440;
  } // Handle crossing midnight

  const scheduledTST =
    scheduledTimeInBed -
    data.scheduledSleep.minutesToFallAsleep -
    data.scheduledSleep.minutesAwakeAtNight;
  const scheduledSE = scheduledTimeInBed > 0 ? (scheduledTST / scheduledTimeInBed) * 100 : 0;

  // Calculate mid-sleep time for scheduled days
  const scheduledMidSleep =
    scheduledBedtime + data.scheduledSleep.minutesToFallAsleep + scheduledTST / 2;

  // Calculate for unscheduled days
  const unscheduledBedtime = timeToMinutes(data.unscheduledSleep.lightsOutTime);
  const unscheduledWaketime = timeToMinutes(data.unscheduledSleep.wakeupTime);
  let unscheduledTimeInBed = unscheduledWaketime - unscheduledBedtime;
  if (unscheduledTimeInBed < 0) {
    unscheduledTimeInBed += 1440;
  }

  const unscheduledTST =
    unscheduledTimeInBed -
    data.unscheduledSleep.minutesToFallAsleep -
    data.unscheduledSleep.minutesAwakeAtNight;
  const unscheduledSE = unscheduledTimeInBed > 0 ? (unscheduledTST / unscheduledTimeInBed) * 100 : 0;

  // Calculate mid-sleep time for unscheduled days
  const unscheduledMidSleep =
    unscheduledBedtime + data.unscheduledSleep.minutesToFallAsleep + unscheduledTST / 2;

  return {
    scheduledTST: scheduledTST / 60, // Convert to hours
    unscheduledTST: unscheduledTST / 60,
    scheduledSE,
    unscheduledSE,
    scheduledSOL: data.scheduledSleep.minutesToFallAsleep,
    unscheduledSOL: data.unscheduledSleep.minutesToFallAsleep,
    scheduledWASO: data.scheduledSleep.minutesAwakeAtNight,
    unscheduledWASO: data.unscheduledSleep.minutesAwakeAtNight,
    midSleepScheduled: minutesToTime(scheduledMidSleep % 1440),
    midSleepUnscheduled: minutesToTime(unscheduledMidSleep % 1440),
  };
}

function getInsomniaSeverity(data: QuestionnaireFormData, metrics: SleepMetrics): string {
  const hasSOI = metrics.scheduledSOL > 30 || metrics.unscheduledSOL > 30;
  const hasSMI = metrics.scheduledWASO > 40 || metrics.unscheduledWASO > 40;
  const hasEMA =
    data.scheduledSleep.earlyWakeupMinutes && data.scheduledSleep.earlyWakeupMinutes > 20;
  const hasDaytimeImpairment =
    (data.daytime.sleepinessInterference ?? 0) >= 5 || (data.daytime.fatigueInterference ?? 0) >= 5;

  if (!hasSOI && !hasSMI && !hasEMA) {
    return 'none';
  }
  if (!hasDaytimeImpairment) {
    return 'subclinical';
  }

  const cancelsActivities = data.mentalHealth.cancelsAfterPoorSleep;
  if (cancelsActivities === '3+week') {
    return 'severe';
  }
  if (cancelsActivities === '1-2week') {
    return 'moderate';
  }
  return 'mild';
}

function getChronotype(metrics: SleepMetrics, preference: string): string {
  const midSleepHour = parseInt(metrics.midSleepScheduled.split(':')[0] ?? '0');

  if (preference === 'late' || midSleepHour >= 4) {
    return 'delayed';
  }
  if (preference === 'early' || midSleepHour <= 1) {
    return 'advanced';
  }
  return 'normal';
}

// Helper to format metric values — shows "N/A" when no sleep data was entered
function formatHours(hours: number): string {
  if (!Number.isFinite(hours) || (hours === 0 && hours <= 0)) {
    return 'N/A';
  }
  return `${hours.toFixed(1)} hours`;
}

function formatPercent(pct: number): string {
  if (!Number.isFinite(pct)) {
    return 'N/A';
  }
  return `${pct.toFixed(0)}%`;
}

function formatMinutes(mins: number): string {
  if (!Number.isFinite(mins)) {
    return 'N/A';
  }
  return `${mins} minutes`;
}

export function ReportSection({ data, onDownloadPDF }: ReportSectionProps) {
  const metrics = calculateSleepMetrics(data);
  const insomniaSeverity = getInsomniaSeverity(data, metrics);
  const chronotype = getChronotype(metrics, data.chronotype.preference);

  // Check if user entered sleep timing data
  const hasScheduledData = data.scheduledSleep.lightsOutTime !== '' && data.scheduledSleep.wakeupTime !== '';
  const hasUnscheduledData = data.unscheduledSleep.lightsOutTime !== '' && data.unscheduledSleep.wakeupTime !== '';

  // Calculate weighted EDS score
  const edsResult = calculateEDSScore(data.daytime.fallAsleepDuring);
  const hasEDSFromActivities = edsResult.severity !== 'none';

  // Identify major issues
  const hasInsomnia = insomniaSeverity !== 'none' && insomniaSeverity !== 'subclinical';
  const hasEDSFromNaps =
    data.daytime.plannedNaps.daysPerWeek >= 3 &&
    data.daytime.plannedNaps.duration &&
    ['30-90', '>90'].includes(data.daytime.plannedNaps.duration);
  const hasEDS = hasEDSFromActivities || hasEDSFromNaps;
  const hasOSA =
    data.breathingDisorders.stopsBreathing ||
    (data.breathingDisorders.snores && data.breathingDisorders.wakesWithDryMouth) ||
    (data.breathingDisorders.wakesWithDryMouth && data.breathingDisorders.mouthBreathesDay);
  const hasCOMISA = hasInsomnia && hasOSA; // Comorbid Insomnia and Sleep Apnea
  const hasRLS =
    data.restlessLegs.hardToLieStill &&
    data.restlessLegs.movementRelieves;
  const hasNightmares = data.nightmares.nightmaresPerWeek && data.nightmares.nightmaresPerWeek >= 3;
  const hasPoorHygiene =
    data.lifestyle.caffeinePerDay > 4 ||
    (data.lifestyle.lastCaffeineTime &&
      parseInt(data.lifestyle.lastCaffeineTime.split(':')[0] ?? '0') >= 14);
  const hasSevereTiredness =
    (data.daytime.sleepinessInterference ?? 0) >= 8 || (data.daytime.fatigueInterference ?? 0) >= 8;

  // Insufficient Sleep Syndrome detection
  // Criteria: < 7 hours sleep + daytime sleepiness/tiredness + not explained by other disorders
  const avgWeeklySleep = (metrics.scheduledTST * 5 + metrics.unscheduledTST * 2) / 7;
  const hasDaytimeSleepiness =
    (data.daytime.sleepinessInterference ?? 0) >= 5 ||
    (data.daytime.fatigueInterference ?? 0) >= 5 ||
    hasEDS ||
    data.daytime.fallAsleepDuring.length >= 3;
  const hasNarcolepsy =
    data.daytime.diagnosedNarcolepsy ||
    (data.daytime.weaknessWhenExcited.length > 0 && data.daytime.sleepParalysis);
  const hasInsufficientSleep =
    avgWeeklySleep < 7 && hasDaytimeSleepiness && !hasNarcolepsy && !hasOSA;

  // Chronic Fatigue / Fibromyalgia screening
  // Criteria: non-restorative sleep + muscle/joint pain + tiredness interferes
  const hasChronicFatigueSymptoms =
    data.daytime.nonRestorativeSleep &&
    data.daytime.muscleJointPain &&
    (data.daytime.fatigueInterference ?? 0) >= 5;
  const hasPainAffectingSleep =
    data.daytime.painAffectsSleep && (data.daytime.painSeverity ?? 0) >= 5;

  // Chronotype label
  const chronotypeLabel =
    chronotype === 'advanced'
      ? 'Morning Lark'
      : chronotype === 'delayed'
        ? 'Night Owl'
        : 'Neutral';

  // Sleep paralysis detection (K)
  const hasFrequentSleepParalysis = (data.daytime.sleepParalysisFrequency ?? 0) > 4;

  // Sleep disorder history (I)
  const previousDiagnoses = (data.sleepDisorderHistory?.previousDiagnoses ?? []).filter(
    (d: string) => d !== 'none'
  );
  const hasPreviousDiagnoses = previousDiagnoses.length > 0;

  const DISORDER_LABELS: Record<string, string> = {
    insomnia: 'Insomnia Disorder',
    osa: 'Obstructive Sleep Apnea Syndrome',
    csa: 'Central Sleep Apnea Syndrome',
    rls: 'Restless Leg Syndrome',
    plmd: 'Periodic Limb Movement Disorder',
    circadian: 'Circadian Rhythm Disorder',
    narcolepsy: 'Narcolepsy',
    hypersomnia: 'Idiopathic Hypersomnia',
    nightmares: 'Nightmare Disorder',
    parasomnia: 'Parasomnia',
    enuresis: 'Enuresis (bedwetting)',
    rbd: 'REM Behavioral Disorder',
    insufficient: 'Insufficient Sleep',
  };

  const currentYear = new Date().getFullYear();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className='space-y-8 print:space-y-4'>
      {/* Header */}
      <div className='space-y-3 text-center'>
        <div className='mb-2 flex items-center justify-center gap-2'>
          <Moon className='text-primary h-6 w-6' />
          <span className='text-primary text-xl font-bold tracking-tight'>SomnaHealth</span>
        </div>
        <div className='from-primary/20 to-accent/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br'>
          <Moon className='text-primary h-8 w-8' />
        </div>
        <h1 className='text-foreground text-3xl font-bold tracking-tight md:text-4xl'>
          Your Sleep Health Report
        </h1>
        <p className='text-muted-foreground'>
          Generated on{' '}
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Intro message */}
      <Alert className='border-primary/20 bg-primary/5'>
        <Heart className='text-primary h-4 w-4' />
        <AlertDescription className='text-foreground/90'>
          At SomnaHealth, our mission is to help you sleep better and live healthier because optimal
          sleep is the foundation of lifelong wellness. That&apos;s why we offer free tools and
          easy-to-understand guidance from our team of board-certified sleep experts. Whether you want
          to improve your nightly rest or address a specific sleep issue, we&apos;re here to help. We
          have provided a personalized set of links to where there are free resources, and a few
          premium options and links to our board certified sleep experts.
        </AlertDescription>
      </Alert>

      {/* Critical Safety Warning for Severe Tiredness */}
      {hasSevereTiredness && (
        <Alert className='alert-danger'>
          <AlertCircle className='h-5 w-5 text-red-600' />
          <AlertDescription className='text-red-900'>
            <strong className='mb-2 block text-lg'>Urgent Safety Warning</strong>
            Your reported severity ({Math.max(data.daytime.sleepinessInterference ?? 0, data.daytime.fatigueInterference ?? 0)}/10) indicates a
            significant safety concern. You should seek immediate help from a healthcare
            professional. Until you have done so, please consider avoiding potentially dangerous
            activities such as:
            <ul className='mt-2 mb-2 list-inside list-disc'>
              <li>Driving or operating vehicles</li>
              <li>Biking or other transportation</li>
              <li>Jobs involving high-risk activities (construction, heavy equipment operation)</li>
            </ul>
            <strong>The good news</strong> is that there are many fast-acting and safe treatments
            for excessive daytime sleepiness. Please consult a healthcare provider as soon as
            possible.
          </AlertDescription>
        </Alert>
      )}

      {/* Sleep Metrics Summary */}
      <Card className='shadow-sleep overflow-hidden border-0'>
        <CardHeader className='bg-gradient-sleep-header text-white'>
          <CardTitle className='flex items-center space-x-2 text-white'>
            <Moon className='h-5 w-5' />
            <span>Your Sleep Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div>
              <h3 className='mb-3 font-semibold'>Work/School Days</h3>
              {hasScheduledData ? (
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span>Average Sleep Duration:</span>
                    <span className='font-medium'>{formatHours(metrics.scheduledTST)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Sleep Efficiency:</span>
                    <span
                      className={cn(
                        'font-medium',
                        metrics.scheduledSE >= 85
                          ? 'text-green-600'
                          : metrics.scheduledSE >= 75
                            ? 'text-amber-600'
                            : 'text-red-600'
                      )}
                    >
                      {formatPercent(metrics.scheduledSE)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Time to Fall Asleep:</span>
                    <span
                      className={cn(
                        'font-medium',
                        metrics.scheduledSOL <= 30 ? 'text-green-600' : 'text-amber-600'
                      )}
                    >
                      {formatMinutes(metrics.scheduledSOL)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Time Awake at Night:</span>
                    <span
                      className={cn(
                        'font-medium',
                        metrics.scheduledWASO <= 40 ? 'text-green-600' : 'text-amber-600'
                      )}
                    >
                      {formatMinutes(metrics.scheduledWASO)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className='text-muted-foreground text-sm italic'>No sleep timing data entered for work/school days.</p>
              )}
            </div>

            <div>
              <h3 className='mb-3 font-semibold'>Weekends/Free Days</h3>
              {hasUnscheduledData ? (
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span>Average Sleep Duration:</span>
                    <span className='font-medium'>{formatHours(metrics.unscheduledTST)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Sleep Efficiency:</span>
                    <span
                      className={cn(
                        'font-medium',
                        metrics.unscheduledSE >= 85
                          ? 'text-green-600'
                          : metrics.unscheduledSE >= 75
                            ? 'text-amber-600'
                            : 'text-red-600'
                      )}
                    >
                      {formatPercent(metrics.unscheduledSE)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Time to Fall Asleep:</span>
                    <span
                      className={cn(
                        'font-medium',
                        metrics.unscheduledSOL <= 30 ? 'text-green-600' : 'text-amber-600'
                      )}
                    >
                      {formatMinutes(metrics.unscheduledSOL)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Time Awake at Night:</span>
                    <span
                      className={cn(
                        'font-medium',
                        metrics.unscheduledWASO <= 40 ? 'text-green-600' : 'text-amber-600'
                      )}
                    >
                      {formatMinutes(metrics.unscheduledWASO)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className='text-muted-foreground text-sm italic'>No sleep timing data entered for weekends/free days.</p>
              )}
            </div>
          </div>

          <div className='bg-primary/5 mt-6 rounded-xl p-4'>
            <p className='text-foreground/80 text-sm'>
              <strong className='text-foreground'>Sleep Pattern Analysis:</strong>{' '}
              {hasScheduledData || hasUnscheduledData ? (
                <>
                  {hasScheduledData && (
                    <>
                      You sleep an average of{' '}
                      <span className='text-primary font-semibold'>
                        {formatHours(metrics.scheduledTST)}
                      </span>{' '}
                      on weekdays
                    </>
                  )}
                  {hasScheduledData && hasUnscheduledData && ' and '}
                  {hasUnscheduledData && (
                    <>
                      <span className='text-primary font-semibold'>
                        {formatHours(metrics.unscheduledTST)}
                      </span>{' '}
                      on weekends
                    </>
                  )}
                  .
                  {hasScheduledData && hasUnscheduledData && Math.abs(metrics.scheduledTST - metrics.unscheduledTST) > 2 && (
                    <span className='text-amber-600'>
                      {' '}
                      Your sleep varies significantly between weekdays and weekends, which may indicate
                      social jet lag.
                    </span>
                  )}
                </>
              ) : (
                <span className='text-muted-foreground italic'>
                  Sleep timing data was not provided. Please complete the sleep timing sections for a more detailed analysis.
                </span>
              )}
            </p>
            <p className='text-foreground/80 mt-2 text-sm'>
              <strong className='text-foreground'>Chronotype:</strong>{' '}
              <span className='text-primary font-semibold'>{chronotypeLabel}</span>
              {chronotype === 'delayed' && ' — You tend to sleep and wake later than conventional times.'}
              {chronotype === 'advanced' && ' — You tend to sleep and wake earlier than conventional times.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Identified Issues */}
      <Card className='shadow-sleep overflow-hidden border-0'>
        <CardHeader className='bg-gradient-sleep-header text-white'>
          <CardTitle className='flex items-center space-x-2 text-white'>
            <AlertCircle className='h-5 w-5' />
            <span>Identified Sleep Issues</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='space-y-3'>
            {hasInsomnia && !hasCOMISA && (
              <div className='flex items-start space-x-3'>
                <XCircle className='mt-0.5 h-5 w-5 text-red-500' />
                <div>
                  <h4 className='font-semibold'>Insomnia ({insomniaSeverity})</h4>
                  <p className='text-muted-foreground text-sm'>
                    Difficulty falling asleep and/or staying asleep with daytime impairment
                  </p>
                </div>
              </div>
            )}

            {hasEDS && (
              <div className='flex items-start space-x-3'>
                <XCircle
                  className={cn(
                    'mt-0.5 h-5 w-5',
                    edsResult.severity === 'severe'
                      ? 'text-red-600'
                      : edsResult.severity === 'moderate'
                        ? 'text-red-500'
                        : 'text-amber-500'
                  )}
                />
                <div>
                  <h4 className='font-semibold'>
                    Excessive Daytime Sleepiness ({edsResult.severity})
                    {edsResult.score > 0 && (
                      <span className='text-muted-foreground ml-2 text-sm'>
                        (EDS Score: {edsResult.score})
                      </span>
                    )}
                  </h4>
                  <p className='text-muted-foreground text-sm'>
                    {edsResult.severity === 'severe' &&
                      'Falling asleep inappropriately suggests possible narcolepsy, idiopathic hypersomnia, or severe sleep debt. '}
                    {edsResult.severity === 'moderate' &&
                      'Significant daytime sleepiness possibly due to moderate sleep debt, insufficient sleep, or snoring/sleep apnea. '}
                    {edsResult.severity === 'mild' &&
                      'Mild sleepiness that may indicate insufficient sleep or poor sleep quality. '}
                    {hasEDSFromNaps &&
                      'Frequent long daytime naps suggest your nighttime sleep may not be restorative.'}
                  </p>
                </div>
              </div>
            )}

            {hasOSA && !hasCOMISA && (
              <div className='flex items-start space-x-3'>
                <XCircle className='mt-0.5 h-5 w-5 text-red-500' />
                <div>
                  <h4 className='font-semibold'>Possible Sleep Apnea</h4>
                  <p className='text-muted-foreground text-sm'>
                    Symptoms suggest sleep-disordered breathing requiring medical evaluation
                  </p>
                </div>
              </div>
            )}

            {hasCOMISA && (
              <div className='flex items-start space-x-3'>
                <XCircle className='mt-0.5 h-5 w-5 text-red-600' />
                <div>
                  <h4 className='font-semibold text-red-700'>
                    COMISA (Comorbid Insomnia and Sleep Apnea)
                  </h4>
                  <p className='text-muted-foreground text-sm'>
                    You show signs of both insomnia and sleep apnea occurring together. COMISA is a
                    complex condition that affects approximately 30-50% of people with either
                    disorder. Treatment requires addressing both conditions simultaneously for best
                    results.
                  </p>
                </div>
              </div>
            )}

            {hasRLS && (
              <div className='flex items-start space-x-3'>
                <XCircle className='mt-0.5 h-5 w-5 text-amber-500' />
                <div>
                  <h4 className='font-semibold'>Restless Legs Syndrome Symptoms</h4>
                  <p className='text-muted-foreground text-sm'>
                    Leg discomfort affecting sleep onset
                  </p>
                </div>
              </div>
            )}

            {hasNightmares && (
              <div className='flex items-start space-x-3'>
                <XCircle className='mt-0.5 h-5 w-5 text-amber-500' />
                <div>
                  <h4 className='font-semibold'>Frequent Nightmares</h4>
                  <p className='text-muted-foreground text-sm'>
                    Disturbing dreams affecting sleep quality
                  </p>
                </div>
              </div>
            )}

            {chronotype === 'delayed' && (
              <div className='flex items-start space-x-3'>
                <Info className='text-primary mt-0.5 h-5 w-5' />
                <div>
                  <h4 className='font-semibold'>Delayed Sleep Phase</h4>
                  <p className='text-muted-foreground text-sm'>
                    Natural tendency to sleep and wake later than conventional times
                  </p>
                </div>
              </div>
            )}

            {hasPoorHygiene && (
              <div className='flex items-start space-x-3'>
                <Info className='mt-0.5 h-5 w-5 text-amber-500' />
                <div>
                  <h4 className='font-semibold'>Sleep Hygiene Issues</h4>
                  <p className='text-muted-foreground text-sm'>
                    Lifestyle factors that may be impacting sleep quality
                  </p>
                </div>
              </div>
            )}

            {hasFrequentSleepParalysis && (
              <div className='flex items-start space-x-3'>
                <XCircle className='mt-0.5 h-5 w-5 text-amber-500' />
                <div>
                  <h4 className='font-semibold'>Frequent Sleep Paralysis</h4>
                  <p className='text-muted-foreground text-sm'>
                    You report frequent episodes of sleep paralysis. This may warrant evaluation for
                    narcolepsy, delayed sleep phase disorder, or insufficient sleep.
                  </p>
                </div>
              </div>
            )}

            {hasInsufficientSleep && (
              <div className='flex items-start space-x-3'>
                <XCircle className='mt-0.5 h-5 w-5 text-amber-500' />
                <div>
                  <h4 className='font-semibold'>Insufficient Sleep Syndrome</h4>
                  <p className='text-muted-foreground text-sm'>
                    Your average sleep time of {avgWeeklySleep.toFixed(1)} hours is below the
                    recommended 7+ hours. Combined with your daytime sleepiness, this suggests you
                    are not getting enough sleep to meet your body&apos;s needs.
                  </p>
                </div>
              </div>
            )}

            {hasChronicFatigueSymptoms && (
              <div className='flex items-start space-x-3'>
                <XCircle className='mt-0.5 h-5 w-5 text-amber-500' />
                <div>
                  <h4 className='font-semibold'>
                    Possible Chronic Fatigue / Fibromyalgia Symptoms
                  </h4>
                  <p className='text-muted-foreground text-sm'>
                    You report non-restorative sleep, muscle/joint pain, and daytime tiredness that
                    interferes with activities. These symptoms may be associated with fibromyalgia,
                    chronic fatigue syndrome, post-viral illness (e.g., long COVID), or Lyme
                    disease.
                  </p>
                </div>
              </div>
            )}

            {hasPainAffectingSleep && !hasChronicFatigueSymptoms && (
              <div className='flex items-start space-x-3'>
                <Info className='mt-0.5 h-5 w-5 text-amber-500' />
                <div>
                  <h4 className='font-semibold'>Pain Affecting Sleep</h4>
                  <p className='text-muted-foreground text-sm'>
                    Moderate to severe pain ({data.daytime.painSeverity}/10) is affecting your sleep
                    quality. Pain management should be addressed alongside sleep treatment.
                  </p>
                </div>
              </div>
            )}

            {!hasInsomnia &&
              !hasEDS &&
              !hasOSA &&
              !hasCOMISA &&
              !hasRLS &&
              !hasNightmares &&
              !hasPoorHygiene &&
              !hasFrequentSleepParalysis &&
              !hasInsufficientSleep &&
              !hasChronicFatigueSymptoms &&
              !hasPainAffectingSleep && (
                <div className='flex items-start space-x-3'>
                  <CheckCircle className='mt-0.5 h-5 w-5 text-green-500' />
                  <div>
                    <h4 className='font-semibold'>No Major Sleep Issues Detected</h4>
                    <p className='text-muted-foreground text-sm'>
                      Your sleep patterns appear generally healthy
                    </p>
                  </div>
                </div>
              )}
          </div>
        </CardContent>
      </Card>

      {/* Previous Diagnoses (I) */}
      {hasPreviousDiagnoses && (
        <Card className='shadow-sleep overflow-hidden border-0'>
          <CardHeader className='bg-gradient-sleep-header text-white'>
            <CardTitle className='flex items-center space-x-2 text-white'>
              <ClipboardList className='h-5 w-5' />
              <span>Your Previous Diagnoses</span>
            </CardTitle>
          </CardHeader>
          <CardContent className='pt-6'>
            <div className='space-y-4'>
              {previousDiagnoses.map((disorder: string) => {
                const label = DISORDER_LABELS[disorder] ?? disorder;
                const isOSADiagnosis = disorder === 'osa';
                const isOSATreated =
                  isOSADiagnosis &&
                  data.breathingDisorders.diagnosed &&
                  data.breathingDisorders.treatment.length > 0;

                return (
                  <div key={disorder} className='rounded-lg border p-4'>
                    <p className='text-foreground/90 text-sm'>
                      You indicated that you have been diagnosed with{' '}
                      <strong>{label}</strong>.
                    </p>
                    {isOSADiagnosis && isOSATreated && (
                      <p className='text-foreground/80 mt-2 text-sm'>
                        The data you provided confirms you are being treated for this condition. We
                        encourage you to continue treatment and follow up with your healthcare
                        provider.
                      </p>
                    )}
                    {isOSADiagnosis && !isOSATreated && (
                      <p className='mt-2 text-sm text-amber-700'>
                        We strongly recommend discussing treatment options with your sleep specialist
                        or primary care doctor.
                      </p>
                    )}
                    {!isOSADiagnosis && (
                      <p className='text-foreground/70 mt-2 text-sm'>
                        If you are not currently receiving treatment, we recommend consulting a sleep
                        specialist.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personalized Recommendations */}
      <Card className='shadow-sleep overflow-hidden border-0'>
        <CardHeader className='bg-gradient-sleep-header text-white'>
          <CardTitle className='flex items-center space-x-2 text-white'>
            <Heart className='h-5 w-5' />
            <span>Personalized Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='space-y-4'>
            {hasInsomnia && (
              <div>
                <h4 className='mb-2 font-semibold'>For Your Insomnia:</h4>
                <ul className='text-foreground/80 list-inside list-disc space-y-1 text-sm'>
                  <li>Consider Cognitive Behavioral Therapy for Insomnia (CBT-I)</li>
                  <li>Maintain consistent sleep and wake times, even on weekends</li>
                  <li>Limit time in bed to actual sleep time (sleep restriction)</li>
                  <li>Avoid screens 1-2 hours before bedtime</li>
                  {data.mentalHealth.anxietyInBed && (
                    <li>
                      Practice relaxation techniques: deep breathing, progressive muscle relaxation
                    </li>
                  )}
                </ul>
              </div>
            )}

            {hasOSA && !hasCOMISA && (
              <div>
                <h4 className='mb-2 font-semibold text-red-600'>
                  ⚠️ Urgent: Sleep Apnea Evaluation
                </h4>
                <ul className='text-foreground/80 list-inside list-disc space-y-1 text-sm'>
                  <li>Schedule a sleep study with a sleep specialist immediately</li>
                  <li>Discuss CPAP therapy or other treatment options</li>
                  <li>If overweight, weight loss can significantly improve symptoms</li>
                  <li>Avoid alcohol and sedatives which worsen apnea</li>
                  <li>Sleep on your side rather than your back</li>
                </ul>
              </div>
            )}

            {hasCOMISA && (
              <div>
                <h4 className='mb-2 font-semibold text-red-600'>⚠️ Urgent: COMISA Treatment</h4>
                <p className='text-foreground/80 mb-2 text-sm'>
                  COMISA (Comorbid Insomnia and Sleep Apnea) requires coordinated treatment of both
                  conditions. Research shows that treating only one condition often leaves patients
                  with persistent symptoms.
                </p>
                <ul className='text-foreground/80 list-inside list-disc space-y-1 text-sm'>
                  <li>Schedule a comprehensive sleep evaluation with a sleep specialist</li>
                  <li>A sleep study is essential to diagnose and assess sleep apnea severity</li>
                  <li>Consider combined therapy: CBT-I plus CPAP treatment</li>
                  <li>
                    Work with your sleep specialist to optimize CPAP settings and insomnia treatment
                  </li>
                  <li>Avoid sedative sleep medications which can worsen sleep apnea</li>
                  <li>Weight management can improve both conditions</li>
                  <li>Maintain consistent sleep schedules even while adjusting to CPAP</li>
                </ul>
              </div>
            )}

            {hasRLS && (
              <div>
                <h4 className='mb-2 font-semibold'>For Restless Legs Syndrome:</h4>
                <ul className='text-foreground/80 list-inside list-disc space-y-1 text-sm'>
                  <li>Have your ferritin levels checked by your doctor</li>
                  <li>Consider iron supplementation if levels are below 75mcg/ml</li>
                  <li>Reduce caffeine and alcohol consumption</li>
                  <li>Gentle stretching or yoga before bed</li>
                  <li>Maintain regular exercise routine</li>
                </ul>
              </div>
            )}

            {hasInsufficientSleep && (
              <div>
                <h4 className='mb-2 font-semibold text-amber-600'>
                  For Insufficient Sleep Syndrome:
                </h4>
                <p className='text-foreground/80 mb-2 text-sm'>
                  You&apos;re averaging {avgWeeklySleep.toFixed(1)} hours of sleep per night. Most
                  adults need 7-9 hours for optimal health and functioning.
                </p>
                <ul className='text-foreground/80 list-inside list-disc space-y-1 text-sm'>
                  <li>Prioritize sleep by setting an earlier bedtime</li>
                  <li>
                    Calculate your target bedtime by counting back 7-8 hours from your wake time
                  </li>
                  <li>Reduce evening activities and screen time to allow for earlier sleep</li>
                  <li>Consider your schedule - can any morning obligations be moved later?</li>
                  <li>Avoid using caffeine to compensate for lack of sleep</li>
                  <li>
                    Track your sleep for 2 weeks to identify patterns and improvement opportunities
                  </li>
                </ul>
              </div>
            )}

            {hasChronicFatigueSymptoms && (
              <div>
                <h4 className='mb-2 font-semibold text-amber-600'>For Chronic Fatigue Symptoms:</h4>
                <p className='text-foreground/80 mb-2 text-sm'>
                  Your combination of non-restorative sleep, pain, and fatigue warrants medical
                  evaluation.
                </p>
                <ul className='text-foreground/80 list-inside list-disc space-y-1 text-sm'>
                  <li>Discuss symptoms with your primary care doctor</li>
                  <li>Consider referral to a rheumatologist for fibromyalgia evaluation</li>
                  <li>Request testing for thyroid function, vitamin D, iron/ferritin levels</li>
                  <li>Consider evaluation for post-viral syndromes (long COVID, Lyme disease)</li>
                  <li>Gentle exercise and pacing strategies may help manage symptoms</li>
                  <li>Cognitive behavioral therapy can help with fatigue management</li>
                  <li>Improving sleep quality is often the first step in treatment</li>
                </ul>
              </div>
            )}

            {hasPainAffectingSleep && (
              <div>
                <h4 className='mb-2 font-semibold'>For Pain Management:</h4>
                <ul className='text-foreground/80 list-inside list-disc space-y-1 text-sm'>
                  <li>Discuss pain management options with your healthcare provider</li>
                  <li>Consider physical therapy or stretching routines before bed</li>
                  <li>Evaluate your sleep position and mattress for proper support</li>
                  <li>Heat or cold therapy may help before bedtime</li>
                  <li>Timing of pain medications may be optimized for sleep</li>
                  <li>Relaxation techniques can help manage pain perception</li>
                </ul>
              </div>
            )}

            {chronotype === 'delayed' && (
              <div>
                <h4 className='mb-2 font-semibold'>For Delayed Sleep Phase:</h4>
                <ul className='text-foreground/80 list-inside list-disc space-y-1 text-sm'>
                  <li>Use bright light therapy in the morning (10,000 lux for 30 minutes)</li>
                  <li>Avoid bright lights and screens in the evening</li>
                  <li>Consider melatonin 3-5 hours before desired bedtime (consult doctor)</li>
                  <li>Gradually shift bedtime earlier by 15-30 minutes every few days</li>
                </ul>
              </div>
            )}

            {/* Sleep Hygiene Recommendations */}
            <div>
              <h4 className='mb-2 font-semibold'>General Sleep Hygiene:</h4>
              <ul className='text-foreground/80 list-inside list-disc space-y-1 text-sm'>
                {data.lifestyle.caffeinePerDay > 2 && (
                  <li>Reduce caffeine to 1-2 cups per day, none after noon</li>
                )}
                {data.lifestyle.alcoholPerWeek.wine + data.lifestyle.alcoholPerWeek.cocktails >
                  7 && <li>Limit alcohol, especially within 3 hours of bedtime</li>}
                {data.bedroom.dark < 7 && (
                  <li>Make your bedroom darker with blackout curtains or eye mask</li>
                )}
                {data.bedroom.quiet < 7 && (
                  <li>Reduce noise with earplugs, white noise, or soundproofing</li>
                )}
                {data.bedroom.comfortable < 7 && (
                  <li>Evaluate your mattress and pillows for comfort</li>
                )}
                {data.lifestyle.exerciseDaysPerWeek < 3 && (
                  <li>Add regular exercise, preferably in the morning or afternoon</li>
                )}
                <li>Keep bedroom temperature cool (60-67°F / 15-19°C)</li>
                <li>Use your bed only for sleep and intimacy</li>
              </ul>
            </div>

            {/* SomnaHealth link (L) */}
            <div className='border-primary/20 bg-primary/5 mt-4 rounded-xl border p-4'>
              <p className='text-foreground/90 text-sm'>
                For your optimal sleep health, SomnaHealth provides free resources and guidance to
                maximize your sleep and improve your quality of life.{' '}
                <a
                  href='https://www.somnahealth.com/services'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary inline-flex items-center gap-1 font-medium hover:underline'
                >
                  Visit SomnaHealth Services
                  <ExternalLink className='h-3 w-3' />
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* When to Seek Help */}
      <Card className='shadow-sleep overflow-hidden border-0'>
        <CardHeader className='bg-gradient-sleep-header text-white'>
          <CardTitle className='flex items-center space-x-2 text-white'>
            <Brain className='h-5 w-5' />
            <span>When to Seek Professional Help</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='space-y-3'>
            {(hasOSA || data.breathingDisorders.diagnosed) && (
              <Alert className='alert-danger'>
                <AlertCircle className='h-4 w-4 text-red-600' />
                <AlertDescription className='text-red-900'>
                  <strong>Immediate Medical Attention Recommended</strong>
                  <br />
                  Your symptoms suggest sleep apnea, which can have serious health consequences.
                  Please schedule an appointment with a sleep specialist as soon as possible.
                </AlertDescription>
              </Alert>
            )}

            {insomniaSeverity === 'severe' && (
              <Alert className='alert-warning'>
                <AlertCircle className='h-4 w-4 text-amber-600' />
                <AlertDescription className='text-amber-900'>
                  <strong>Professional Sleep Consultation Recommended</strong>
                  <br />
                  Your insomnia is significantly impacting your daily life. Consider seeing a
                  behavioral sleep medicine specialist for comprehensive treatment.
                </AlertDescription>
              </Alert>
            )}

            {data.nightmares.associatedWithTrauma && (
              <Alert>
                <Brain className='h-4 w-4' />
                <AlertDescription>
                  <strong>Mental Health Support Available</strong>
                  <br />
                  Trauma-related nightmares benefit from specialized therapy. Consider seeking a
                  mental health professional who specializes in trauma treatment.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resources and Links */}
      <Card className='shadow-sleep overflow-hidden border-0'>
        <CardHeader className='bg-gradient-sleep-header text-white'>
          <CardTitle className='flex items-center space-x-2 text-white'>
            <Info className='h-5 w-5' />
            <span>Resources &amp; Next Steps</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='rounded-lg border p-4'>
              <h4 className='mb-2 font-semibold'>Find a Sleep Specialist</h4>
              <ul className='space-y-2 text-sm'>
                <li>
                  <a
                    href='https://aasm.org/clinical-resources/patient-info/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary hover:underline'
                  >
                    AASM Sleep Centers →
                  </a>
                  <p className='text-muted-foreground text-xs'>
                    Find accredited sleep centers near you
                  </p>
                </li>
                <li>
                  <a
                    href='https://www.absm.org/diplomates-directory/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary hover:underline'
                  >
                    ABSM Certified Specialists →
                  </a>
                  <p className='text-muted-foreground text-xs'>
                    Board-certified sleep medicine physicians
                  </p>
                </li>
              </ul>
            </div>

            <div className='rounded-lg border p-4'>
              <h4 className='mb-2 font-semibold'>Behavioral Sleep Medicine</h4>
              <ul className='space-y-2 text-sm'>
                <li>
                  <a
                    href='https://www.behavioralsleep.org/index.php/society-of-behavioral-sleep-medicine-providers'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary hover:underline'
                  >
                    SBSM Provider Directory →
                  </a>
                  <p className='text-muted-foreground text-xs'>
                    CBT-I and behavioral sleep specialists
                  </p>
                </li>
                <li>
                  <a
                    href='https://www.perelman.upenn.edu/cbt-i'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary hover:underline'
                  >
                    CBT-I Therapist Directory →
                  </a>
                  <p className='text-muted-foreground text-xs'>
                    Cognitive behavioral therapy for insomnia
                  </p>
                </li>
              </ul>
            </div>

            <div className='rounded-lg border p-4'>
              <h4 className='mb-2 font-semibold'>Mental Health Resources</h4>
              <ul className='space-y-2 text-sm'>
                <li>
                  <a
                    href='https://locator.apa.org/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary hover:underline'
                  >
                    APA Psychologist Locator →
                  </a>
                  <p className='text-muted-foreground text-xs'>Find mental health professionals</p>
                </li>
                <li>
                  <a
                    href='https://www.psychologytoday.com/us/therapists'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary hover:underline'
                  >
                    Psychology Today Directory →
                  </a>
                  <p className='text-muted-foreground text-xs'>
                    Therapists specializing in sleep and anxiety
                  </p>
                </li>
              </ul>
            </div>

            <div className='rounded-lg border p-4'>
              <h4 className='mb-2 font-semibold'>Educational Resources</h4>
              <ul className='space-y-2 text-sm'>
                <li>
                  <a
                    href='https://sleepeducation.org/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary hover:underline'
                  >
                    Sleep Education (AASM) →
                  </a>
                  <p className='text-muted-foreground text-xs'>Evidence-based sleep information</p>
                </li>
                <li>
                  <a
                    href='https://www.sleepfoundation.org/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary hover:underline'
                  >
                    National Sleep Foundation →
                  </a>
                  <p className='text-muted-foreground text-xs'>Sleep health guides and tools</p>
                </li>
              </ul>
            </div>
          </div>

          <div className='border-primary/20 bg-primary/5 mt-6 rounded-xl border p-4'>
            <p className='text-foreground/90 text-sm'>
              <strong className='text-primary'>SomnaHealth Services:</strong> Our team offers
              personalized sleep consultations, CBT-I treatment, and ongoing support. Visit our
              website for more information about how we can help you achieve better sleep.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className='flex justify-center gap-4 print:hidden'>
        <Button onClick={handlePrint} size='lg' className='gap-2 shadow-md'>
          <Printer className='h-4 w-4' />
          Print Report
        </Button>
        {onDownloadPDF && (
          <Button
            onClick={onDownloadPDF}
            variant='outline'
            size='lg'
            className='border-primary/20 hover:bg-primary/5 gap-2'
          >
            <Download className='h-4 w-4' />
            Download PDF
          </Button>
        )}
      </div>

      {/* Disclaimer */}
      <Alert>
        <Info className='h-4 w-4' />
        <AlertDescription>
          <strong>Important Disclaimer</strong>
          <br />
          This report is for informational purposes only and does not constitute medical advice.
          Please consult with qualified healthcare professionals for diagnosis and treatment of
          sleep disorders. If you are experiencing a medical emergency, call 911 immediately.
        </AlertDescription>
      </Alert>

      {/* Copyright (N) */}
      <div className='text-muted-foreground text-center text-xs'>
        <p>&copy; {currentYear} SomnaHealth. All rights reserved.</p>
      </div>
    </div>
  );
}
