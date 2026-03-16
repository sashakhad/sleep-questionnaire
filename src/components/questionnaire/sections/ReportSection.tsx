import { QuestionnaireFormData } from '@/validations/questionnaire';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DiagnosisScenario } from '@/lib/diagnosis-scenarios';
import type { FullReportResult } from '@/lib/diagnosis-report-types';
import { ReviewModePanel } from '@/components/questionnaire/review/ReviewModePanel';
import {
  getScenarioExpectationResults,
  getScenarioExpectationSummary,
} from '@/lib/scenario-review';
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
  TestTube,
} from 'lucide-react';

interface ReportSectionProps {
  data: QuestionnaireFormData;
  report: FullReportResult;
  onDownloadPDF?: () => void;
  reviewMode?: boolean | undefined;
  reviewScenario?: DiagnosisScenario | undefined;
}

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

export function ReportSection({
  data,
  report,
  onDownloadPDF,
  reviewMode,
  reviewScenario,
}: ReportSectionProps) {
  const { metrics, algorithmBreakdown } = report;
  const scenarioExpectationResults = reviewScenario
    ? getScenarioExpectationResults(reviewScenario, report)
    : [];
  const scenarioExpectationSummary = getScenarioExpectationSummary(scenarioExpectationResults);
  const shouldShowReviewModePanel = !!reviewMode && !!reviewScenario && !!algorithmBreakdown;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className='space-y-8 print:space-y-4'>
      {shouldShowReviewModePanel && reviewScenario && (
        <ReviewModePanel
          report={report}
          reviewScenario={reviewScenario}
          expectationResults={scenarioExpectationResults}
          expectationSummary={scenarioExpectationSummary}
        />
      )}

      {reviewMode && (
        <Alert className='border-primary/20 bg-background/80 print:hidden'>
          <Info className='text-primary h-4 w-4' />
          <AlertDescription className='text-foreground/90'>
            The algorithm viewer above is the primary review artifact. The remaining sections below
            are the patient-facing report preview generated from the same fixed scenario inputs.
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className='space-y-3 text-center'>
        <div className='from-primary/20 to-accent/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br'>
          <Moon className='text-primary h-8 w-8' />
        </div>
        <h1 className='text-foreground text-3xl font-bold tracking-tight md:text-4xl'>
          {reviewMode ? 'Patient-Facing Report Preview' : 'Your Sleep Health Report'}
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
      {report.hasSevereTiredness && (
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
              <span className='text-primary font-semibold'>{report.chronotypeLabel}</span>
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
            {report.hasInsomnia && !report.hasCOMISA && (
              <div className='flex items-start space-x-3'>
                <XCircle className='mt-0.5 h-5 w-5 text-red-500' />
                <div>
                  <h4 className='font-semibold'>
                    Symptoms of Insomnia Disorder ({report.insomniaSeverity})
                  </h4>
                  <p className='text-muted-foreground text-sm'>
                    Difficulty falling asleep and/or staying asleep with daytime impairment. See our
                    website for more information and guidance.
                  </p>
                </div>
              </div>
            )}

            {report.hasEDS && (
              <div className='flex items-start space-x-3'>
                <XCircle
                  className={cn(
                    'mt-0.5 h-5 w-5',
                    report.edsSeverity === 'severe'
                      ? 'text-red-600'
                      : report.edsSeverity === 'moderate'
                        ? 'text-red-500'
                        : 'text-amber-500'
                  )}
                />
                <div>
                  <h4 className='font-semibold'>
                    Excessive Daytime Sleepiness ({report.edsSeverity})
                    {report.edsScore > 0 && (
                      <span className='text-muted-foreground ml-2 text-sm'>
                        (EDS Score: {report.edsScore})
                      </span>
                    )}
                  </h4>
                  <p className='text-muted-foreground text-sm'>
                    {report.edsSeverity === 'severe' &&
                      'Falling asleep inappropriately suggests possible narcolepsy, idiopathic hypersomnia, or severe sleep debt. '}
                    {report.edsSeverity === 'moderate' &&
                      'Significant daytime sleepiness possibly due to moderate sleep debt, insufficient sleep, or snoring/sleep apnea. '}
                    {report.edsSeverity === 'mild' &&
                      'Mild sleepiness that may indicate insufficient sleep or poor sleep quality. '}
                    {report.hasEDSFromNaps &&
                      'Frequent planned daytime naps suggest your nighttime sleep may not be restorative.'}
                  </p>
                </div>
              </div>
            )}

            {report.hasOSA && !report.hasCOMISA && (
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

            {report.hasCOMISA && (
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

            {report.hasRLS && (
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

            {report.hasNightmares && (
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

            {report.chronotypeType === 'delayed' && (
              <div className='flex items-start space-x-3'>
                <Info className='text-primary mt-0.5 h-5 w-5' />
                <div>
                  <h4 className='font-semibold'>Symptoms of Delayed Sleep Phase Disorder</h4>
                  <p className='text-muted-foreground text-sm'>
                    Natural tendency to sleep and wake later than conventional times. See our
                    website for more information and guidance.
                  </p>
                </div>
              </div>
            )}

            {report.hasPoorHygiene && (
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

            {report.hasInsufficientSleep && (
              <div className='flex items-start space-x-3'>
                <XCircle className='mt-0.5 h-5 w-5 text-amber-500' />
                <div>
                  <h4 className='font-semibold'>Symptoms of Insufficient Sleep Syndrome</h4>
                  <p className='text-muted-foreground text-sm'>
                    Your average sleep time of {report.avgWeeklySleep.toFixed(1)} hours is below the
                    recommended 7+ hours. Combined with your daytime sleepiness, this suggests you
                    are not getting enough sleep to meet your body&apos;s needs. See our website for
                    more information and guidance.
                  </p>
                </div>
              </div>
            )}

            {report.hasChronicFatigueSymptoms && (
              <div className='flex items-start space-x-3'>
                <XCircle className='mt-0.5 h-5 w-5 text-amber-500' />
                <div>
                  <h4 className='font-semibold'>Symptoms of Chronic Fatigue / Fibromyalgia</h4>
                  <p className='text-muted-foreground text-sm'>
                    Your responses match the chronic fatigue / fibromyalgia / post-viral symptom
                    screen based on insomnia symptoms and/or multiple daytime fatigue indicators.
                    These symptoms may be associated with fibromyalgia, chronic fatigue syndrome,
                    post-viral illness (e.g., long COVID), or Lyme disease. See our website for more
                    information and guidance.
                  </p>
                </div>
              </div>
            )}

            {report.hasPainRelatedSleepDisturbance && (
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

            {report.hasPainAffectingSleep &&
              !report.hasChronicFatigueSymptoms &&
              !report.hasPainRelatedSleepDisturbance && (
                <div className='flex items-start space-x-3'>
                  <Info className='mt-0.5 h-5 w-5 text-amber-500' />
                  <div>
                    <h4 className='font-semibold'>Pain Affecting Sleep</h4>
                    <p className='text-muted-foreground text-sm'>
                      Moderate to severe pain ({data.daytime.painSeverity}/10) is affecting your
                      sleep quality. Pain management should be addressed alongside sleep treatment.
                    </p>
                  </div>
                </div>
              )}

            {report.hasMedicationRelatedSleepDisturbance && (
              <div className='flex items-start space-x-3'>
                <XCircle className='mt-0.5 h-5 w-5 text-amber-500' />
                <div>
                  <h4 className='font-semibold'>Medication-Related Sleep Disturbance</h4>
                  <p className='text-muted-foreground text-sm'>
                    The medications that you are currently taking can contribute to sleep
                    disturbance and your sleepiness/tiredness or fatigue during the day. Please
                    check out our website for more information and discuss the impact of your
                    medications on your sleep with your medical provider. Do not discontinue
                    prescription or over the counter medications that your medical providers have
                    recommended.
                  </p>
                </div>
              </div>
            )}

            {report.hasMildRespiratoryDisturbance && !report.hasCOMISA && (
              <div className='flex items-start space-x-3'>
                <Info className='mt-0.5 h-5 w-5 text-amber-500' />
                <div>
                  <h4 className='font-semibold'>Mild Respiratory Disturbance</h4>
                  <p className='text-muted-foreground text-sm'>
                    You have at least mild symptoms of sleep-related respiratory disturbance that
                    may require more assessment. Both snoring and mouth breathing alone or together
                    cause sleep disruption and may place a burden on your cardiovascular and
                    respiratory system. Please see our website for more detailed information and
                    discuss your symptoms with your medical provider or a sleep specialist.
                  </p>
                </div>
              </div>
            )}

            {report.hasLegCrampsConcern && (
              <div className='flex items-start space-x-3'>
                <Info className='mt-0.5 h-5 w-5 text-amber-500' />
                <div>
                  <h4 className='font-semibold'>Nocturnal Leg Cramps</h4>
                  <p className='text-muted-foreground text-sm'>
                    Your nocturnal leg cramps can be sleep disruptors and can be a sign of age,
                    muscle fatigue, an electrolyte or other imbalance. They can be more common
                    during pregnancy. Since these occur on two or more nights a week, we suggest
                    that you discuss these symptoms with your primary care provider.
                  </p>
                </div>
              </div>
            )}

            {report.osaTreatmentIneffective && (
              <div className='flex items-start space-x-3'>
                <AlertCircle className='mt-0.5 h-5 w-5 text-amber-500' />
                <div>
                  <h4 className='font-semibold'>Sleep Apnea Treatment Not Fully Effective</h4>
                  <p className='text-muted-foreground text-sm'>
                    You indicated that despite being treated for sleep apnea, you are still having
                    symptoms. Please see the section on our website related to your disorder and
                    discuss with your primary care provider. You may benefit from a consultation
                    with a sleep specialist.
                  </p>
                </div>
              </div>
            )}

            {report.rlsTreatmentIneffective && (
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

            {!report.hasInsomnia &&
              !report.hasEDS &&
              !report.hasOSA &&
              !report.hasCOMISA &&
              !report.hasRLS &&
              !report.hasNightmares &&
              !report.hasPoorHygiene &&
              !report.hasInsufficientSleep &&
              !report.hasChronicFatigueSymptoms &&
              !report.hasPainAffectingSleep &&
              !report.hasPainRelatedSleepDisturbance &&
              !report.hasMedicationRelatedSleepDisturbance &&
              !report.hasMildRespiratoryDisturbance &&
              !report.hasLegCrampsConcern &&
              !report.osaTreatmentIneffective &&
              !report.rlsTreatmentIneffective && (
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
            {report.hasInsomnia && (
              <div>
                <h4 className='mb-2 font-semibold'>For Your Insomnia Symptoms:</h4>
                <p className='text-foreground/80 text-sm'>
                  Based on your responses, we recommend exploring treatment options for insomnia.
                  Visit our website for detailed information on evidence-based treatments including
                  Cognitive Behavioral Therapy for Insomnia (CBT-I) and other strategies.
                </p>
              </div>
            )}

            {report.hasOSA && !report.hasCOMISA && (
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

            {report.hasCOMISA && (
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

            {report.hasRLS && (
              <div>
                <h4 className='mb-2 font-semibold'>For Restless Legs Syndrome Symptoms:</h4>
                <p className='text-foreground/80 text-sm'>
                  Based on your responses, we recommend exploring treatment options for restless
                  legs syndrome. Visit our website for detailed information on iron levels,
                  lifestyle changes, and other treatments.
                </p>
              </div>
            )}

            {report.hasInsufficientSleep && (
              <div>
                <h4 className='mb-2 font-semibold text-amber-600'>
                  For Insufficient Sleep Symptoms:
                </h4>
                <p className='text-foreground/80 text-sm'>
                  You&apos;re averaging {report.avgWeeklySleep.toFixed(1)} hours of sleep per night.
                  Most adults need 7-9 hours for optimal health and functioning. Visit our website
                  for strategies to improve your sleep duration and schedule.
                </p>
              </div>
            )}

            {report.hasChronicFatigueSymptoms && (
              <div>
                <h4 className='mb-2 font-semibold text-amber-600'>For Chronic Fatigue Symptoms:</h4>
                <p className='text-foreground/80 text-sm'>
                  Your combination of non-restorative sleep, pain, and fatigue warrants medical
                  evaluation. Visit our website for detailed information on evaluation options and
                  management strategies.
                </p>
              </div>
            )}

            {report.hasPainRelatedSleepDisturbance && (
              <div>
                <h4 className='mb-2 font-semibold'>For Pain-Related Sleep Disturbance:</h4>
                <p className='text-foreground/80 text-sm'>
                  Addressing both your sleep problems and pain is important for improving your
                  quality of life. Visit our website for more information on the relationship
                  between pain and sleep and discuss this finding with your primary medical
                  provider.
                </p>
              </div>
            )}

            {report.hasPainAffectingSleep && !report.hasPainRelatedSleepDisturbance && (
              <div>
                <h4 className='mb-2 font-semibold'>For Pain Affecting Sleep:</h4>
                <p className='text-foreground/80 text-sm'>
                  Pain is affecting your sleep quality. Visit our website for information on pain
                  management strategies and how to improve sleep when dealing with chronic pain.
                </p>
              </div>
            )}

            {report.hasMedicationRelatedSleepDisturbance && (
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

            {report.hasMildRespiratoryDisturbance && !report.hasOSA && !report.hasCOMISA && (
              <div>
                <h4 className='mb-2 font-semibold'>For Respiratory Disturbance:</h4>
                <p className='text-foreground/80 text-sm'>
                  Your snoring and/or mouth breathing may be disrupting your sleep. Visit our
                  website for more information and discuss your symptoms with your medical provider
                  or a sleep specialist.
                </p>
              </div>
            )}

            {report.chronotypeType === 'delayed' && (
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
      {(report.hasEDS || report.hasParasomniaSafetyRisk || report.hasMedicationAlcoholRisk) && (
        <Card className='shadow-sleep overflow-hidden border-0 border-l-4 border-l-red-500'>
          <CardHeader className='bg-red-50'>
            <CardTitle className='flex items-center space-x-2 text-red-700'>
              <AlertCircle className='h-5 w-5' />
              <span>Important Safety Warnings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className='pt-6'>
            <div className='space-y-4'>
              {report.hasEDS && report.edsSeverity !== 'mild' && (
                <Alert className='alert-danger'>
                  <AlertCircle className='h-4 w-4 text-red-600' />
                  <AlertDescription className='text-red-900'>
                    <strong>Daytime Sleepiness Warning</strong>
                    <br />
                    Your daytime sleepiness symptoms are significant and we suggest that you
                    exercise significant caution that might include avoiding driving, biking or
                    other high risk activities until you are treated. More specific recommendations
                    are on our website.
                  </AlertDescription>
                </Alert>
              )}

              {report.hasParasomniaSafetyRisk && (
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

              {report.hasMedicationAlcoholRisk && (
                <Alert className='alert-warning'>
                  <AlertCircle className='h-4 w-4 text-amber-600' />
                  <AlertDescription className='text-amber-900'>
                    <strong>Medication/Substance Warning</strong>
                    <br />
                    Your use of sedating medications, caffeine, and/or alcohol is significant and
                    can lead to health risks and injury. We provide additional information on our
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
            {(report.hasOSA || report.hasDiagnosedOSA) && (
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

            {report.insomniaSeverity === 'moderate-to-severe' && (
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

      {reviewScenario && !reviewMode && (
        <Card className='shadow-sleep overflow-hidden border-0'>
          <CardHeader className='bg-gradient-sleep-header text-white'>
            <CardTitle className='flex items-center space-x-2 text-white'>
              <TestTube className='h-5 w-5' />
              <span>Scenario Verification</span>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4 pt-6'>
            <div className='bg-primary/5 border-primary/20 rounded-xl border p-4'>
              <p className='text-foreground text-sm font-semibold'>{reviewScenario.label}</p>
              <p className='text-muted-foreground mt-1 text-sm leading-relaxed'>
                {reviewScenario.description}
              </p>
              <div className='mt-3 flex flex-wrap gap-2'>
                <span className='bg-primary/10 text-primary inline-flex rounded-full px-2.5 py-1 text-xs font-semibold'>
                  {scenarioExpectationSummary.matchedCount}/{scenarioExpectationSummary.totalCount}{' '}
                  matched
                </span>
                <span
                  className={cn(
                    'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                    scenarioExpectationSummary.mismatchCount === 0
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  )}
                >
                  {scenarioExpectationSummary.mismatchCount === 0
                    ? 'Expected and actual are aligned'
                    : `${scenarioExpectationSummary.mismatchCount} mismatch${
                        scenarioExpectationSummary.mismatchCount === 1 ? '' : 'es'
                      } to review`}
                </span>
              </div>
            </div>

            <div className='grid gap-3 md:grid-cols-2'>
              {scenarioExpectationResults.map(result => (
                <div
                  key={result.key}
                  className={cn(
                    'rounded-xl border p-4',
                    result.matches
                      ? 'border-green-200 bg-green-50/50'
                      : 'border-amber-200 bg-amber-50/50'
                  )}
                >
                  <div className='flex items-start justify-between gap-3'>
                    <p className='text-foreground text-sm font-semibold'>{result.label}</p>
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                        result.matches
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      )}
                    >
                      {result.matches ? 'Matched' : 'Mismatch'}
                    </span>
                  </div>
                  <div className='mt-3 space-y-1 text-sm'>
                    <p className='text-muted-foreground'>
                      <strong className='text-foreground'>Expected:</strong> {result.expected}
                    </p>
                    <p className='text-muted-foreground'>
                      <strong className='text-foreground'>Actual:</strong> {result.actual}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {algorithmBreakdown && !reviewMode && (
        <Card className='shadow-sleep overflow-hidden border-0'>
          <CardHeader className='bg-gradient-sleep-header text-white'>
            <CardTitle className='flex items-center space-x-2 text-white'>
              <TestTube className='h-5 w-5' />
              <span>{reviewMode ? 'Algorithm Review Details' : 'Algorithm Details (Dev)'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className='pt-6'>
            <details className='rounded-xl border border-amber-200 bg-amber-50/60 p-4'>
              <summary className='cursor-pointer list-none font-semibold text-amber-950'>
                Show scoring breakdown
              </summary>
              <p className='mt-3 text-sm text-amber-900/80'>
                This panel shows the exact inputs, thresholds, and outputs used to build the report.
              </p>

              <div className='mt-6 space-y-6'>
                <div>
                  <h3 className='mb-3 text-sm font-semibold tracking-wide text-amber-950 uppercase'>
                    Computed Metrics
                  </h3>
                  <div className='grid gap-3 md:grid-cols-2'>
                    {algorithmBreakdown.metrics.map(metric => (
                      <div
                        key={metric.label}
                        className='rounded-lg border border-amber-200 bg-white/80 p-3'
                      >
                        <p className='text-sm font-medium text-amber-950'>{metric.label}</p>
                        <p className='text-foreground mt-1 text-base font-semibold'>
                          {metric.value}
                        </p>
                        {metric.note && (
                          <p className='text-muted-foreground mt-1 text-xs leading-relaxed'>
                            {metric.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className='mb-3 text-sm font-semibold tracking-wide text-amber-950 uppercase'>
                    Diagnostic Criteria
                  </h3>
                  <div className='space-y-4'>
                    {algorithmBreakdown.diagnoses.map(diagnosis => (
                      <div
                        key={diagnosis.id}
                        className='rounded-lg border border-amber-200 bg-white/80 p-4'
                      >
                        <div className='flex flex-col gap-1 md:flex-row md:items-start md:justify-between'>
                          <div>
                            <h4 className='text-foreground font-semibold'>{diagnosis.label}</h4>
                            <p className='text-muted-foreground text-sm'>{diagnosis.outcome}</p>
                          </div>
                        </div>

                        <div className='mt-4 space-y-2'>
                          {diagnosis.criteria.map(criteria => (
                            <div
                              key={`${diagnosis.id}-${criteria.label}`}
                              className='border-border/60 bg-background/80 rounded-md border p-3'
                            >
                              <div className='flex flex-col gap-1 md:flex-row md:items-start md:justify-between'>
                                <p className='text-foreground text-sm font-medium'>
                                  {criteria.label}
                                </p>
                                <span
                                  className={cn(
                                    'inline-flex w-fit rounded-full px-2 py-0.5 text-xs font-medium',
                                    criteria.met
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-slate-100 text-slate-600'
                                  )}
                                >
                                  {criteria.met ? 'Met' : 'Not met'}
                                </span>
                              </div>
                              <p className='text-muted-foreground mt-1 text-sm'>
                                <strong className='text-foreground'>Observed:</strong>{' '}
                                {criteria.actual}
                              </p>
                              {criteria.threshold && (
                                <p className='text-muted-foreground text-sm'>
                                  <strong className='text-foreground'>Threshold:</strong>{' '}
                                  {criteria.threshold}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>

                        {diagnosis.notes && diagnosis.notes.length > 0 && (
                          <div className='mt-3 space-y-1'>
                            {diagnosis.notes.map(note => (
                              <p key={note} className='text-muted-foreground text-xs'>
                                {note}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </details>
          </CardContent>
        </Card>
      )}

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
              <strong className='text-primary'>SomnaHealth Services:</strong> Our team offers sleep
              education that addresses the specific problems that we have identified in this report.
              We also have a staff of sleep coaches and board certified sleep doctor who can support
              you with evidence based treatments including CBT-I and consultation regarding the best
              treatment approaches. Visit our website for more information about how we can help you
              achieve better sleep. You can also find board certified sleep specialists near where
              you live. On our website we provide you with links to help you find a sleep specialist
              or other health care professional.
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
