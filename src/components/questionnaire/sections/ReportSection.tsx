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

// Helper to parse minute increment string to number
function parseMinuteIncrement(value: string | null): number {
  if (!value) {return 0;}
  if (value === '>120') {return 130;} // Use 130 for "more than 120"
  return parseInt(value, 10) || 0;
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

  // Parse minute increments from string values
  const scheduledSOL = parseMinuteIncrement(data.scheduledSleep.minutesToFallAsleep);
  const scheduledWASO = parseMinuteIncrement(data.scheduledSleep.minutesAwakeAtNight);
  const unscheduledSOL = parseMinuteIncrement(data.unscheduledSleep.minutesToFallAsleep);
  const unscheduledWASO = parseMinuteIncrement(data.unscheduledSleep.minutesAwakeAtNight);

  // Calculate for scheduled days
  const scheduledBedtime = timeToMinutes(data.scheduledSleep.lightsOutTime);
  const scheduledWaketime = timeToMinutes(data.scheduledSleep.wakeupTime);
  let scheduledTimeInBed = scheduledWaketime - scheduledBedtime;
  if (scheduledTimeInBed < 0) {
    scheduledTimeInBed += 1440;
  } // Handle crossing midnight

  const scheduledTST = scheduledTimeInBed - scheduledSOL - scheduledWASO;
  const scheduledSE = scheduledTimeInBed > 0 ? (scheduledTST / scheduledTimeInBed) * 100 : 0;

  // Calculate mid-sleep time for scheduled days (TST/2 + fall asleep time)
  const scheduledMidSleep = scheduledBedtime + scheduledSOL + scheduledTST / 2;

  // Calculate for unscheduled days
  const unscheduledBedtime = timeToMinutes(data.unscheduledSleep.lightsOutTime);
  const unscheduledWaketime = timeToMinutes(data.unscheduledSleep.wakeupTime);
  let unscheduledTimeInBed = unscheduledWaketime - unscheduledBedtime;
  if (unscheduledTimeInBed < 0) {
    unscheduledTimeInBed += 1440;
  }

  const unscheduledTST = unscheduledTimeInBed - unscheduledSOL - unscheduledWASO;
  const unscheduledSE = unscheduledTimeInBed > 0 ? (unscheduledTST / unscheduledTimeInBed) * 100 : 0;

  // Calculate mid-sleep time for unscheduled days
  const unscheduledMidSleep = unscheduledBedtime + unscheduledSOL + unscheduledTST / 2;

  return {
    scheduledTST: scheduledTST / 60, // Convert to hours
    unscheduledTST: unscheduledTST / 60,
    scheduledSE,
    unscheduledSE,
    scheduledSOL,
    unscheduledSOL,
    scheduledWASO,
    unscheduledWASO,
    midSleepScheduled: minutesToTime(scheduledMidSleep % 1440),
    midSleepUnscheduled: minutesToTime(unscheduledMidSleep % 1440),
  };
}

function getInsomniaSeverity(data: QuestionnaireFormData, metrics: SleepMetrics): string {
  const hasSOI = metrics.scheduledSOL > 30 || metrics.unscheduledSOL > 30;
  const hasSMI = metrics.scheduledWASO > 40 || metrics.unscheduledWASO > 40;
  const hasEMA =
    data.scheduledSleep.earlyWakeupMinutes && data.scheduledSleep.earlyWakeupMinutes > 20;
  const hasDaytimeImpairment = data.daytime.sleepinessInterferes;

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

function getChronotype(metrics: SleepMetrics, preference: string): { type: string; chronotypeLabel: string } {
  const midSleepHour = parseInt(metrics.midSleepUnscheduled.split(':')[0] ?? '0');
  const midSleepMinute = parseInt(metrics.midSleepUnscheduled.split(':')[1] ?? '0');
  const midSleepTotalMinutes = midSleepHour * 60 + midSleepMinute;
  
  // Mid-sleep time analysis: When <12am (midnight) probable lark, when >5:00am probable owl
  // Midnight = 0 minutes, 5am = 300 minutes
  // But we need to handle times after midnight differently
  // Adjust for times that cross midnight (e.g., 2am is hour 2, should be considered late)
  const adjustedMidSleep = midSleepHour < 12 ? midSleepTotalMinutes + 1440 : midSleepTotalMinutes;
  
  let chronotypeLabel = 'Neutral';
  if (adjustedMidSleep <= 1440) { // Before midnight (24:00 = 1440)
    chronotypeLabel = 'Probable Lark (Morning Person)';
  } else if (adjustedMidSleep >= 1740) { // After 5am (29:00 = 1740, i.e., 5:00 + 1440)
    chronotypeLabel = 'Probable Owl (Night Person)';
  } else {
    chronotypeLabel = 'Intermediate';
  }

  let type = 'normal';
  if (preference === 'late' || adjustedMidSleep >= 1680) { // After 4am
    type = 'delayed';
  } else if (preference === 'early' || adjustedMidSleep <= 1500) { // Before 1am
    type = 'advanced';
  }
  
  return { type, chronotypeLabel };
}

export function ReportSection({ data, onDownloadPDF }: ReportSectionProps) {
  const metrics = calculateSleepMetrics(data);
  const insomniaSeverity = getInsomniaSeverity(data, metrics);
  const { type: chronotype, chronotypeLabel } = getChronotype(metrics, data.chronotype.preference);

  // Calculate weighted EDS score
  const edsResult = calculateEDSScore(data.daytime.fallAsleepDuring);
  const hasEDSFromActivities = edsResult.severity !== 'none';

  // Identify major issues
  const hasInsomnia = insomniaSeverity !== 'none' && insomniaSeverity !== 'subclinical';
  // Check for long naps (>= 60 minutes based on new 10-minute increments)
  const napDurationNum = parseMinuteIncrement(data.daytime.plannedNaps.duration);
  const hasEDSFromNaps = data.daytime.plannedNaps.daysPerWeek >= 3 && napDurationNum >= 60;
  const hasEDS = hasEDSFromActivities || hasEDSFromNaps;
  const hasOSA =
    data.breathingDisorders.stopsBreathing ||
    (data.breathingDisorders.snores && data.breathingDisorders.wakesWithDryMouth);
  const hasCOMISA = hasInsomnia && hasOSA; // Comorbid Insomnia and Sleep Apnea
  const hasRLS =
    (data.restlessLegs.troubleLyingStill &&
    data.restlessLegs.urgeToMoveLegs &&
    data.restlessLegs.movementRelieves) ||
    data.sleepDisorderDiagnoses.diagnosedRLS;
  const hasNightmares = data.nightmares.nightmaresPerWeek && data.nightmares.nightmaresPerWeek >= 3;
  const hasPoorHygiene =
    data.lifestyle.caffeinePerDay > 4 ||
    (data.lifestyle.lastCaffeineTime &&
      parseInt(data.lifestyle.lastCaffeineTime.split(':')[0] ?? '0') >= 14);
  const hasSevereTiredness = (data.daytime.sleepinessSeverity ?? 0) > 8;

  // Safety warning flags
  const hasParasomniaSafetyRisk =
    data.parasomnia.hasInjuredOrLeftHome ||
    (data.parasomnia.nightBehaviors.includes('walk') ||
      data.parasomnia.nightBehaviors.includes('eating'));
  const hasMedicationAlcoholRisk =
    (data.sleepHygiene.prescriptionMeds.length > 0 && data.lifestyle.alcoholPerWeek > 7) ||
    data.lifestyle.caffeinePerDay > 4 ||
    data.lifestyle.alcoholPerWeek > 14;

  // Insufficient Sleep Syndrome detection
  // Criteria: < 7 hours sleep + daytime sleepiness/tiredness + not explained by other disorders
  // IMPORTANT: Maintenance insomnia (high WASO) takes precedence over insufficient sleep
  const avgWeeklySleep = (metrics.scheduledTST * 5 + metrics.unscheduledTST * 2) / 7;
  const hasDaytimeSleepiness =
    data.daytime.sleepinessInterferes || hasEDS || data.daytime.fallAsleepDuring.length >= 3;
  const hasNarcolepsy =
    data.daytime.diagnosedNarcolepsy ||
    (data.daytime.weaknessWhenExcited.length > 0 && data.daytime.sleepParalysis);
  const hasInsufficientSleep =
    avgWeeklySleep < 7 && hasDaytimeSleepiness && !hasNarcolepsy && !hasOSA && !hasInsomnia;

  // Chronic Fatigue / Fibromyalgia screening
  // Criteria: non-restorative sleep + muscle/joint pain + sleepiness interferes
  const hasChronicFatigueSymptoms =
    data.daytime.nonRestorativeSleep &&
    data.daytime.jointMusclePain &&
    data.daytime.sleepinessInterferes;
  const hasPainAffectingSleep =
    data.daytime.painAffectsSleep && (data.daytime.painSeverity ?? 0) >= 5;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className='space-y-8 print:space-y-4'>
      {/* Header */}
      <div className='space-y-3 text-center'>
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

      {/* Thank you message */}
      <Alert className='border-primary/20 bg-primary/5'>
        <Heart className='text-primary h-4 w-4' />
        <AlertDescription className='text-foreground/90'>
          Thank you for completing the SomnaHealth comprehensive sleep questionnaire. With more than
          4 decades of collective experience, our team created this questionnaire and personalized
          report to provide you with guidance on improving your sleep health.
        </AlertDescription>
      </Alert>

      {/* Critical Safety Warning for Severe Tiredness */}
      {hasSevereTiredness && (
        <Alert className='alert-danger'>
          <AlertCircle className='h-5 w-5 text-red-600' />
          <AlertDescription className='text-red-900'>
            <strong className='mb-2 block text-lg'>Urgent Safety Warning</strong>
            Your reported sleepiness severity ({data.daytime.sleepinessSeverity}/10) indicates a
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
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span>Average Sleep Duration:</span>
                  <span className='font-medium'>{metrics.scheduledTST.toFixed(1)} hours</span>
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
                    {metrics.scheduledSE.toFixed(0)}%
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
                    {metrics.scheduledSOL} minutes
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
                    {metrics.scheduledWASO} minutes
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>Mid-Sleep Time:</span>
                  <span className='font-medium'>{metrics.midSleepScheduled}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className='mb-3 font-semibold'>Weekends/Free Days</h3>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span>Average Sleep Duration:</span>
                  <span className='font-medium'>{metrics.unscheduledTST.toFixed(1)} hours</span>
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
                    {metrics.unscheduledSE.toFixed(0)}%
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
                    {metrics.unscheduledSOL} minutes
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
                    {metrics.unscheduledWASO} minutes
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>Mid-Sleep Time:</span>
                  <span className='font-medium'>{metrics.midSleepUnscheduled}</span>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-primary/5 mt-6 space-y-3 rounded-xl p-4'>
            <p className='text-foreground/80 text-sm'>
              <strong className='text-foreground'>Sleep Pattern Analysis:</strong> You sleep an
              average of{' '}
              <span className='text-primary font-semibold'>
                {metrics.scheduledTST.toFixed(1)} hours
              </span>{' '}
              on weekdays and{' '}
              <span className='text-primary font-semibold'>
                {metrics.unscheduledTST.toFixed(1)} hours
              </span>{' '}
              on weekends.
              {Math.abs(metrics.scheduledTST - metrics.unscheduledTST) > 2 && (
                <span className='text-amber-600'>
                  {' '}
                  Your sleep varies significantly between weekdays and weekends, which may indicate
                  social jet lag.
                </span>
              )}
            </p>
            <p className='text-foreground/80 text-sm'>
              <strong className='text-foreground'>Chronotype Assessment:</strong> Based on your
              mid-sleep time ({metrics.midSleepUnscheduled} on free days), you are classified as:{' '}
              <span className='text-primary font-semibold'>{chronotypeLabel}</span>
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
                  <h4 className='font-semibold'>Symptoms of Insomnia Disorder ({insomniaSeverity})</h4>
                  <p className='text-muted-foreground text-sm'>
                    Difficulty falling asleep and/or staying asleep with daytime impairment. See our
                    website for more information and guidance.
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
                  <h4 className='font-semibold'>Symptoms of Sleep Apnea Disorder</h4>
                  <p className='text-muted-foreground text-sm'>
                    Your responses suggest sleep-disordered breathing requiring medical evaluation.
                    See our website for more information and guidance.
                  </p>
                </div>
              </div>
            )}

            {hasCOMISA && (
              <div className='flex items-start space-x-3'>
                <XCircle className='mt-0.5 h-5 w-5 text-red-600' />
                <div>
                  <h4 className='font-semibold text-red-700'>
                    Symptoms of COMISA (Comorbid Insomnia and Sleep Apnea)
                  </h4>
                  <p className='text-muted-foreground text-sm'>
                    You show symptoms of both insomnia and sleep apnea occurring together. COMISA is
                    a complex condition that affects approximately 30-50% of people with either
                    disorder. See our website for more information and guidance on treatment
                    approaches.
                  </p>
                </div>
              </div>
            )}

            {hasRLS && (
              <div className='flex items-start space-x-3'>
                <XCircle className='mt-0.5 h-5 w-5 text-amber-500' />
                <div>
                  <h4 className='font-semibold'>Symptoms of Restless Legs Syndrome</h4>
                  <p className='text-muted-foreground text-sm'>
                    Leg discomfort affecting sleep onset. See our website for more information and
                    guidance.
                  </p>
                </div>
              </div>
            )}

            {hasNightmares && (
              <div className='flex items-start space-x-3'>
                <XCircle className='mt-0.5 h-5 w-5 text-amber-500' />
                <div>
                  <h4 className='font-semibold'>Symptoms of Nightmare Disorder</h4>
                  <p className='text-muted-foreground text-sm'>
                    Disturbing dreams affecting sleep quality. See our website for more information
                    and guidance.
                  </p>
                </div>
              </div>
            )}

            {chronotype === 'delayed' && (
              <div className='flex items-start space-x-3'>
                <Info className='text-primary mt-0.5 h-5 w-5' />
                <div>
                  <h4 className='font-semibold'>Symptoms of Delayed Sleep Phase Disorder</h4>
                  <p className='text-muted-foreground text-sm'>
                    Natural tendency to sleep and wake later than conventional times. See our website
                    for more information and guidance.
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

            {hasInsufficientSleep && (
              <div className='flex items-start space-x-3'>
                <XCircle className='mt-0.5 h-5 w-5 text-amber-500' />
                <div>
                  <h4 className='font-semibold'>Symptoms of Insufficient Sleep Syndrome</h4>
                  <p className='text-muted-foreground text-sm'>
                    Your average sleep time of {avgWeeklySleep.toFixed(1)} hours is below the
                    recommended 7+ hours. Combined with your daytime sleepiness, this suggests you
                    are not getting enough sleep to meet your body&apos;s needs. See our website for
                    more information and guidance.
                  </p>
                </div>
              </div>
            )}

            {hasChronicFatigueSymptoms && (
              <div className='flex items-start space-x-3'>
                <XCircle className='mt-0.5 h-5 w-5 text-amber-500' />
                <div>
                  <h4 className='font-semibold'>
                    Symptoms of Chronic Fatigue / Fibromyalgia
                  </h4>
                  <p className='text-muted-foreground text-sm'>
                    You report non-restorative sleep, muscle/joint pain, and daytime tiredness that
                    interferes with activities. These symptoms may be associated with fibromyalgia,
                    chronic fatigue syndrome, post-viral illness (e.g., long COVID), or Lyme
                    disease. See our website for more information and guidance.
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
                <h4 className='mb-2 font-semibold'>For Your Insomnia Symptoms:</h4>
                <p className='text-foreground/80 text-sm'>
                  Based on your responses, we recommend exploring treatment options for insomnia.
                  Visit our website for detailed information on evidence-based treatments including
                  Cognitive Behavioral Therapy for Insomnia (CBT-I) and other strategies.
                </p>
              </div>
            )}

            {hasOSA && !hasCOMISA && (
              <div>
                <h4 className='mb-2 font-semibold text-red-600'>
                  ⚠️ Important: Sleep Apnea Evaluation Recommended
                </h4>
                <p className='text-foreground/80 text-sm'>
                  Based on your responses, we recommend evaluation for sleep apnea. This is an
                  important health condition that warrants attention. Visit our website for detailed
                  information on sleep studies, treatment options, and next steps.
                </p>
              </div>
            )}

            {hasCOMISA && (
              <div>
                <h4 className='mb-2 font-semibold text-red-600'>
                  ⚠️ Important: COMISA Evaluation Recommended
                </h4>
                <p className='text-foreground/80 text-sm'>
                  Your symptoms suggest COMISA (Comorbid Insomnia and Sleep Apnea), which requires
                  coordinated treatment of both conditions. Visit our website for detailed
                  information on comprehensive evaluation and treatment approaches.
                </p>
              </div>
            )}

            {hasRLS && (
              <div>
                <h4 className='mb-2 font-semibold'>For Restless Legs Syndrome Symptoms:</h4>
                <p className='text-foreground/80 text-sm'>
                  Based on your responses, we recommend exploring treatment options for restless
                  legs syndrome. Visit our website for detailed information on iron levels, lifestyle
                  changes, and other treatments.
                </p>
              </div>
            )}

            {hasInsufficientSleep && (
              <div>
                <h4 className='mb-2 font-semibold text-amber-600'>
                  For Insufficient Sleep Symptoms:
                </h4>
                <p className='text-foreground/80 text-sm'>
                  You&apos;re averaging {avgWeeklySleep.toFixed(1)} hours of sleep per night. Most
                  adults need 7-9 hours for optimal health and functioning. Visit our website for
                  strategies to improve your sleep duration and schedule.
                </p>
              </div>
            )}

            {hasChronicFatigueSymptoms && (
              <div>
                <h4 className='mb-2 font-semibold text-amber-600'>For Chronic Fatigue Symptoms:</h4>
                <p className='text-foreground/80 text-sm'>
                  Your combination of non-restorative sleep, pain, and fatigue warrants medical
                  evaluation. Visit our website for detailed information on evaluation options and
                  management strategies.
                </p>
              </div>
            )}

            {hasPainAffectingSleep && (
              <div>
                <h4 className='mb-2 font-semibold'>For Pain Affecting Sleep:</h4>
                <p className='text-foreground/80 text-sm'>
                  Pain is affecting your sleep quality. Visit our website for information on pain
                  management strategies and how to improve sleep when dealing with chronic pain.
                </p>
              </div>
            )}

            {chronotype === 'delayed' && (
              <div>
                <h4 className='mb-2 font-semibold'>For Delayed Sleep Phase Symptoms:</h4>
                <p className='text-foreground/80 text-sm'>
                  Your natural sleep timing is later than desired. Visit our website for information
                  on light therapy, melatonin, and other strategies to shift your sleep schedule.
                </p>
              </div>
            )}

            {/* Sleep Hygiene Recommendations */}
            <div>
              <h4 className='mb-2 font-semibold'>General Sleep Hygiene:</h4>
              <p className='text-foreground/80 text-sm'>
                Good sleep hygiene is foundational to healthy sleep. Visit our website for
                comprehensive information on bedroom environment, lifestyle factors, and sleep
                habits that can improve your sleep quality.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Warnings */}
      {(hasEDS || hasParasomniaSafetyRisk || hasMedicationAlcoholRisk) && (
        <Card className='shadow-sleep overflow-hidden border-0 border-l-4 border-l-red-500'>
          <CardHeader className='bg-red-50'>
            <CardTitle className='flex items-center space-x-2 text-red-700'>
              <AlertCircle className='h-5 w-5' />
              <span>Important Safety Warnings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className='pt-6'>
            <div className='space-y-4'>
              {/* Daytime Sleepiness Warning */}
              {hasEDS && edsResult.severity !== 'mild' && (
                <Alert className='alert-danger'>
                  <AlertCircle className='h-4 w-4 text-red-600' />
                  <AlertDescription className='text-red-900'>
                    <strong>Daytime Sleepiness Warning</strong>
                    <br />
                    Your daytime sleepiness symptoms are significant and we suggest that you exercise
                    significant caution that might include avoiding driving, biking or other high
                    risk activities until you are treated. More specific recommendations are on our
                    website.
                  </AlertDescription>
                </Alert>
              )}

              {/* Parasomnia Warning */}
              {hasParasomniaSafetyRisk && (
                <Alert className='alert-danger'>
                  <AlertCircle className='h-4 w-4 text-red-600' />
                  <AlertDescription className='text-red-900'>
                    <strong>Parasomnia Warning</strong>
                    <br />
                    Your parasomnias (sleepwalking, sleep eating, or night terrors) place you at
                    significant risk of injury. We strongly recommend that someone in your home
                    monitor your behavior at night and only wake you if you try to leave your home
                    or are at risk of other injury. Please see more information about safety
                    precautions on our website.
                  </AlertDescription>
                </Alert>
              )}

              {/* Medication/Alcohol Warning */}
              {hasMedicationAlcoholRisk && (
                <Alert className='alert-warning'>
                  <AlertCircle className='h-4 w-4 text-amber-600' />
                  <AlertDescription className='text-amber-900'>
                    <strong>Medication/Substance Warning</strong>
                    <br />
                    Your use of sedating medications, caffeine, and/or alcohol is significant and can
                    lead to health risks and injury. We provide additional information on our
                    website, but you should consult with your prescribing provider or other health
                    professional before making changes as there can be side effects when you
                    discontinue use.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* When to Seek Help */}
      <Card className='shadow-sleep overflow-hidden border-0'>
        <CardHeader className='bg-gradient-sleep-header text-white'>
          <CardTitle className='flex items-center space-x-2 text-white'>
            <Brain className='h-5 w-5' />
            <span>Next Steps</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='space-y-3'>
            {(hasOSA || data.sleepDisorderDiagnoses.diagnosedOSA) && (
              <Alert className='alert-danger'>
                <AlertCircle className='h-4 w-4 text-red-600' />
                <AlertDescription className='text-red-900'>
                  <strong>Sleep Apnea Evaluation Recommended</strong>
                  <br />
                  Your symptoms suggest sleep apnea, which can have serious health consequences.
                  Visit our website for information on finding a sleep specialist and what to expect
                  during evaluation.
                </AlertDescription>
              </Alert>
            )}

            {insomniaSeverity === 'severe' && (
              <Alert className='alert-warning'>
                <AlertCircle className='h-4 w-4 text-amber-600' />
                <AlertDescription className='text-amber-900'>
                  <strong>Sleep Consultation Recommended</strong>
                  <br />
                  Your insomnia symptoms are significantly impacting your daily life. Visit our
                  website for information on finding a behavioral sleep medicine specialist.
                </AlertDescription>
              </Alert>
            )}

            {data.nightmares.associatedWithTrauma && (
              <Alert>
                <Brain className='h-4 w-4' />
                <AlertDescription>
                  <strong>Mental Health Support Available</strong>
                  <br />
                  Trauma-related nightmares benefit from specialized therapy. Visit our website for
                  resources on finding appropriate mental health support.
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
    </div>
  );
}
