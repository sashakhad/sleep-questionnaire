import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { QuestionnaireFormData } from '@/validations/questionnaire'

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
})

interface ReportPDFProps {
  data: QuestionnaireFormData
  userName?: string
}

// Helper function to calculate sleep metrics
function calculateSleepMetrics(data: QuestionnaireFormData) {
  // Scheduled/work days calculations
  const scheduledBedtime = parseInt(data.scheduledSleep.lightsOutTime?.split(':')[0] ?? '22')
  const scheduledWaketime = parseInt(data.scheduledSleep.wakeupTime?.split(':')[0] ?? '7')
  let scheduledTimeInBed = scheduledWaketime - scheduledBedtime
  if (scheduledTimeInBed < 0) {
    scheduledTimeInBed += 24
  }
  
  const scheduledSOL = data.scheduledSleep.minutesToFallAsleep
  const scheduledWASO = data.scheduledSleep.minutesAwakeAtNight
  const scheduledTST = (scheduledTimeInBed * 60 - scheduledSOL - scheduledWASO) / 60
  const scheduledSE = ((scheduledTST / scheduledTimeInBed) * 100)
  
  // Unscheduled/weekend calculations
  const unscheduledBedtime = parseInt(data.unscheduledSleep.lightsOutTime?.split(':')[0] ?? '23')
  const unscheduledWaketime = parseInt(data.unscheduledSleep.wakeupTime?.split(':')[0] ?? '9')
  let unscheduledTimeInBed = unscheduledWaketime - unscheduledBedtime
  if (unscheduledTimeInBed < 0) {
    unscheduledTimeInBed += 24
  }
  
  const unscheduledSOL = data.unscheduledSleep.minutesToFallAsleep
  const unscheduledWASO = data.unscheduledSleep.minutesAwakeAtNight
  const unscheduledTST = (unscheduledTimeInBed * 60 - unscheduledSOL - unscheduledWASO) / 60
  const unscheduledSE = ((unscheduledTST / unscheduledTimeInBed) * 100)
  
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
  }
}

// Helper function to get insomnia severity
function getInsomniaSeverity(data: QuestionnaireFormData, metrics: ReturnType<typeof calculateSleepMetrics>) {
  if (metrics.scheduledSOL > 30 || metrics.scheduledWASO > 40) {
    if (data.daytime.tirednessInterferes) {
      return 'moderate to severe'
    }
    return 'mild'
  }
  return 'none'
}

// Helper function to determine chronotype
function getChronotype(data: QuestionnaireFormData, metrics: ReturnType<typeof calculateSleepMetrics>) {
  const scheduledBedtime = parseInt(data.scheduledSleep.lightsOutTime?.split(':')[0] ?? '22')
  const midSleepScheduled = scheduledBedtime + (metrics.scheduledTST / 2)
  
  if (data.chronotype.preference === 'late' || midSleepScheduled >= 4) {
    return 'evening (night owl)'
  } else if (data.chronotype.preference === 'early' || midSleepScheduled <= 1) {
    return 'morning (early bird)'
  }
  return 'flexible'
}

export function ReportPDF({ data, userName = 'Patient' }: ReportPDFProps) {
  const metrics = calculateSleepMetrics(data)
  const insomniaSeverity = getInsomniaSeverity(data, metrics)
  const chronotype = getChronotype(data, metrics)
  
  // Identify major issues
  const hasInsomnia = insomniaSeverity !== 'none'
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
  const hasAnxiety = data.mentalHealth.worriesAffectSleep || data.mentalHealth.anxietyInBed

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Sleep Health Assessment Report</Text>
          <Text style={styles.subtitle}>Generated on {new Date().toLocaleDateString()}</Text>
        </View>

        {/* Thank you message */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Thank you for completing the SomnaHealth comprehensive sleep questionnaire. With more than 
            4 decades of collective experience, our team created this questionnaire and personalized 
            report to provide you with guidance on improving your sleep health.
          </Text>
        </View>

        {/* Personalized Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dear {userName},</Text>
          <Text style={styles.paragraph}>
            On average you sleep {metrics.scheduledTST.toFixed(1)} hours on weekdays and {metrics.unscheduledTST.toFixed(1)} hours 
            on weekends. The time it takes you to fall asleep is {metrics.scheduledSOL > 30 ? 'prolonged' : metrics.scheduledSOL < 15 ? 'short' : 'normal'} 
            ({metrics.scheduledSOL} minutes). You wake approximately {data.scheduledSleep.nightWakeups} times a night and are 
            awake for {metrics.scheduledWASO} minutes on average, which is {metrics.scheduledWASO > 40 ? 'prolonged' : 'normal'}.
          </Text>
          
          <Text style={styles.paragraph}>
            Your sleep efficiency, a measure of sleep quality, is {metrics.scheduledSE.toFixed(0)}% on weekdays 
            and {metrics.unscheduledSE.toFixed(0)}% on weekends, which is {metrics.scheduledSE >= 85 ? 
            'in the normal range (≥85%)' : 'low (<85%), indicating room for improvement'}.
            Your sleep {metrics.sleepVariability > 2 ? 'varies significantly' : 'varies very little'} between 
            weekdays and weekends. Based on your sleep schedule, you appear to be {chronotype === 'evening (night owl)' ? 
            'an' : 'a'} {chronotype} chronotype.
          </Text>

          <Text style={styles.paragraph}>
            During the day, you have {hasEDS ? 'significant' : data.daytime.tirednessInterferes ? 'moderate' : 'minimal'} daytime 
            sleepiness, and your daytime tiredness is {data.daytime.tirednessInterferes ? 
            'a problem that interferes with daily activities' : 'not a significant problem'}.
            Based on your responses, your sleep hygiene {hasPoorHygiene ? 'could improve and may contribute to sleep challenges' : 
            'is generally good'}.
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
            <Text>• Caffeine intake: {data.lifestyle.caffeinePerDay} cups/day, 
            last consumed at {data.lifestyle.lastCaffeineTime || 'N/A'}</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text>• Alcohol consumption: {data.lifestyle.alcoholPerWeek.wine + data.lifestyle.alcoholPerWeek.cocktails} drinks/week</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text>• Exercise: {data.lifestyle.exerciseDaysPerWeek} days/week for {data.lifestyle.exerciseDuration || 0} minutes</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text>• Daytime naps: {data.daytime.plannedNaps.daysPerWeek} days/week 
            {data.daytime.plannedNaps.duration ? ` for ${data.daytime.plannedNaps.duration} minutes` : ''}</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text>• Bedroom environment - Comfort: {data.bedroom.comfortable}/10, 
            Dark: {data.bedroom.dark}/10, Quiet: {data.bedroom.quiet}/10</Text>
          </View>
        </View>

        <Text style={styles.pageNumber}>Page 1 of 2</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        {/* Identified Issues */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identified Sleep Issues</Text>
          
          {hasInsomnia && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                You have symptoms of {insomniaSeverity} insomnia. Insomnia is defined as difficulty falling asleep 
                and/or staying asleep associated with daytime tiredness. Your symptoms include difficulty 
                {metrics.scheduledSOL > 30 ? ' falling asleep (>30 minutes)' : ''}
                {metrics.scheduledSOL > 30 && metrics.scheduledWASO > 40 ? ' and' : ''}
                {metrics.scheduledWASO > 40 ? ' staying asleep (>40 minutes awake at night)' : ''}.
              </Text>
            </View>
          )}

          {hasOSA && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                You have symptoms suggestive of sleep-disordered breathing (possible sleep apnea). 
                {data.breathingDisorders.stopsBreathing ? ' You report stopping breathing during sleep.' : ''}
                {data.breathingDisorders.snores ? ' You snore.' : ''}
                {data.breathingDisorders.wakesWithDryMouth ? ' You wake with a dry mouth.' : ''}
                This requires medical evaluation.
              </Text>
            </View>
          )}

          {hasRLS && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                You have symptoms consistent with Restless Legs Syndrome (RLS), including an urge to move 
                your legs at night, difficulty lying still, and relief with movement. This condition can 
                significantly impact sleep quality and should be evaluated by a healthcare provider.
              </Text>
            </View>
          )}

          {hasNightmares && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                Frequent nightmares ({data.nightmares.nightmaresPerWeek}+ nights/week) can be distressing and 
                associated with stress, trauma, and mood disturbance. 
                {data.nightmares.associatedWithTrauma ? ' Your nightmares are associated with trauma/PTSD, which requires specialized treatment.' : ''}
              </Text>
            </View>
          )}

          {hasAnxiety && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                Anxiety and worries are affecting your sleep. You report that worries about the next day 
                contribute to difficulty falling asleep and/or persistent rumination while in bed. This 
                anxiety-sleep cycle needs to be addressed for better sleep quality.
              </Text>
            </View>
          )}

          {!hasInsomnia && !hasOSA && !hasRLS && !hasNightmares && !hasAnxiety && (
            <Text style={styles.text}>
              No major sleep disorders were identified based on your responses. However, there may still 
              be opportunities to optimize your sleep quality.
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
              <Text style={styles.recommendationText}>
                • Avoid caffeine after 2 PM
              </Text>
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

        {/* Important Note */}
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            <Text style={{ fontWeight: 'bold' }}>Important Medical Disclaimer:</Text>{'\n'}
            This report is for informational purposes only and does not constitute medical advice. 
            Please consult with a healthcare professional for proper diagnosis and treatment of any 
            sleep disorders. If you have been diagnosed with sleep disorders, continue following your 
            healthcare provider&apos;s treatment plan.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © SomnaHealth Sleep Assessment | This report was generated based on your questionnaire responses | 
            For medical emergencies, call 911
          </Text>
        </View>

        <Text style={styles.pageNumber}>Page 2 of 2</Text>
      </Page>
    </Document>
  )
}