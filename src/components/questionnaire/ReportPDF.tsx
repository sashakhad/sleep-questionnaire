import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { QuestionnaireFormData } from '@/validations/questionnaire';
import {
  calculateBMI,
  generateDiagnosisReport,
  generateFullReport,
} from '@/lib/diagnosis-algorithms';
import { getSelectedSleepMedicationLabels } from '@/lib/sleep-medication-labels';

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

export function ReportPDF({ data, userName = 'Patient' }: ReportPDFProps) {
  // Use the centralized diagnosis engine
  const report = generateDiagnosisReport(data);
  const fullReport = generateFullReport(data);
  const { sleepMetrics: metrics, insomnia, sleepApnea, eds, chronicFatigue, painRelated, medicationRelated, nightmares, treatmentEffectiveness } = report;
  const medicationLabels = getSelectedSleepMedicationLabels(data);
  const medicationList =
    medicationLabels.length > 0 ? medicationLabels.join(', ') : 'the medications you listed';
  const bmi = calculateBMI(data.demographics.height, data.demographics.weight);
  const hasUnderweight = bmi !== null && bmi < 18;
  const hasSleepDisorderedBreathing =
    sleepApnea.hasProbableSleepApnea || sleepApnea.hasMildRespiratoryDisturbance || report.hasCOMISA;

  // Determine severity descriptions for language
  const getSeverityText = (severity: string) => {
    if (severity === 'moderate-to-severe') {
      return 'moderate to severe';
    }
    return severity;
  };

  // Check for poor sleep hygiene
  const hasPoorHygiene =
    data.lifestyle.caffeinePerDay > 4 ||
    data.lifestyle.exerciseDaysPerWeek < 3 ||
    data.sleepHygiene.smokesNicotine ||
    (data.lifestyle.lastCaffeineTime &&
      parseInt(data.lifestyle.lastCaffeineTime.split(':')[0] ?? '0') >= 14);

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
            report to provide you with guidance on improving your sleep health.
          </Text>
        </View>

        {/* Critical Safety Warning for Severe Tiredness */}
        {report.hasSevereTiredness && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              <Text style={{ fontWeight: 'bold' }}>URGENT SAFETY WARNING</Text>
              {'\n\n'}
              Your reported sleepiness severity ({data.daytime.sleepinessSeverity}/10) indicates a
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
            {report.chronotype === 'evening (night owl)' ? 'an' : 'a'} {report.chronotype} chronotype.
          </Text>

          <Text style={styles.paragraph}>
            During the day, you have{' '}
            {eds.severity !== 'none' ? 'significant' : data.daytime.sleepinessInterferes ? 'moderate' : 'minimal'}{' '}
            daytime sleepiness, and your daytime sleepiness is{' '}
            {data.daytime.sleepinessInterferes
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

          <View style={styles.metric}>
            <Text style={styles.metricLabel}>24-Hour Average Sleep (incl. planned naps):</Text>
            <Text style={styles.metricValue}>
              {fullReport.metrics.avg24HourSleep.toFixed(1)} hours
            </Text>
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
              • Alcohol consumption: {data.lifestyle.alcoholPerWeek} drinks/week
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

        <Text style={styles.pageNumber}>Page 1 of 3</Text>
      </Page>

      <Page size='A4' style={styles.page}>
        {/* Identified Issues */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identified Sleep Issues</Text>

          {/* Excessive Daytime Sleepiness (with adequate sleep) */}
          {eds.severity !== 'none' && !report.insufficientSleep && metrics.weeklyAverageTST >= 7 && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                <Text style={{ fontWeight: 'bold' }}>Excessive Daytime Sleepiness</Text>
                {'\n\n'}
                You have symptoms of daytime sleepiness that appear to be impacting functioning during
                the day. These symptoms may be associated with narcolepsy, idiopathic hypersomnia, or
                another sleep disorder.
                {hasSleepDisorderedBreathing &&
                  '\n\nIt is common for people with a disorder of excessive daytime sleepiness to also have sleep-disordered breathing or obstructive sleep apnea syndrome.'}
                {'\n\n'}We strongly recommend follow-up for diagnosis and possible treatment.
              </Text>
            </View>
          )}

          {report.hasNarcolepsy && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                <Text style={{ fontWeight: 'bold' }}>Symptoms of Narcolepsy or Idiopathic Hypersomnia</Text>
                {'\n\n'}
                Your responses suggest possible narcolepsy or idiopathic hypersomnia. These are
                treatable sleep disorders that can significantly impact daytime functioning and
                safety. A consultation with a sleep specialist is strongly recommended.
              </Text>
            </View>
          )}

          {/* Insufficient Sleep Syndrome */}
          {report.insufficientSleep && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                <Text style={{ fontWeight: 'bold' }}>Insufficient Sleep Syndrome</Text>
                {'\n\n'}
                Your average sleep time of {metrics.weeklyAverageTST.toFixed(1)} hours is below the
                recommended 7+ hours. Combined with your daytime sleepiness, this suggests you are not
                getting enough sleep to meet your body&apos;s needs. You reported symptoms of excessive
                daytime sleepiness that are likely due to this and/or other sleep disorders. Please
                see the video on our website that provides guidance on optimal sleep duration.
              </Text>
            </View>
          )}

          {/* Insomnia */}
          {insomnia.hasInsomnia && !report.hasCOMISA && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                <Text style={{ fontWeight: 'bold' }}>
                  Insomnia Symptoms ({getSeverityText(insomnia.severity)})
                </Text>
                {'\n\n'}
                {fullReport.insomniaLikelyCircadian
                  ? 'Based on your response, you have some symptoms of insomnia, but are most likely struggling with DSPD.'
                  : fullReport.insomniaLikelyRLS
                    ? 'You report insomnia symptoms, but your restless legs symptoms may be a primary driver of difficulty falling asleep. RLS should be considered a preliminary assessment and treatment priority.'
                    : fullReport.insomniaPrimaryOverDSPD
                      ? `You have symptoms of insomnia that could be in the ${getSeverityText(insomnia.severity)} range. Based on your responses, you have some symptoms of DSPD but are more likely struggling with insomnia. We strongly recommend follow-up for a diagnosis and possible treatment.`
                      : `You have symptoms of insomnia that could be in the ${getSeverityText(insomnia.severity)} range. We strongly recommend follow-up for a diagnosis and possible treatment.`}
                {'\n\n'}
                Your symptoms include:
                {insomnia.hasSleepOnsetInsomnia && '\n• Difficulty falling asleep (>30 minutes)'}
                {insomnia.hasMaintenanceInsomnia && '\n• Difficulty staying asleep (>40 minutes awake at night)'}
                {data.daytime.nonRestorativeSleep && '\n• Non-restorative sleep'}
                {data.daytime.sleepinessInterferes && '\n• Daytime sleepiness that interferes with activities'}
              </Text>
            </View>
          )}

          {/* Sleep Apnea - Snoring/Mouth Breathing Only */}
          {sleepApnea.hasMildRespiratoryDisturbance && !sleepApnea.hasProbableSleepApnea && !report.hasCOMISA && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                <Text style={{ fontWeight: 'bold' }}>Mild Respiratory Disturbance</Text>
                {'\n\n'}
                You have at least mild symptoms of sleep-related respiratory disturbance that may
                require more assessment. Both snoring and mouth breathing alone or together cause
                sleep disruption and may place a burden on your cardiovascular and respiratory system.
                Please see the link on our website for more detailed information and discuss your
                symptoms with your medical provider or a sleep specialist.
              </Text>
            </View>
          )}

          {/* Sleep Apnea - Probable */}
          {sleepApnea.hasProbableSleepApnea && !report.hasCOMISA && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                <Text style={{ fontWeight: 'bold' }}>
                  Probable Obstructive Sleep Apnea ({getSeverityText(sleepApnea.severity)})
                </Text>
                {'\n\n'}
                You have symptoms of obstructive sleep apnea syndrome that could be in the{' '}
                {getSeverityText(sleepApnea.severity)} range. We strongly recommend follow-up for a
                diagnosis and possible treatment.
                {data.breathingDisorders.stopsBreathing &&
                  '\n\nYou report pauses, gaps in breathing, or struggling to breathe during sleep.'}
                {data.breathingDisorders.snores && '\n• You snore.'}
                {data.breathingDisorders.wakesWithDryMouth && '\n• You wake with a dry mouth.'}
              </Text>
            </View>
          )}

          {/* COMISA */}
          {report.hasCOMISA && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                <Text style={{ fontWeight: 'bold' }}>
                  COMISA (Comorbid Insomnia and Sleep Apnea)
                </Text>
                {'\n\n'}
                Your symptoms suggest COMISA (Comorbid Insomnia and Sleep Apnea), which means that
                you have symptoms of both insomnia and sleep-disordered breathing. COMISA requires
                coordinated treatment of both conditions. You can tell your primary care doctor or a
                sleep doctor that you are concerned that you have signs of sleep-disordered breathing
                and want to know options for assessment and diagnosis. Visit our website for detailed
                information on comprehensive evaluation and treatment approaches.
              </Text>
            </View>
          )}

          {/* RLS */}
          {report.hasRLS && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                You have symptoms consistent with Restless Legs Syndrome (RLS), including an urge to
                move your legs at night, difficulty lying still, and relief with movement. This
                condition can significantly impact sleep quality and should be evaluated by a
                healthcare provider. We strongly recommend follow-up for a diagnosis and possible treatment.
              </Text>
            </View>
          )}

          {/* Leg Cramps */}
          {report.hasLegCrampsConcern && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                <Text style={{ fontWeight: 'bold' }}>Nocturnal Leg Cramps</Text>
                {'\n\n'}
                Your nocturnal leg cramps can be sleep disruptors and can be a sign of age, muscle
                fatigue, an electrolyte or other imbalance. They can be more common during pregnancy.
                Since these occur on three or more nights a week, we suggest that you discuss these symptoms with your
                primary care provider.
              </Text>
            </View>
          )}

          {/* Nightmares */}
          {nightmares.hasNightmareDisorder && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                <Text style={{ fontWeight: 'bold' }}>Nightmare Disorder</Text>
                {'\n\n'}
                You endorsed symptoms of a nightmare parasomnia/disorder ({nightmares.nightmaresPerWeek}+
                nights/week). This can be a sign of a history of trauma, a mental health disorder, and
                can be caused by some medications. Please see the section on our website that has more
                information on nightmares.
                {data.nightmares.associatedWithTrauma &&
                  '\n\nYour nightmares are associated with trauma/PTSD, which requires specialized treatment.'}
              </Text>
            </View>
          )}

          {/* Bad Dreams */}
          {nightmares.hasBadDreamWarning && !nightmares.hasNightmareDisorder && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                <Text style={{ fontWeight: 'bold' }}>Frequent Bad Dreams</Text>
                {'\n\n'}
                You endorsed symptoms of having frequent bad dreams ({nightmares.badDreamsPerWeek}+
                nights/week). This can be a sign of a history of trauma, a mental health disorder, and
                can be caused by some medications. Please see the section on our website that has more
                information on dreams and nightmares.
              </Text>
            </View>
          )}

          {/* Anxiety affecting sleep */}
          {report.hasAnxiety && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                Anxiety and worries are affecting your sleep. You report that worries about the next
                day contribute to difficulty falling asleep and/or persistent rumination while in
                bed. This anxiety-sleep cycle needs to be addressed for better sleep quality.
              </Text>
            </View>
          )}

          {fullReport.chronotypeType === 'delayed' && !fullReport.insomniaPrimaryOverDSPD && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                <Text style={{ fontWeight: 'bold' }}>Symptoms of Delayed Sleep Phase Disorder</Text>
                {'\n\n'}
                Your natural sleep timing is later than desired and may be contributing to decreased
                total sleep time or daytime impairment. Visit our website for information on light
                therapy, melatonin, and other strategies to shift your sleep schedule.
              </Text>
            </View>
          )}

          {hasUnderweight && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                <Text style={{ fontWeight: 'bold' }}>Low BMI</Text>
                {'\n\n'}
                Your low BMI is suggestive of being underweight. While difficult to discuss, we
                strongly recommend that you talk to your doctor about low BMI and symptoms of eating
                disorders.
              </Text>
            </View>
          )}

          {/* Chronic Fatigue / Fibromyalgia */}
          {chronicFatigue.hasSymptoms && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                <Text style={{ fontWeight: 'bold' }}>
                  Possible Chronic Fatigue / Fibromyalgia Symptoms
                </Text>
                {'\n\n'}
                Chronic fatigue syndrome and fibromyalgia are difficult to diagnose disorders that
                involve a combination of non-restorative sleep, pain, and fatigue. These symptoms may
                be associated with fibromyalgia, chronic fatigue syndrome, post-viral illness, or Lyme
                disease. Please discuss these symptoms with your primary care doctor who may refer you
                to a sleep specialist, neurologist, rheumatologist, or other specialist.
              </Text>
            </View>
          )}

          {/* Pain-Related Sleep Disturbance */}
          {painRelated.hasCondition && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                <Text style={{ fontWeight: 'bold' }}>Pain-Related Sleep Disturbance</Text>
                {'\n\n'}
                It is very common for those who experience acute or chronic pain to have poor sleep
                quality, and there is a bidirectional relationship between inadequate sleep and pain
                during the night and day. Addressing your sleep problems and adequate treatment of
                your pain is important. Please refer to the links on our website for more information
                on this important relationship and discuss this finding with your primary medical provider.
              </Text>
            </View>
          )}

          {/* Medication-Related Sleep Disturbance */}
          {medicationRelated.hasCondition && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                <Text style={{ fontWeight: 'bold' }}>Medication-Related Sleep Disturbance</Text>
                {'\n\n'}
                Your medications ({medicationList}) may be contributing to your sleep difficulties.
                Please check out the links on our website for more information and discuss the impact
                of your medications on your sleep with your primary care provider. Do not discontinue
                any medications without consulting your prescribing provider.
              </Text>
            </View>
          )}

          {/* Treatment Effectiveness Warnings */}
          {treatmentEffectiveness.osaTreatmentIneffective && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                <Text style={{ fontWeight: 'bold' }}>Sleep Apnea Treatment Review Needed</Text>
                {'\n\n'}
                You indicated that despite being treated for sleep apnea, you are still having
                symptoms. Please see the section on our website related to sleep apnea and discuss
                this with your primary care provider. You may benefit from a consultation with a
                sleep specialist.
              </Text>
            </View>
          )}

          {treatmentEffectiveness.rlsTreatmentIneffective && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                <Text style={{ fontWeight: 'bold' }}>RLS Treatment Review Needed</Text>
                {'\n\n'}
                You indicated that despite being treated for restless legs syndrome, you are still
                having symptoms. Please see the section on our website related to RLS and discuss
                this with your primary care provider. You may benefit from a consultation with a
                sleep specialist.
              </Text>
            </View>
          )}

          {/* No major issues found */}
          {fullReport.isHealthySleeper && (
              <Text style={styles.text}>
                No major sleep disorders were identified based on your responses. However, there may
                still be opportunities to optimize your sleep quality.
              </Text>
            )}
        </View>

        <Text style={styles.pageNumber}>Page 2 of 3</Text>
      </Page>

      <Page size='A4' style={styles.page}>
        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations</Text>

          {insomnia.hasInsomnia && (
            <View style={styles.recommendationBox}>
              <Text style={styles.recommendationText}>
                <Text style={{ fontWeight: 'bold' }}>For Your Insomnia Symptoms:</Text>
              </Text>
              <Text style={styles.recommendationText}>
                {fullReport.insomniaLikelyCircadian
                  ? 'Your insomnia symptoms may be due to a circadian rhythm disorder. A sleep specialist can help assess whether shifting your sleep schedule should be the first treatment priority.'
                  : fullReport.insomniaLikelyRLS
                    ? 'Your insomnia symptoms may be related to probable restless legs syndrome. Assessment and treatment of RLS may be the first treatment priority.'
                    : 'Based on your responses, we recommend exploring treatment options for insomnia. Insomnia is a common sleep disorder that involves difficulty falling asleep, staying asleep, or poor sleep quality that is associated with daytime impairment. The most effective treatment for insomnia is Cognitive Behavior Therapy for Insomnia (CBT-I). Please visit our website for detailed information on CBT-I and other strategies.'}
              </Text>
            </View>
          )}

          {(sleepApnea.hasProbableSleepApnea || sleepApnea.hasMildRespiratoryDisturbance) && (
            <View style={styles.recommendationBox}>
              <Text style={styles.recommendationText}>
                <Text style={{ fontWeight: 'bold' }}>For Sleep-Disordered Breathing:</Text>
              </Text>
              <Text style={styles.recommendationText}>
                • Schedule an appointment with a sleep specialist
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

          {fullReport.chronotypeType === 'delayed' && !fullReport.insomniaPrimaryOverDSPD && (
            <View style={styles.recommendationBox}>
              <Text style={styles.recommendationText}>
                <Text style={{ fontWeight: 'bold' }}>For Delayed Sleep Phase Symptoms:</Text>
              </Text>
              <Text style={styles.recommendationText}>
                Your natural sleep timing is later than desired
                {report.insufficientSleep ? ' and this is resulting in decreased total sleep time' : ''}.
                Visit our website for information on light therapy, melatonin, and other strategies
                to shift your sleep schedule.
              </Text>
            </View>
          )}

          {report.hasNarcolepsy &&
            data.mentalHealth.diagnosedMentalHealthConditions.some(condition =>
              ['adhd', 'depression'].includes(condition)
            ) && (
              <View style={styles.recommendationBox}>
                <Text style={styles.recommendationText}>
                  <Text style={{ fontWeight: 'bold' }}>For Hypersomnia, ADHD, or Depression:</Text>
                </Text>
                <Text style={styles.recommendationText}>
                  Your symptoms of excessive daytime sleepiness suggest a disorder of hypersomnia,
                  and it is common for these disorders to be misdiagnosed as depression or ADHD.
                  Please discuss this with your prescribing doctor and visit our website for more
                  information.
                </Text>
              </View>
            )}

          {data.lifestyle.caffeinePerDay > 2 && (
            <View style={styles.recommendationBox}>
              <Text style={styles.recommendationText}>
                <Text style={{ fontWeight: 'bold' }}>For Caffeine Management:</Text>
              </Text>
              <Text style={styles.recommendationText}>
                • Consider reducing caffeine intake, especially if you consume more than 4 servings per day
              </Text>
              <Text style={styles.recommendationText}>• Eliminate caffeine at least 10 hours before bedtime</Text>
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
                • Discuss increased exercise with your primary care doctor
              </Text>
            </View>
          )}

          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationText}>
              <Text style={{ fontWeight: 'bold' }}>General Sleep Hygiene:</Text>
            </Text>
            <Text style={styles.recommendationText}>
              • Make bedroom changes that support sleep, including comfort, less light, and less noise
            </Text>
            <Text style={styles.recommendationText}>
              • Establish a bedtime ritual
            </Text>
            <Text style={styles.recommendationText}>
              • Discontinue eating more than 2 hours before getting into bed
            </Text>
            <Text style={styles.recommendationText}>
              • Discontinue rigorous exercise more than 1.5 hours before getting into bed
            </Text>
            <Text style={styles.recommendationText}>
              • Establish a regular bedtime that varies no more than 30 minutes on weeknights and one hour between scheduled and unscheduled nights
            </Text>
            <Text style={styles.recommendationText}>
              • Decrease naps to no more than 20 minutes a day
            </Text>
            {data.sleepHygiene.smokesNicotine && (
              <Text style={styles.recommendationText}>
                • Tobacco and nicotine can cause sleep disruption and significant health risks. Discuss strategies to discontinue use with your primary care doctor.
              </Text>
            )}
            {hasUnderweight && (
              <Text style={styles.recommendationText}>
                • Talk to your doctor about low BMI and symptoms of eating disorders.
              </Text>
            )}
            <Text style={styles.recommendationText}>
              Visit our website for comprehensive information on adjusting sleep hygiene to improve your sleep health and sleep quality.
            </Text>
          </View>

          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationText}>
              <Text style={{ fontWeight: 'bold' }}>Sleep Health Recommendations:</Text>
            </Text>
            <Text style={styles.recommendationText}>
              {fullReport.isHealthySleeper
                ? 'We are impressed with your general sleep health. We have not identified any sleep disorders or domains in which you need guidance on your sleep health. We still encourage you to go to these links on our website to learn basics about maintaining exceptional sleep health that you can share with friends and family. Much of this information is captured in our Seven Sleep Health Principles (website link). We can guarantee that you will find much of this information both novel and fascinating.'
                : 'We have identified symptoms of a sleep disorder and some areas in which you can improve your sleep. Much of this information is captured in our Seven Sleep Health Principles (website link). We can guarantee that you will find much of this information both novel and fascinating.'}
            </Text>
            {fullReport.hasInsufficientSleepSigns && !fullReport.hasInsufficientSleep && (
              <>
                <Text style={styles.recommendationText}>
                  <Text style={{ fontWeight: 'bold' }}>Signs of Insufficient Sleep:</Text>
                </Text>
                <Text style={styles.recommendationText}>
                  Optimal sleep is more than 6.5 hours and when sleep is less than 8 hours a night
                  and there are signs of daytime tiredness and attention problems it is optimal to
                  increase total sleep time. There are individual differences in sleep need and it is
                  important to know and follow your needs. You can try increasing your sleep time for
                  a week and observe the quality of your sleep and changes in your daytime
                  functioning. Please go to our website for more information on determining optimal
                  sleep duration for you.
                </Text>
              </>
            )}
            {fullReport.hasSleepTimingVariability && (
              <>
                <Text style={styles.recommendationText}>
                  <Text style={{ fontWeight: 'bold' }}>Sleep Timing Variability:</Text>
                </Text>
                <Text style={styles.recommendationText}>
                  Regular timing of your sleep schedule is even more important than optimal sleep
                  duration. Your schedule suggests that there is a moderate to high level of
                  variability in your sleep timing. You can try a more regular sleep schedule for a
                  week and see how you feel. Please go to our website for more information on
                  optimizing your sleep timing based on your natural preference, called chronotype
                  and general sleep habits.
                </Text>
              </>
            )}
            <Text style={styles.recommendationText}>
              <Text style={{ fontWeight: 'bold' }}>Your Chronotype:</Text>
            </Text>
            <Text style={styles.recommendationText}>
              Based on your schedule you appear to be {fullReport.chronotypeLabel}. Whatever type you
              fall into, it is always important to strive for a regular sleep schedule with less than
              30 minutes change night-to-night on weekdays and less than one hour on weekends. When
              your weeknight sleep time differs from your weekend sleep time you have social jetlag.
              More information on healthy sleep timing, chronotypes and circadian rhythms are on our
              website.
            </Text>
          </View>
        </View>

        {/* Resources Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>

          <View style={styles.resourceBox}>
            <Text style={styles.resourceTitle}>SomnaHealth Services</Text>
            <Text style={styles.text}>
              Our team offers sleep education that addresses the specific problems identified in this
              report. We also have sleep coaches and a board-certified sleep doctor who can support
              you with evidence-based treatments including CBT-I and consultation regarding the best
              treatment approaches. Visit our website for more information about how we can help you
              achieve better sleep. You can also find board-certified sleep specialists near where you
              live.
            </Text>
          </View>
        </View>

        {/* Important Note */}
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            <Text style={{ fontWeight: 'bold' }}>Important Medical Disclaimer:</Text>
            {'\n'}
            This report is for informational purposes only and does not constitute medical advice or
            a diagnosis. Please consult with a healthcare professional for proper diagnosis and
            treatment of any sleep disorders. If you have been diagnosed with sleep disorders,
            continue following your healthcare provider&apos;s treatment plan.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © SomnaHealth Sleep Assessment | This report was generated based on your questionnaire
            responses | For medical emergencies, call 911
          </Text>
        </View>

        <Text style={styles.pageNumber}>Page 3 of 3</Text>
      </Page>
    </Document>
  );
}
