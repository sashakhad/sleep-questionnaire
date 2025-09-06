import { QuestionnaireFormData } from '@/validations/questionnaire'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  Moon, 
  Brain, 
  Heart, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Printer,
  Download
} from 'lucide-react'

interface ReportSectionProps {
  data: QuestionnaireFormData
}

interface SleepMetrics {
  scheduledTST: number // Total Sleep Time
  unscheduledTST: number
  scheduledSE: number // Sleep Efficiency
  unscheduledSE: number
  scheduledSOL: number // Sleep Onset Latency
  unscheduledSOL: number
  scheduledWASO: number // Wake After Sleep Onset
  unscheduledWASO: number
  midSleepScheduled: string
  midSleepUnscheduled: string
}

function calculateSleepMetrics(data: QuestionnaireFormData): SleepMetrics {
  // Helper to convert time string to minutes from midnight
  const timeToMinutes = (time: string): number => {
    if (!time) { return 0 }
    const [hours, minutes] = time.split(':').map(Number)
    return (hours ?? 0) * 60 + (minutes ?? 0)
  }

  // Helper to convert minutes to time string
  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60) % 24
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  // Calculate for scheduled days
  const scheduledBedtime = timeToMinutes(data.scheduledSleep.lightsOutTime)
  const scheduledWaketime = timeToMinutes(data.scheduledSleep.wakeupTime)
  let scheduledTimeInBed = scheduledWaketime - scheduledBedtime
  if (scheduledTimeInBed < 0) { scheduledTimeInBed += 1440 } // Handle crossing midnight

  const scheduledTST = scheduledTimeInBed - data.scheduledSleep.minutesToFallAsleep - data.scheduledSleep.minutesAwakeAtNight
  const scheduledSE = (scheduledTST / scheduledTimeInBed) * 100

  // Calculate mid-sleep time for scheduled days
  const scheduledMidSleep = scheduledBedtime + data.scheduledSleep.minutesToFallAsleep + (scheduledTST / 2)
  
  // Calculate for unscheduled days
  const unscheduledBedtime = timeToMinutes(data.unscheduledSleep.lightsOutTime)
  const unscheduledWaketime = timeToMinutes(data.unscheduledSleep.wakeupTime)
  let unscheduledTimeInBed = unscheduledWaketime - unscheduledBedtime
  if (unscheduledTimeInBed < 0) { unscheduledTimeInBed += 1440 }

  const unscheduledTST = unscheduledTimeInBed - data.unscheduledSleep.minutesToFallAsleep - data.unscheduledSleep.minutesAwakeAtNight
  const unscheduledSE = (unscheduledTST / unscheduledTimeInBed) * 100

  // Calculate mid-sleep time for unscheduled days
  const unscheduledMidSleep = unscheduledBedtime + data.unscheduledSleep.minutesToFallAsleep + (unscheduledTST / 2)

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
    midSleepUnscheduled: minutesToTime(unscheduledMidSleep % 1440)
  }
}

function getInsomniaSeverity(data: QuestionnaireFormData, metrics: SleepMetrics): string {
  const hasSOI = metrics.scheduledSOL > 30 || metrics.unscheduledSOL > 30
  const hasSMI = metrics.scheduledWASO > 40 || metrics.unscheduledWASO > 40
  const hasEMA = data.scheduledSleep.earlyWakeupMinutes && data.scheduledSleep.earlyWakeupMinutes > 20
  const hasDaytimeImpairment = data.daytime.tirednessInterferes
  
  if (!hasSOI && !hasSMI && !hasEMA) { return 'none' }
  if (!hasDaytimeImpairment) { return 'subclinical' }
  
  const cancelsActivities = data.mentalHealth.cancelsAfterPoorSleep
  if (cancelsActivities === '3+week') { return 'severe' }
  if (cancelsActivities === '1-2week') { return 'moderate' }
  return 'mild'
}

function getChronotype(metrics: SleepMetrics, preference: string): string {
  const midSleepHour = parseInt(metrics.midSleepScheduled.split(':')[0] ?? '0')
  
  if (preference === 'late' || midSleepHour >= 4) { return 'delayed' }
  if (preference === 'early' || midSleepHour <= 1) { return 'advanced' }
  return 'normal'
}

export function ReportSection({ data }: ReportSectionProps) {
  const metrics = calculateSleepMetrics(data)
  const insomniaSeverity = getInsomniaSeverity(data, metrics)
  const chronotype = getChronotype(metrics, data.chronotype.preference)
  
  // Identify major issues
  const hasInsomnia = insomniaSeverity !== 'none' && insomniaSeverity !== 'subclinical'
  const hasEDS = data.daytime.plannedNaps.daysPerWeek >= 3 && 
                 data.daytime.plannedNaps.duration && 
                 ['30-90', '>90'].includes(data.daytime.plannedNaps.duration)
  const hasOSA = data.breathingDisorders.stopsBreathing || 
                 (data.breathingDisorders.snores && data.breathingDisorders.wakesWithDryMouth)
  const hasRLS = data.restlessLegs.troubleLyingStill && 
                 data.restlessLegs.urgeToMoveLegs && 
                 data.restlessLegs.movementRelieves
  const hasNightmares = data.nightmares.nightmaresPerWeek && data.nightmares.nightmaresPerWeek >= 3
  const hasPoorHygiene = data.lifestyle.caffeinePerDay > 4 || 
                         (data.lifestyle.lastCaffeineTime && parseInt(data.lifestyle.lastCaffeineTime.split(':')[0] ?? '0') >= 14)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Your Personalized Sleep Health Report
        </h1>
        <p className="text-gray-600">
          Generated on {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Thank you message */}
      <Alert className="border-blue-200 bg-blue-50">
        <Heart className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          Thank you for completing the SomnaHealth comprehensive sleep questionnaire. With more than 
          4 decades of collective experience, our team created this questionnaire and personalized 
          report to provide you with guidance on improving your sleep health.
        </AlertDescription>
      </Alert>

      {/* Sleep Metrics Summary */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle className="flex items-center space-x-2">
            <Moon className="h-5 w-5" />
            <span>Your Sleep Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Work/School Days</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Average Sleep Duration:</span>
                  <span className="font-medium">{metrics.scheduledTST.toFixed(1)} hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Sleep Efficiency:</span>
                  <span className={cn(
                    "font-medium",
                    metrics.scheduledSE >= 85 ? "text-green-600" : 
                    metrics.scheduledSE >= 75 ? "text-amber-600" : "text-red-600"
                  )}>
                    {metrics.scheduledSE.toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Time to Fall Asleep:</span>
                  <span className={cn(
                    "font-medium",
                    metrics.scheduledSOL <= 30 ? "text-green-600" : "text-amber-600"
                  )}>
                    {metrics.scheduledSOL} minutes
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Time Awake at Night:</span>
                  <span className={cn(
                    "font-medium",
                    metrics.scheduledWASO <= 40 ? "text-green-600" : "text-amber-600"
                  )}>
                    {metrics.scheduledWASO} minutes
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Weekends/Free Days</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Average Sleep Duration:</span>
                  <span className="font-medium">{metrics.unscheduledTST.toFixed(1)} hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Sleep Efficiency:</span>
                  <span className={cn(
                    "font-medium",
                    metrics.unscheduledSE >= 85 ? "text-green-600" : 
                    metrics.unscheduledSE >= 75 ? "text-amber-600" : "text-red-600"
                  )}>
                    {metrics.unscheduledSE.toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Time to Fall Asleep:</span>
                  <span className={cn(
                    "font-medium",
                    metrics.unscheduledSOL <= 30 ? "text-green-600" : "text-amber-600"
                  )}>
                    {metrics.unscheduledSOL} minutes
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Time Awake at Night:</span>
                  <span className={cn(
                    "font-medium",
                    metrics.unscheduledWASO <= 40 ? "text-green-600" : "text-amber-600"
                  )}>
                    {metrics.unscheduledWASO} minutes
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Sleep Pattern Analysis:</strong> You sleep an average of{' '}
              <span className="font-semibold">{metrics.scheduledTST.toFixed(1)} hours</span> on weekdays and{' '}
              <span className="font-semibold">{metrics.unscheduledTST.toFixed(1)} hours</span> on weekends.
              {Math.abs(metrics.scheduledTST - metrics.unscheduledTST) > 2 && (
                <span className="text-amber-600">
                  {' '}Your sleep varies significantly between weekdays and weekends, which may indicate social jet lag.
                </span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Identified Issues */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>Identified Sleep Issues</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {hasInsomnia && (
              <div className="flex items-start space-x-3">
                <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Insomnia ({insomniaSeverity})</h4>
                  <p className="text-sm text-gray-600">
                    Difficulty falling asleep and/or staying asleep with daytime impairment
                  </p>
                </div>
              </div>
            )}
            
            {hasEDS && (
              <div className="flex items-start space-x-3">
                <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Excessive Daytime Sleepiness</h4>
                  <p className="text-sm text-gray-600">
                    Frequent long naps suggesting possible sleep disorder
                  </p>
                </div>
              </div>
            )}

            {hasOSA && (
              <div className="flex items-start space-x-3">
                <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Possible Sleep Apnea</h4>
                  <p className="text-sm text-gray-600">
                    Symptoms suggest sleep-disordered breathing requiring medical evaluation
                  </p>
                </div>
              </div>
            )}

            {hasRLS && (
              <div className="flex items-start space-x-3">
                <XCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Restless Legs Syndrome Symptoms</h4>
                  <p className="text-sm text-gray-600">
                    Leg discomfort affecting sleep onset
                  </p>
                </div>
              </div>
            )}

            {hasNightmares && (
              <div className="flex items-start space-x-3">
                <XCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Frequent Nightmares</h4>
                  <p className="text-sm text-gray-600">
                    Disturbing dreams affecting sleep quality
                  </p>
                </div>
              </div>
            )}

            {chronotype === 'delayed' && (
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Delayed Sleep Phase</h4>
                  <p className="text-sm text-gray-600">
                    Natural tendency to sleep and wake later than conventional times
                  </p>
                </div>
              </div>
            )}

            {hasPoorHygiene && (
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Sleep Hygiene Issues</h4>
                  <p className="text-sm text-gray-600">
                    Lifestyle factors that may be impacting sleep quality
                  </p>
                </div>
              </div>
            )}

            {!hasInsomnia && !hasEDS && !hasOSA && !hasRLS && !hasNightmares && !hasPoorHygiene && (
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">No Major Sleep Issues Detected</h4>
                  <p className="text-sm text-gray-600">
                    Your sleep patterns appear generally healthy
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personalized Recommendations */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>Personalized Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {hasInsomnia && (
              <div>
                <h4 className="font-semibold mb-2">For Your Insomnia:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Consider Cognitive Behavioral Therapy for Insomnia (CBT-I)</li>
                  <li>Maintain consistent sleep and wake times, even on weekends</li>
                  <li>Limit time in bed to actual sleep time (sleep restriction)</li>
                  <li>Avoid screens 1-2 hours before bedtime</li>
                  {data.mentalHealth.anxietyInBed && (
                    <li>Practice relaxation techniques: deep breathing, progressive muscle relaxation</li>
                  )}
                </ul>
              </div>
            )}

            {hasOSA && (
              <div>
                <h4 className="font-semibold mb-2 text-red-600">⚠️ Urgent: Sleep Apnea Evaluation</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Schedule a sleep study with a sleep specialist immediately</li>
                  <li>Discuss CPAP therapy or other treatment options</li>
                  <li>If overweight, weight loss can significantly improve symptoms</li>
                  <li>Avoid alcohol and sedatives which worsen apnea</li>
                  <li>Sleep on your side rather than your back</li>
                </ul>
              </div>
            )}

            {hasRLS && (
              <div>
                <h4 className="font-semibold mb-2">For Restless Legs Syndrome:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Have your ferritin levels checked by your doctor</li>
                  <li>Consider iron supplementation if levels are below 75mcg/ml</li>
                  <li>Reduce caffeine and alcohol consumption</li>
                  <li>Gentle stretching or yoga before bed</li>
                  <li>Maintain regular exercise routine</li>
                </ul>
              </div>
            )}

            {chronotype === 'delayed' && (
              <div>
                <h4 className="font-semibold mb-2">For Delayed Sleep Phase:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Use bright light therapy in the morning (10,000 lux for 30 minutes)</li>
                  <li>Avoid bright lights and screens in the evening</li>
                  <li>Consider melatonin 3-5 hours before desired bedtime (consult doctor)</li>
                  <li>Gradually shift bedtime earlier by 15-30 minutes every few days</li>
                </ul>
              </div>
            )}

            {/* Sleep Hygiene Recommendations */}
            <div>
              <h4 className="font-semibold mb-2">General Sleep Hygiene:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {data.lifestyle.caffeinePerDay > 2 && (
                  <li>Reduce caffeine to 1-2 cups per day, none after noon</li>
                )}
                {data.lifestyle.alcoholPerWeek.wine + data.lifestyle.alcoholPerWeek.cocktails > 7 && (
                  <li>Limit alcohol, especially within 3 hours of bedtime</li>
                )}
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
          </div>
        </CardContent>
      </Card>

      {/* When to Seek Help */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>When to Seek Professional Help</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {(hasOSA || data.breathingDisorders.diagnosed) && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-900">
                  <strong>Immediate Medical Attention Recommended</strong>
                  <br />
                  Your symptoms suggest sleep apnea, which can have serious health consequences. 
                  Please schedule an appointment with a sleep specialist as soon as possible.
                </AlertDescription>
              </Alert>
            )}

            {insomniaSeverity === 'severe' && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-900">
                  <strong>Professional Sleep Consultation Recommended</strong>
                  <br />
                  Your insomnia is significantly impacting your daily life. Consider seeing a 
                  behavioral sleep medicine specialist for comprehensive treatment.
                </AlertDescription>
              </Alert>
            )}

            {data.nightmares.associatedWithTrauma && (
              <Alert>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  <strong>Mental Health Support Available</strong>
                  <br />
                  Trauma-related nightmares benefit from specialized therapy. Consider seeking 
                  a mental health professional who specializes in trauma treatment.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 print:hidden">
        <Button onClick={handlePrint} className="flex items-center space-x-2">
          <Printer className="h-4 w-4" />
          <span>Print Report</span>
        </Button>
        <Button variant="outline" className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Download PDF</span>
        </Button>
      </div>

      {/* Disclaimer */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Important Disclaimer</strong>
          <br />
          This report is for informational purposes only and does not constitute medical advice. 
          Please consult with qualified healthcare professionals for diagnosis and treatment of 
          sleep disorders. If you are experiencing a medical emergency, call 911 immediately.
        </AlertDescription>
      </Alert>
    </div>
  )
}
