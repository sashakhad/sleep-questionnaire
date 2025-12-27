import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { QuestionnaireFormData } from '@/validations/questionnaire';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontSize: 11,
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #3b82f6',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    backgroundColor: '#f3f4f6',
    padding: 8,
  },
  subsectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 6,
    marginTop: 10,
  },
  text: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 1.6,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 1.6,
    marginBottom: 10,
    textAlign: 'justify',
  },
  metric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingBottom: 2,
  },
  metricLabel: {
    fontSize: 10,
    color: '#4b5563',
  },
  metricValue: {
    fontSize: 10,
    color: '#111827',
    fontWeight: 'bold',
  },
  warningBox: {
    backgroundColor: '#fef2f2',
    border: '1 solid #dc2626',
    padding: 10,
    marginVertical: 10,
    borderRadius: 4,
  },
  warningText: {
    fontSize: 10,
    color: '#991b1b',
    lineHeight: 1.5,
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    border: '1 solid #3b82f6',
    padding: 10,
    marginVertical: 10,
    borderRadius: 4,
  },
  infoText: {
    fontSize: 10,
    color: '#1e40af',
    lineHeight: 1.5,
  },
  recommendationBox: {
    backgroundColor: '#f0f9ff',
    border: '1 solid #3b82f6',
    padding: 10,
    marginVertical: 8,
    borderRadius: 4,
  },
  recommendationText: {
    fontSize: 10,
    color: '#1e40af',
    marginBottom: 3,
  },
  bulletPoint: {
    fontSize: 10,
    color: '#374151',
    marginLeft: 10,
    marginBottom: 3,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  gridColumn: {
    width: '48%',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    borderTop: '1 solid #e5e7eb',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 9,
    color: '#9ca3af',
    textAlign: 'center',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 15,
    right: 30,
    fontSize: 9,
    color: '#9ca3af',
  },
  link: {
    color: '#2563eb',
    textDecoration: 'underline',
    fontSize: 10,
  },
  resourceBox: {
    backgroundColor: '#f8fafc',
    border: '1 solid #e2e8f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 4,
  },
  resourceTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
});

interface ReportPDFProps {
  data: QuestionnaireFormData;
  userName?: string;
}

// EDS weighted scoring
const EDS_WEIGHTS: Record<string, number> = {
  stoplight: 2,
  lectures: 1,
  working: 1,
  conversation: 2,
  evening: 1,
  meal: 2,
};

function calculateEDSScore(fallAsleepDuring: string[]): {
  score: number;
  severity: 'none' | 'mild' | 'moderate' | 'severe';
} {
  let score = 0;
  for (const activity of fallAsleepDuring) {
    score += EDS_WEIGHTS[activity] ?? 1;
  }

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

// Helper function to parse time string to minutes from midnight
function timeToMinutes(
  time: string | undefined,
  defaultHours: number,
  defaultMinutes: number = 0
): number {
  // Handle empty strings, undefined, or invalid values
  if (!time || time.trim() === '') {
    return defaultHours * 60 + defaultMinutes;
  }
  const parts = time.split(':');
  const hours = parseInt(parts[0] || String(defaultHours), 10);
  const minutes = parseInt(parts[1] || String(defaultMinutes), 10);
  // Handle NaN cases
  if (Number.isNaN(hours)) {
    return defaultHours * 60 + defaultMinutes;
  }
  if (Number.isNaN(minutes)) {
    return hours * 60;
  }
  return hours * 60 + minutes;
}

// Helper function to calculate sleep metrics
function calculateSleepMetrics(data: QuestionnaireFormData) {
  // Scheduled/work days calculations - use minutes for accuracy
  const scheduledBedtimeMinutes = timeToMinutes(data.scheduledSleep.lightsOutTime, 22, 0);
  const scheduledWaketimeMinutes = timeToMinutes(data.scheduledSleep.wakeupTime, 7, 0);
  let scheduledTimeInBedMinutes = scheduledWaketimeMinutes - scheduledBedtimeMinutes;
  if (scheduledTimeInBedMinutes < 0) {
    scheduledTimeInBedMinutes += 1440; // 24 hours in minutes
  }

  const scheduledSOL = data.scheduledSleep.minutesToFallAsleep || 0;
  const scheduledWASO = data.scheduledSleep.minutesAwakeAtNight || 0;
  const scheduledTSTMinutes = scheduledTimeInBedMinutes - scheduledSOL - scheduledWASO;
  const scheduledTST = scheduledTSTMinutes / 60; // Convert to hours
  const scheduledSE =
    scheduledTimeInBedMinutes > 0 ? (scheduledTSTMinutes / scheduledTimeInBedMinutes) * 100 : 0;

  // Unscheduled/weekend calculations - use minutes for accuracy
  const unscheduledBedtimeMinutes = timeToMinutes(data.unscheduledSleep.lightsOutTime, 23, 0);
  const unscheduledWaketimeMinutes = timeToMinutes(data.unscheduledSleep.wakeupTime, 9, 0);
  let unscheduledTimeInBedMinutes = unscheduledWaketimeMinutes - unscheduledBedtimeMinutes;
  if (unscheduledTimeInBedMinutes < 0) {
    unscheduledTimeInBedMinutes += 1440; // 24 hours in minutes
  }

  const unscheduledSOL = data.unscheduledSleep.minutesToFallAsleep || 0;
  const unscheduledWASO = data.unscheduledSleep.minutesAwakeAtNight || 0;
  const unscheduledTSTMinutes = unscheduledTimeInBedMinutes - unscheduledSOL - unscheduledWASO;
  const unscheduledTST = unscheduledTSTMinutes / 60; // Convert to hours
  const unscheduledSE =
    unscheduledTimeInBedMinutes > 0
      ? (unscheduledTSTMinutes / unscheduledTimeInBedMinutes) * 100
      : 0;

  return {
    scheduledTST,
    scheduledSE,
    scheduledSOL,
    scheduledWASO,
    unscheduledTST,
    unscheduledSE,
    unscheduledSOL,
    unscheduledWASO,
    sleepVariability: Math.abs(scheduledTST - unscheduledTST),
  };
}

// Helper function to get insomnia severity
function getInsomniaSeverity(
  data: QuestionnaireFormData,
  metrics: ReturnType<typeof calculateSleepMetrics>
) {
  if (metrics.scheduledSOL > 30 || metrics.scheduledWASO > 40) {
    if (data.daytime.tirednessInterferes) {
      return 'moderate to severe';
    }
    return 'mild';
  }
  return 'none';
}

// Helper function to determine chronotype
function getChronotype(
  data: QuestionnaireFormData,
  metrics: ReturnType<typeof calculateSleepMetrics>
) {
  const scheduledBedtimeMinutes = timeToMinutes(data.scheduledSleep.lightsOutTime, 22, 0);
  const scheduledBedtimeHours = scheduledBedtimeMinutes / 60;
  const midSleepScheduled = scheduledBedtimeHours + metrics.scheduledTST / 2;

  if (data.chronotype.preference === 'late' || midSleepScheduled >= 4) {
    return 'evening (night owl)';
  } else if (data.chronotype.preference === 'early' || midSleepScheduled <= 1) {
    return 'morning (early bird)';
  }
  return 'flexible';
}

export function ReportPDF({ data, userName = 'Patient' }: ReportPDFProps) {
  const metrics = calculateSleepMetrics(data);
  const insomniaSeverity = getInsomniaSeverity(data, metrics);
  const chronotype = getChronotype(data, metrics);

  // Calculate weighted EDS score
  const edsResult = calculateEDSScore(data.daytime.fallAsleepDuring);
  const hasEDSFromActivities = edsResult.severity !== 'none';

  // Identify major issues
  const hasInsomnia = insomniaSeverity !== 'none';
  const hasEDSFromNaps =
    data.daytime.plannedNaps.daysPerWeek >= 3 &&
    data.daytime.plannedNaps.duration &&
    ['30-90', '>90'].includes(data.daytime.plannedNaps.duration);
  const hasEDS = hasEDSFromActivities || hasEDSFromNaps;
  const hasOSA =
    data.breathingDisorders.stopsBreathing ||
    (data.breathingDisorders.snores && data.breathingDisorders.wakesWithDryMouth);
  const hasCOMISA = hasInsomnia && hasOSA; // Comorbid Insomnia and Sleep Apnea
  const hasRLS =
    data.restlessLegs.troubleLyingStill &&
    data.restlessLegs.urgeToMoveLegs &&
    data.restlessLegs.movementRelieves;
  const hasNightmares = data.nightmares.nightmaresPerWeek && data.nightmares.nightmaresPerWeek >= 3;
  const hasPoorHygiene =
    data.lifestyle.caffeinePerDay > 4 ||
    (data.lifestyle.lastCaffeineTime &&
      parseInt(data.lifestyle.lastCaffeineTime.split(':')[0] ?? '0') >= 14);
  const hasAnxiety = data.mentalHealth.worriesAffectSleep || data.mentalHealth.anxietyInBed;
  const hasSevereTiredness = (data.daytime.tirednessSeverity ?? 0) > 8;

  // Insufficient Sleep Syndrome detection
  const avgWeeklySleep = (metrics.scheduledTST * 5 + metrics.unscheduledTST * 2) / 7;
  const hasDaytimeSleepiness =
    data.daytime.tirednessInterferes || hasEDS || data.daytime.fallAsleepDuring.length >= 3;
  const hasNarcolepsy =
    data.daytime.diagnosedNarcolepsy ||
    (data.daytime.weaknessWhenExcited.length > 0 && data.daytime.sleepParalysis);
  const hasInsufficientSleep =
    avgWeeklySleep < 7 && hasDaytimeSleepiness && !hasNarcolepsy && !hasOSA;

  // Chronic Fatigue / Fibromyalgia screening
  const hasChronicFatigueSymptoms =
    data.daytime.nonRestorativeSleep &&
    data.daytime.muscleJointPain &&
    data.daytime.tirednessInterferes;

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Sleep Health Assessment Report</Text>
          <Text style={styles.subtitle}>Generated on {new Date().toLocaleDateString()}</Text>
        </View>

        {/* Thank you message */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Thank you for completing the SomnaHealth comprehensive sleep questionnaire. With more
            than 4 decades of collective experience, our team created this questionnaire and
            personalized report to provide you with guidance on improving your sleep health.
          </Text>
        </View>

        {/* Critical Safety Warning for Severe Tiredness */}
        {hasSevereTiredness && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              <Text style={{ fontWeight: 'bold' }}>URGENT SAFETY WARNING</Text>
              {'\n\n'}
              Your reported tiredness severity ({data.daytime.tirednessSeverity}/10) indicates a
              significant safety concern. You should seek immediate help from a healthcare
              professional. Until you have done so, please avoid potentially dangerous activities
              such as driving, biking, or jobs involving high-risk activities (construction, heavy
              equipment operation).{'\n\n'}
              The good news is that there are many fast-acting and safe treatments for excessive
              daytime sleepiness. Please consult a healthcare provider as soon as possible.
            </Text>
          </View>
        )}

        {/* Personalized Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dear {userName},</Text>
          <Text style={styles.paragraph}>
            On average you sleep {metrics.scheduledTST.toFixed(1)} hours on weekdays and{' '}
            {metrics.unscheduledTST.toFixed(1)} hours on weekends. The time it takes you to fall
            asleep is{' '}
            {metrics.scheduledSOL > 30
              ? 'prolonged'
              : metrics.scheduledSOL < 15
                ? 'short'
                : 'normal'}
            ({metrics.scheduledSOL} minutes). You wake approximately{' '}
            {data.scheduledSleep.nightWakeups} times a night and are awake for{' '}
            {metrics.scheduledWASO} minutes on average, which is{' '}
            {metrics.scheduledWASO > 40 ? 'prolonged' : 'normal'}.
          </Text>

          <Text style={styles.paragraph}>
            Your sleep efficiency, a measure of sleep quality, is {metrics.scheduledSE.toFixed(0)}%
            on weekdays and {metrics.unscheduledSE.toFixed(0)}% on weekends, which is{' '}
            {metrics.scheduledSE >= 85
              ? 'in the normal range (≥85%)'
              : 'low (<85%), indicating room for improvement'}
            . Your sleep{' '}
            {metrics.sleepVariability > 2 ? 'varies significantly' : 'varies very little'} between
            weekdays and weekends. Based on your sleep schedule, you appear to be{' '}
            {chronotype === 'evening (night owl)' ? 'an' : 'a'} {chronotype} chronotype.
          </Text>

          <Text style={styles.paragraph}>
            During the day, you have{' '}
            {hasEDS ? 'significant' : data.daytime.tirednessInterferes ? 'moderate' : 'minimal'}{' '}
            daytime sleepiness, and your daytime tiredness is{' '}
            {data.daytime.tirednessInterferes
              ? 'a problem that interferes with daily activities'
              : 'not a significant problem'}
            . Based on your responses, your sleep hygiene{' '}
            {hasPoorHygiene
              ? 'could improve and may contribute to sleep challenges'
              : 'is generally good'}
            .
          </Text>
        </View>

        {/* Sleep Metrics Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sleep Metrics Summary</Text>

          <View style={styles.grid}>
            <View style={styles.gridColumn}>
              <Text style={styles.subsectionTitle}>Work/School Days</Text>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Average Sleep Duration:</Text>
                <Text style={styles.metricValue}>{metrics.scheduledTST.toFixed(1)} hours</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Sleep Efficiency:</Text>
                <Text style={styles.metricValue}>{metrics.scheduledSE.toFixed(0)}%</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Time to Fall Asleep:</Text>
                <Text style={styles.metricValue}>{metrics.scheduledSOL} minutes</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Time Awake at Night:</Text>
                <Text style={styles.metricValue}>{metrics.scheduledWASO} minutes</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Night Awakenings:</Text>
                <Text style={styles.metricValue}>{data.scheduledSleep.nightWakeups} times</Text>
              </View>
            </View>

            <View style={styles.gridColumn}>
              <Text style={styles.subsectionTitle}>Weekends/Free Days</Text>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Average Sleep Duration:</Text>
                <Text style={styles.metricValue}>{metrics.unscheduledTST.toFixed(1)} hours</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Sleep Efficiency:</Text>
                <Text style={styles.metricValue}>{metrics.unscheduledSE.toFixed(0)}%</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Time to Fall Asleep:</Text>
                <Text style={styles.metricValue}>{metrics.unscheduledSOL} minutes</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Time Awake at Night:</Text>
                <Text style={styles.metricValue}>{metrics.unscheduledWASO} minutes</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Night Awakenings:</Text>
                <Text style={styles.metricValue}>{data.unscheduledSleep.nightWakeups} times</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Lifestyle Factors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lifestyle & Sleep Hygiene Assessment</Text>
          <View style={styles.bulletPoint}>
            <Text>
              • Caffeine intake: {data.lifestyle.caffeinePerDay} cups/day, last consumed at{' '}
              {data.lifestyle.lastCaffeineTime || 'N/A'}
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text>
              • Alcohol consumption:{' '}
              {data.lifestyle.alcoholPerWeek.wine + data.lifestyle.alcoholPerWeek.cocktails}{' '}
              drinks/week
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text>
              • Exercise: {data.lifestyle.exerciseDaysPerWeek} days/week for{' '}
              {data.lifestyle.exerciseDuration || 0} minutes
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text>
              • Daytime naps: {data.daytime.plannedNaps.daysPerWeek} days/week
              {data.daytime.plannedNaps.duration
                ? ` for ${data.daytime.plannedNaps.duration} minutes`
                : ''}
            </Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text>
              • Bedroom environment - Comfort: {data.bedroom.comfortable}/10, Dark:{' '}
              {data.bedroom.dark}/10, Quiet: {data.bedroom.quiet}/10
            </Text>
          </View>
        </View>

        <Text style={styles.pageNumber}>Page 1 of 2</Text>
      </Page>

      <Page size='A4' style={styles.page}>
        {/* Identified Issues */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identified Sleep Issues</Text>

          {hasInsomnia && !hasCOMISA && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                You have symptoms of {insomniaSeverity} insomnia. Insomnia is defined as difficulty
                falling asleep and/or staying asleep associated with daytime tiredness. Your
                symptoms include difficulty
                {metrics.scheduledSOL > 30 ? ' falling asleep (>30 minutes)' : ''}
                {metrics.scheduledSOL > 30 && metrics.scheduledWASO > 40 ? ' and' : ''}
                {metrics.scheduledWASO > 40 ? ' staying asleep (>40 minutes awake at night)' : ''}.
              </Text>
            </View>
          )}

          {hasOSA && !hasCOMISA && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                You have symptoms suggestive of sleep-disordered breathing (possible sleep apnea).
                {data.breathingDisorders.stopsBreathing
                  ? ' You report stopping breathing during sleep.'
                  : ''}
                {data.breathingDisorders.snores ? ' You snore.' : ''}
                {data.breathingDisorders.wakesWithDryMouth ? ' You wake with a dry mouth.' : ''}
                This requires medical evaluation.
              </Text>
            </View>
          )}

          {hasCOMISA && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                <Text style={{ fontWeight: 'bold' }}>
                  COMISA (Comorbid Insomnia and Sleep Apnea)
                </Text>
                {'\n\n'}
                You show signs of both insomnia and sleep apnea occurring together. This combination
                affects 30-50% of people with either disorder and requires coordinated treatment of
                both conditions.
                {'\n\n'}
                Treatment for COMISA should include:{'\n'}• A comprehensive sleep study to assess
                severity{'\n'}• Combined therapy: CBT-I plus CPAP treatment{'\n'}• Avoidance of
                sedative sleep medications{'\n'}• Weight management (if applicable){'\n'}•
                Consistent sleep schedules
              </Text>
            </View>
          )}

          {hasRLS && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                You have symptoms consistent with Restless Legs Syndrome (RLS), including an urge to
                move your legs at night, difficulty lying still, and relief with movement. This
                condition can significantly impact sleep quality and should be evaluated by a
                healthcare provider.
              </Text>
            </View>
          )}

          {hasNightmares && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                Frequent nightmares ({data.nightmares.nightmaresPerWeek}+ nights/week) can be
                distressing and associated with stress, trauma, and mood disturbance.
                {data.nightmares.associatedWithTrauma
                  ? ' Your nightmares are associated with trauma/PTSD, which requires specialized treatment.'
                  : ''}
              </Text>
            </View>
          )}

          {hasAnxiety && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                Anxiety and worries are affecting your sleep. You report that worries about the next
                day contribute to difficulty falling asleep and/or persistent rumination while in
                bed. This anxiety-sleep cycle needs to be addressed for better sleep quality.
              </Text>
            </View>
          )}

          {hasInsufficientSleep && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                <Text style={{ fontWeight: 'bold' }}>Insufficient Sleep Syndrome</Text>
                {'\n\n'}
                Your average sleep time of {avgWeeklySleep.toFixed(1)} hours is below the
                recommended 7+ hours. Combined with your daytime sleepiness, this suggests you are
                not getting enough sleep to meet your body&apos;s needs. Most adults need 7-9 hours
                for optimal health and functioning.
              </Text>
            </View>
          )}

          {hasChronicFatigueSymptoms && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                <Text style={{ fontWeight: 'bold' }}>
                  Possible Chronic Fatigue / Fibromyalgia Symptoms
                </Text>
                {'\n\n'}
                You report non-restorative sleep, muscle/joint pain, and daytime tiredness that
                interferes with activities. These symptoms may be associated with fibromyalgia,
                chronic fatigue syndrome, post-viral illness (e.g., long COVID), or Lyme disease.
                Please discuss these symptoms with your primary care doctor who may refer you to a
                rheumatologist or other specialist.
              </Text>
            </View>
          )}

          {!hasInsomnia &&
            !hasOSA &&
            !hasCOMISA &&
            !hasRLS &&
            !hasNightmares &&
            !hasAnxiety &&
            !hasInsufficientSleep &&
            !hasChronicFatigueSymptoms && (
              <Text style={styles.text}>
                No major sleep disorders were identified based on your responses. However, there may
                still be opportunities to optimize your sleep quality.
              </Text>
            )}
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personalized Recommendations</Text>

          {hasInsomnia && (
            <View style={styles.recommendationBox}>
              <Text style={styles.recommendationText}>
                <Text style={{ fontWeight: 'bold' }}>For Insomnia:</Text>
              </Text>
              <Text style={styles.recommendationText}>
                • Maintain a consistent sleep schedule, even on weekends
              </Text>
              <Text style={styles.recommendationText}>
                • Create a relaxing bedtime routine 30-60 minutes before sleep
              </Text>
              <Text style={styles.recommendationText}>
                • Avoid screens and bright lights 1 hour before bedtime
              </Text>
              <Text style={styles.recommendationText}>
                • Consider Cognitive Behavioral Therapy for Insomnia (CBT-I)
              </Text>
            </View>
          )}

          {hasOSA && (
            <View style={styles.recommendationBox}>
              <Text style={styles.recommendationText}>
                <Text style={{ fontWeight: 'bold' }}>For Sleep-Disordered Breathing:</Text>
              </Text>
              <Text style={styles.recommendationText}>
                • Schedule an appointment with a sleep specialist immediately
              </Text>
              <Text style={styles.recommendationText}>
                • Consider a sleep study to diagnose sleep apnea
              </Text>
              <Text style={styles.recommendationText}>
                • Avoid sleeping on your back; try side sleeping
              </Text>
              <Text style={styles.recommendationText}>
                • Maintain a healthy weight if BMI is elevated
              </Text>
            </View>
          )}

          {data.lifestyle.caffeinePerDay > 2 && (
            <View style={styles.recommendationBox}>
              <Text style={styles.recommendationText}>
                <Text style={{ fontWeight: 'bold' }}>For Caffeine Management:</Text>
              </Text>
              <Text style={styles.recommendationText}>
                • Reduce caffeine intake to 2 cups per day maximum
              </Text>
              <Text style={styles.recommendationText}>• Avoid caffeine after 2 PM</Text>
              <Text style={styles.recommendationText}>
                • Consider switching to decaf or herbal teas in the afternoon
              </Text>
            </View>
          )}

          {data.lifestyle.exerciseDaysPerWeek < 3 && (
            <View style={styles.recommendationBox}>
              <Text style={styles.recommendationText}>
                <Text style={{ fontWeight: 'bold' }}>For Physical Activity:</Text>
              </Text>
              <Text style={styles.recommendationText}>
                • Increase exercise to at least 3-5 days per week
              </Text>
              <Text style={styles.recommendationText}>
                • Aim for 30 minutes of moderate activity daily
              </Text>
              <Text style={styles.recommendationText}>
                • Complete exercise at least 3 hours before bedtime
              </Text>
            </View>
          )}

          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationText}>
              <Text style={{ fontWeight: 'bold' }}>General Sleep Hygiene:</Text>
            </Text>
            <Text style={styles.recommendationText}>
              • Keep bedroom cool (65-68°F), dark, and quiet
            </Text>
            <Text style={styles.recommendationText}>
              • Use your bed only for sleep and intimacy
            </Text>
            <Text style={styles.recommendationText}>
              • Avoid large meals 2-3 hours before bedtime
            </Text>
            <Text style={styles.recommendationText}>
              • Limit alcohol consumption, especially near bedtime
            </Text>
          </View>
        </View>

        {/* Resources Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources &amp; Next Steps</Text>

          <View style={styles.resourceBox}>
            <Text style={styles.resourceTitle}>Find a Sleep Specialist</Text>
            <Text style={styles.text}>• AASM Sleep Centers: </Text>
            <Link src='https://aasm.org/clinical-resources/patient-info/' style={styles.link}>
              aasm.org/clinical-resources/patient-info/
            </Link>
            <Text style={styles.text}>• ABSM Certified Specialists: </Text>
            <Link src='https://www.absm.org/diplomates-directory/' style={styles.link}>
              absm.org/diplomates-directory/
            </Link>
          </View>

          <View style={styles.resourceBox}>
            <Text style={styles.resourceTitle}>Behavioral Sleep Medicine</Text>
            <Text style={styles.text}>• SBSM Provider Directory: </Text>
            <Link
              src='https://www.behavioralsleep.org/index.php/society-of-behavioral-sleep-medicine-providers'
              style={styles.link}
            >
              behavioralsleep.org (CBT-I specialists)
            </Link>
          </View>

          <View style={styles.resourceBox}>
            <Text style={styles.resourceTitle}>Mental Health Resources</Text>
            <Text style={styles.text}>• APA Psychologist Locator: </Text>
            <Link src='https://locator.apa.org/' style={styles.link}>
              locator.apa.org
            </Link>
          </View>

          <View style={styles.resourceBox}>
            <Text style={styles.resourceTitle}>Educational Resources</Text>
            <Text style={styles.text}>• Sleep Education (AASM): </Text>
            <Link src='https://sleepeducation.org/' style={styles.link}>
              sleepeducation.org
            </Link>
            <Text style={styles.text}>• National Sleep Foundation: </Text>
            <Link src='https://www.sleepfoundation.org/' style={styles.link}>
              sleepfoundation.org
            </Link>
          </View>
        </View>

        {/* Important Note */}
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            <Text style={{ fontWeight: 'bold' }}>Important Medical Disclaimer:</Text>
            {'\n'}
            This report is for informational purposes only and does not constitute medical advice.
            Please consult with a healthcare professional for proper diagnosis and treatment of any
            sleep disorders. If you have been diagnosed with sleep disorders, continue following
            your healthcare provider&apos;s treatment plan.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © SomnaHealth Sleep Assessment | This report was generated based on your questionnaire
            responses | For medical emergencies, call 911
          </Text>
        </View>

        <Text style={styles.pageNumber}>Page 2 of 2</Text>
      </Page>
    </Document>
  );
}
