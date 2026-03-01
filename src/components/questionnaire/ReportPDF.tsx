import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { QuestionnaireFormData } from '@/validations/questionnaire';
import { generateDiagnosisReport } from '@/lib/diagnosis-algorithms';

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
  const { sleepMetrics: metrics, insomnia, sleepApnea, eds, chronicFatigue, painRelated, medicationRelated, nightmares, treatmentEffectiveness } = report;

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
                the day. These symptoms may be associated with your possible sleep diagnosis, or if
                these symptoms have been present for more than a month, they may be a sign of an
                underlying sleep disorder, medication side effect (melatonin, a sleep medication, an
                antihistamine, blood pressure medication, heart medication, a psychiatric medication,
                or other), or other medical problems (hypertension, heart disease, cancer or cancer
                treatment, or other chronic medical conditions). We strongly recommend follow-up for
                diagnosis and possible treatment.
              </Text>
            </View>
          )}

          {/* Insufficient Sleep Syndrome */}
          {report.insufficientSleep && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                <Text style={{ fontWeight: 'bold' }}>Insufficient Sleep Syndrome</Text>
                {'\n\n'}
                Your answers suggest that you have significant daytime sleepiness that is likely
                associated with short sleep over the course of a week (average:{' '}
                {metrics.weeklyAverageTST.toFixed(1)} hours). Please see the video on our website
                that provides guidance on optimal sleep duration. If your daytime sleepiness does not
                improve with increased sleep time, please discuss your daytime sleepiness symptoms
                with your primary care provider to rule out an underlying medical condition.
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
                You have symptoms of insomnia that could be in the {getSeverityText(insomnia.severity)} range.
                We strongly recommend follow-up for a diagnosis and possible treatment.
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
                You have symptoms of both sleep-disordered breathing and insomnia. This condition is
                called Comorbid Insomnia and Sleep Apnea (COMISA). Please see the link on our website
                for more information on COMISA. When you discuss with your primary care or sleep
                doctor, please mention that you may have both conditions. Treatment of both is very
                important for your sleep health and quality of life.
                {'\n\n'}
                Treatment for COMISA should include:{'\n'}
                • A comprehensive sleep study to assess severity{'\n'}
                • Combined therapy: CBT-I plus CPAP treatment{'\n'}
                • Avoidance of sedative sleep medications{'\n'}
                • Weight management (if applicable){'\n'}
                • Consistent sleep schedules
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
                Since these occur frequently, we suggest that you discuss these symptoms with your
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

          {/* Chronic Fatigue / Fibromyalgia */}
          {chronicFatigue.hasSymptoms && (
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
                The medications that you are currently taking can contribute to sleep disturbance and
                your sleepiness, tiredness, or fatigue during the day. Please check out the links on
                our website for more information and discuss the impact of your medications on your
                sleep with your medical provider. Do not discontinue prescription or over-the-counter
                medications that your medical providers have recommended without consulting them first.
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
          {!insomnia.hasInsomnia &&
            !sleepApnea.hasProbableSleepApnea &&
            !sleepApnea.hasMildRespiratoryDisturbance &&
            !report.hasCOMISA &&
            !report.hasRLS &&
            !report.insufficientSleep &&
            eds.severity === 'none' &&
            !nightmares.hasNightmareDisorder &&
            !nightmares.hasBadDreamWarning &&
            !report.hasAnxiety &&
            !chronicFatigue.hasSymptoms &&
            !painRelated.hasCondition &&
            !medicationRelated.hasCondition && (
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
          <Text style={styles.sectionTitle}>Personalized Recommendations</Text>

          {insomnia.hasInsomnia && (
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
          <Text style={styles.sectionTitle}>Resources</Text>

          <View style={styles.resourceBox}>
            <Text style={styles.resourceTitle}>SomnaHealth Services</Text>
            <Text style={styles.text}>
              Our team offers sleep education that addresses the specific problems identified in this report.
              Visit our website for more information about how we can help you achieve better sleep,
              find a sleep specialist in your area, and access educational resources about your
              specific sleep concerns.
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
