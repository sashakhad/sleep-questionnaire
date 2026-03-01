import { QuestionnaireFormData } from '@/validations/questionnaire';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  generateDiagnosisReport,
  type DiagnosisReport,
} from '@/lib/diagnosis-algorithms';
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
  weeklyAvgTST: number; // Weighted weekly average (5x scheduled + 2x unscheduled) / 7
  socialJetLag: number; // Difference in sleep duration between weekend and weekday (hours)
  midSleepTimeChange: number; // Difference in mid-sleep time (hours)
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

  // Calculate weighted weekly average TST (5x workdays + 2x weekend days) / 7
  const weeklyAvgTST = ((scheduledTST / 60) * 5 + (unscheduledTST / 60) * 2) / 7;

  // Calculate Social Jet Lag (difference in sleep duration between weekend and weekday)
  // Positive value means more sleep on weekends (catching up)
  const socialJetLag = (unscheduledTST - scheduledTST) / 60; // in hours

  // Calculate Mid-sleep Time Change (difference between unscheduled and scheduled mid-sleep)
  // Need to handle crossing midnight properly
  let midSleepDiff = unscheduledMidSleep - scheduledMidSleep;
  if (midSleepDiff > 720) {
    midSleepDiff -= 1440; // Adjust for crossing midnight
  } else if (midSleepDiff < -720) {
    midSleepDiff += 1440;
  }
  const midSleepTimeChange = midSleepDiff / 60; // in hours

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
    weeklyAvgTST,
    socialJetLag,
    midSleepTimeChange,
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

// Helper to format metric values — shows "N/A" when no sleep data was entered
function formatHours(hours: number): string {
  if (!Number.isFinite(hours) || hours <= 0) {
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
  const { type: chronotype, chronotypeLabel } = getChronotype(metrics, data.chronotype.preference);

  // Calculate weighted EDS score
  const edsResult = calculateEDSScore(data.daytime.fallAsleepDuring);
  const hasEDSFromActivities = edsResult.severity !== 'none';

  // Identify major issues
  const hasInsomnia = insomniaSeverity !== 'none' && insomniaSeverity !== 'subclinical';
  // Check for long naps (>= 60 minutes based on new 10-minute increments)
  const napDurationNum = parseMinuteIncrement(data.daytime.plannedNaps.duration);
  const hasEDSFromNaps = data.daytime.plannedNaps.daysPerWeek >= 3 && napDurationNum >= 60;
  const hasEDSSymptoms = hasEDSFromActivities || hasEDSFromNaps;
  // Per feedback: EDS (excessive daytime sleepiness) should only be shown when TST >= 7 hours
  // If TST < 7 hours, it's more likely Insufficient Sleep Syndrome
  const avgWeeklySleepForEDS = (metrics.scheduledTST * 5 + metrics.unscheduledTST * 2) / 7;
  const hasEDS = hasEDSSymptoms && avgWeeklySleepForEDS >= 7;
  const hasOSA =
    data.breathingDisorders.stopsBreathing ||
    (data.breathingDisorders.snores && data.breathingDisorders.wakesWithDryMouth);
  const hasCOMISA = hasInsomnia && hasOSA; // Comorbid Insomnia and Sleep Apnea
  const hasRLS =
    (data.restlessLegs.troubleLyingStill &&
    data.restlessLegs.urgeToMoveLegs &&
    data.restlessLegs.movementRelieves) ||
    data.sleepDisorderDiagnoses.diagnosedDisorders?.includes('rls') ||
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
  const avgWeeklySleep = avgWeeklySleepForEDS; // Use same calculation
  const hasDaytimeSleepiness =
    data.daytime.sleepinessInterferes || hasEDSSymptoms || data.daytime.fallAsleepDuring.length >= 3;
  const hasNarcolepsy =
    data.daytime.diagnosedNarcolepsy ||
    data.sleepDisorderDiagnoses.diagnosedDisorders?.includes('narcolepsy') ||
    data.sleepDisorderDiagnoses.diagnosedDisorders?.includes('hypersomnia') ||
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

  // Use centralized diagnosis algorithms for additional findings not covered by inline logic
  const diagnosisReport: DiagnosisReport = generateDiagnosisReport(data);

  const hasMildRespiratoryDisturbance =
    !hasOSA && diagnosisReport.sleepApnea.hasMildRespiratoryDisturbance;

  // Nocturnal leg cramps (frequency-based: ≥2 nights/week)
  const hasLegCrampsConcern =
    data.restlessLegs.legCramps &&
    (data.restlessLegs.legCrampsPerWeek ?? 0) >= 2;

  // Derive diagnosed status from the checklist (primary source) or the legacy boolean fields
  const hasDiagnosedOSA =
    data.sleepDisorderDiagnoses.diagnosedDisorders?.includes('obstructive_sleep_apnea') ||
    data.sleepDisorderDiagnoses.diagnosedOSA;
  const hasDiagnosedRLS =
    data.sleepDisorderDiagnoses.diagnosedDisorders?.includes('rls') ||
    data.sleepDisorderDiagnoses.diagnosedRLS;

  // Treatment ineffectiveness
  const osaTreatmentIneffective =
    hasDiagnosedOSA &&
    data.sleepDisorderDiagnoses.osaTreated &&
    data.sleepDisorderDiagnoses.osaTreatmentEffective === false;
  const rlsTreatmentIneffective =
    hasDiagnosedRLS &&
    data.sleepDisorderDiagnoses.rlsTreated &&
    data.sleepDisorderDiagnoses.rlsTreatmentEffective === false;

  // Pain-related sleep disturbance (from centralized algorithm)
  const hasPainRelatedSleepDisturbance = diagnosisReport.painRelated.hasCondition;

  // Medication-related sleep disturbance (from centralized algorithm)
  const hasMedicationRelatedSleepDisturbance = diagnosisReport.medicationRelated.hasCondition;

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
          4 decades of collective experience, our team created this questionnaire and report to
          provide you with guidance on improving your sleep health.
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
                <div className='flex justify-between'>
                  <span>Mid-Sleep Time:</span>
                  <span className='font-medium'>{metrics.midSleepUnscheduled}</span>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-primary/5 mt-6 space-y-3 rounded-xl p-4'>
            <p className='text-foreground/80 text-sm'>
              <strong className='text-foreground'>Weekly Average Sleep:</strong>{' '}
              <span className='text-primary font-semibold'>
                {formatHours(metrics.weeklyAvgTST)}
              </span>{' '}
              (weighted: 5× workdays + 2× weekends)
            </p>
            <p className='text-foreground/80 text-sm'>
              <strong className='text-foreground'>Social Jet Lag:</strong>{' '}
              <span
                className={cn(
                  'font-semibold',
                  Math.abs(metrics.socialJetLag) > 1.5 ? 'text-amber-600' : 'text-primary'
                )}
              >
                {metrics.socialJetLag > 0 ? '+' : ''}
                {metrics.socialJetLag.toFixed(1)} hours
              </span>
              {metrics.socialJetLag > 1.5 && (
                <span className='text-amber-600'>
                  {' '}
                  — Catching up more than 1.5 hours on weekends suggests insufficient sleep during
                  the week.
                </span>
              )}
            </p>
            <p className='text-foreground/80 text-sm'>
              <strong className='text-foreground'>Mid-Sleep Time Change:</strong>{' '}
              <span
                className={cn(
                  'font-semibold',
                  Math.abs(metrics.midSleepTimeChange) > 1 ? 'text-amber-600' : 'text-primary'
                )}
              >
                {metrics.midSleepTimeChange > 0 ? '+' : ''}
                {metrics.midSleepTimeChange.toFixed(1)} hours
              </span>
              {metrics.midSleepTimeChange > 1 && (
                <span className='text-amber-600'>
                  {' '}
                  — Sleeping later on weekends suggests catch-up sleep and a propensity for a later
                  chronotype.
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

            {hasPainRelatedSleepDisturbance && (
              <div className='flex items-start space-x-3'>
                <XCircle className='mt-0.5 h-5 w-5 text-amber-500' />
                <div>
                  <h4 className='font-semibold'>Pain-Related Sleep Disturbance</h4>
                  <p className='text-muted-foreground text-sm'>
                    It is common for those who experience acute or chronic pain to have poor sleep
                    quality. There is a bidirectional relationship between inadequate sleep and pain
                    during the night and day. Addressing your sleep problems and adequate treatment
                    of your pain is important. Please refer to our website for more information on
                    this important relationship and discuss this finding with your primary medical
                    provider.
                  </p>
                </div>
              </div>
            )}

            {hasPainAffectingSleep && !hasChronicFatigueSymptoms && !hasPainRelatedSleepDisturbance && (
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

            {hasMedicationRelatedSleepDisturbance && (
              <div className='flex items-start space-x-3'>
                <XCircle className='mt-0.5 h-5 w-5 text-amber-500' />
                <div>
                  <h4 className='font-semibold'>Medication-Related Sleep Disturbance</h4>
                  <p className='text-muted-foreground text-sm'>
                    The medications that you are currently taking can contribute to sleep disturbance
                    and your sleepiness/tiredness or fatigue during the day. Please check out our
                    website for more information and discuss the impact of your medications on your
                    sleep with your medical provider. Do not discontinue prescription or over the
                    counter medications that your medical providers have recommended.
                  </p>
                </div>
              </div>
            )}

            {hasMildRespiratoryDisturbance && !hasCOMISA && (
              <div className='flex items-start space-x-3'>
                <Info className='mt-0.5 h-5 w-5 text-amber-500' />
                <div>
                  <h4 className='font-semibold'>Mild Respiratory Disturbance</h4>
                  <p className='text-muted-foreground text-sm'>
                    You have at least mild symptoms of sleep-related respiratory disturbance that may
                    require more assessment. Both snoring and mouth breathing alone or together cause
                    sleep disruption and may place a burden on your cardiovascular and respiratory
                    system. Please see our website for more detailed information and discuss your
                    symptoms with your medical provider or a sleep specialist.
                  </p>
                </div>
              </div>
            )}

            {hasLegCrampsConcern && (
              <div className='flex items-start space-x-3'>
                <Info className='mt-0.5 h-5 w-5 text-amber-500' />
                <div>
                  <h4 className='font-semibold'>Nocturnal Leg Cramps</h4>
                  <p className='text-muted-foreground text-sm'>
                    Your nocturnal leg cramps can be sleep disruptors and can be a sign of age,
                    muscle fatigue, an electrolyte or other imbalance. They can be more common during
                    pregnancy. Since these occur on two or more nights a week, we suggest that you
                    discuss these symptoms with your primary care provider.
                  </p>
                </div>
              </div>
            )}

            {osaTreatmentIneffective && (
              <div className='flex items-start space-x-3'>
                <AlertCircle className='mt-0.5 h-5 w-5 text-amber-500' />
                <div>
                  <h4 className='font-semibold'>Sleep Apnea Treatment Not Fully Effective</h4>
                  <p className='text-muted-foreground text-sm'>
                    You indicated that despite being treated for sleep apnea, you are still having
                    symptoms. Please see the section on our website related to your disorder and
                    discuss with your primary care provider. You may benefit from a consultation with
                    a sleep specialist.
                  </p>
                </div>
              </div>
            )}

            {rlsTreatmentIneffective && (
              <div className='flex items-start space-x-3'>
                <AlertCircle className='mt-0.5 h-5 w-5 text-amber-500' />
                <div>
                  <h4 className='font-semibold'>RLS Treatment Not Fully Effective</h4>
                  <p className='text-muted-foreground text-sm'>
                    You indicated that despite being treated for restless legs syndrome, you are
                    still having symptoms. Please see the section on our website related to your
                    disorder and discuss with your primary care provider. You may benefit from a
                    consultation with a sleep specialist.
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
              !hasPainAffectingSleep &&
              !hasPainRelatedSleepDisturbance &&
              !hasMedicationRelatedSleepDisturbance &&
              !hasMildRespiratoryDisturbance &&
              !hasLegCrampsConcern &&
              !osaTreatmentIneffective &&
              !rlsTreatmentIneffective && (
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
            <span>Recommendations</span>
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

            {hasPainRelatedSleepDisturbance && (
              <div>
                <h4 className='mb-2 font-semibold'>For Pain-Related Sleep Disturbance:</h4>
                <p className='text-foreground/80 text-sm'>
                  Addressing both your sleep problems and pain is important for improving your
                  quality of life. Visit our website for more information on the relationship
                  between pain and sleep and discuss this finding with your primary medical provider.
                </p>
              </div>
            )}

            {hasPainAffectingSleep && !hasPainRelatedSleepDisturbance && (
              <div>
                <h4 className='mb-2 font-semibold'>For Pain Affecting Sleep:</h4>
                <p className='text-foreground/80 text-sm'>
                  Pain is affecting your sleep quality. Visit our website for information on pain
                  management strategies and how to improve sleep when dealing with chronic pain.
                </p>
              </div>
            )}

            {hasMedicationRelatedSleepDisturbance && (
              <div>
                <h4 className='mb-2 font-semibold'>For Medication-Related Sleep Disturbance:</h4>
                <p className='text-foreground/80 text-sm'>
                  Your medications may be contributing to your sleep difficulties. Visit our website
                  for more information and discuss the impact of your medications on your sleep with
                  your medical provider. Do not discontinue any medications without consulting your
                  prescribing provider.
                </p>
              </div>
            )}

            {hasMildRespiratoryDisturbance && !hasOSA && !hasCOMISA && (
              <div>
                <h4 className='mb-2 font-semibold'>For Respiratory Disturbance:</h4>
                <p className='text-foreground/80 text-sm'>
                  Your snoring and/or mouth breathing may be disrupting your sleep. Visit our
                  website for more information and discuss your symptoms with your medical provider
                  or a sleep specialist.
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
            {(hasOSA || hasDiagnosedOSA) && (
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
                  Your nightmares may be related to trauma and you endorsed symptoms of anxiety.
                  Trauma-related nightmares improve with specialized therapy. Visit our website for
                  resources on finding appropriate mental health support for nightmares and other
                  mental health challenges.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card className='shadow-sleep overflow-hidden border-0'>
        <CardHeader className='bg-gradient-sleep-header text-white'>
          <CardTitle className='flex items-center space-x-2 text-white'>
            <Info className='h-5 w-5' />
            <span>Resources</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='border-primary/20 bg-primary/5 rounded-xl border p-4'>
            <p className='text-foreground/90 text-sm'>
              <strong className='text-primary'>SomnaHealth Services:</strong> Our team offers
              sleep education that addresses the specific problems that we have identified in this
              report. We also have a staff of sleep coaches and board certified sleep doctor who
              can support you with evidence based treatments including CBT-I and consultation
              regarding the best treatment approaches. Visit our website for more information about
              how we can help you achieve better sleep. You can also find board certified sleep
              specialists near where you live. On our website we provide you with links to help you
              find a sleep specialist or other health care professional.
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
