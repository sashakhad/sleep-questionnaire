import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { QuestionnaireFormData } from '@/validations/questionnaire'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
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
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  metric: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 11,
    color: '#4b5563',
    width: 200,
  },
  metricValue: {
    fontSize: 11,
    color: '#111827',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 1.5,
    marginBottom: 8,
  },
  warningBox: {
    backgroundColor: '#fef2f2',
    border: '1 solid #dc2626',
    padding: 10,
    marginVertical: 10,
  },
  warningText: {
    fontSize: 10,
    color: '#991b1b',
  },
  recommendationBox: {
    backgroundColor: '#f0f9ff',
    border: '1 solid #3b82f6',
    padding: 10,
    marginVertical: 10,
  },
  recommendationText: {
    fontSize: 10,
    color: '#1e40af',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '1 solid #e5e7eb',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 9,
    color: '#9ca3af',
    textAlign: 'center',
  },
})

interface ReportPDFProps {
  data: QuestionnaireFormData
  userName?: string
}

export function ReportPDF({ data, userName = 'Patient' }: ReportPDFProps) {
  // Calculate metrics (same logic as in ReportSection)
  const calculateSleepMetrics = () => {
    const scheduledBedtime = parseInt(data.scheduledSleep.lightsOutTime?.split(':')[0] ?? '0')
    const scheduledWaketime = parseInt(data.scheduledSleep.wakeupTime?.split(':')[0] ?? '0')
    const scheduledSleepDuration = scheduledWaketime > scheduledBedtime 
      ? scheduledWaketime - scheduledBedtime 
      : (24 - scheduledBedtime) + scheduledWaketime
    
    const weekdayEfficiency = ((scheduledSleepDuration * 60 - data.scheduledSleep.minutesToFallAsleep - data.scheduledSleep.minutesAwakeAtNight) / (scheduledSleepDuration * 60)) * 100
    
    return {
      weekdayTotalSleep: scheduledSleepDuration - (data.scheduledSleep.minutesToFallAsleep + data.scheduledSleep.minutesAwakeAtNight) / 60,
      weekdayEfficiency: Math.round(weekdayEfficiency),
      sleepOnsetLatency: data.scheduledSleep.minutesToFallAsleep,
      wakeAfterSleepOnset: data.scheduledSleep.minutesAwakeAtNight,
    }
  }

  const metrics = calculateSleepMetrics()
  const hasInsomnia = metrics.sleepOnsetLatency > 30 || metrics.wakeAfterSleepOnset > 40
  const hasSevereSymptoms = data.breathingDisorders.stopsBreathing || data.parasomnia.actsOutDreams

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Sleep Health Assessment Report</Text>
          <Text style={styles.subtitle}>Generated on {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dear {userName},</Text>
          <Text style={styles.text}>
            Thank you for completing the SomnaHealth comprehensive sleep questionnaire. 
            This personalized report provides guidance on improving your sleep health based on your responses.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sleep Metrics Summary</Text>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Average Sleep Duration (Weekdays):</Text>
            <Text style={styles.metricValue}>{metrics.weekdayTotalSleep.toFixed(1)} hours</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Sleep Efficiency:</Text>
            <Text style={styles.metricValue}>{metrics.weekdayEfficiency}%</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Time to Fall Asleep:</Text>
            <Text style={styles.metricValue}>{metrics.sleepOnsetLatency} minutes</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Time Awake During Night:</Text>
            <Text style={styles.metricValue}>{metrics.wakeAfterSleepOnset} minutes</Text>
          </View>
        </View>

        {hasInsomnia && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ Your responses indicate symptoms of insomnia. You have difficulty {metrics.sleepOnsetLatency > 30 ? 'falling asleep' : ''} 
              {metrics.sleepOnsetLatency > 30 && metrics.wakeAfterSleepOnset > 40 ? ' and ' : ''}
              {metrics.wakeAfterSleepOnset > 40 ? 'staying asleep' : ''}.
            </Text>
          </View>
        )}

        {hasSevereSymptoms && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ IMPORTANT: You reported symptoms that require medical evaluation. 
              Please consult with a sleep specialist or your primary care physician.
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationText}>
              • Maintain a consistent sleep schedule, even on weekends
            </Text>
            <Text style={styles.recommendationText}>
              • Create a relaxing bedtime routine 30-60 minutes before sleep
            </Text>
            <Text style={styles.recommendationText}>
              • Keep your bedroom cool, dark, and quiet
            </Text>
            {data.lifestyle.caffeinePerDay > 2 && (
              <Text style={styles.recommendationText}>
                • Consider reducing caffeine intake, especially after 2 PM
              </Text>
            )}
            {data.lifestyle.exerciseDaysPerWeek < 3 && (
              <Text style={styles.recommendationText}>
                • Increase physical activity to at least 3 days per week
              </Text>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This report is for informational purposes only and does not constitute medical advice.
            Please consult with a healthcare professional for proper diagnosis and treatment.
          </Text>
        </View>
      </Page>
    </Document>
  )
}
