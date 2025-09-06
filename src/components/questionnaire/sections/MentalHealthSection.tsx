import { UseFormReturn } from 'react-hook-form'
import { QuestionnaireFormData } from '@/validations/questionnaire'
import { CheckboxField } from '../form-fields/CheckboxField'
import { RadioGroupField } from '../form-fields/RadioGroupField'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Brain, AlertCircle, Heart } from 'lucide-react'

interface MentalHealthSectionProps {
  form: UseFormReturn<QuestionnaireFormData>
}

export function MentalHealthSection({ form }: MentalHealthSectionProps) {
  const worriesAffectSleep = form.watch('mentalHealth.worriesAffectSleep')
  const anxietyInBed = form.watch('mentalHealth.anxietyInBed')
  const timeInBedTrying = form.watch('mentalHealth.timeInBedTrying')
  const cancelsAfterPoorSleep = form.watch('mentalHealth.cancelsAfterPoorSleep')
  
  const hasSignificantAnxiety = (worriesAffectSleep && anxietyInBed) || timeInBedTrying
  const moderateToSevereInsomnia = cancelsAfterPoorSleep !== 'never'

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">
        Mental Health and Sleep
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Brain className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          Mental health and sleep have a bidirectional relationship. Anxiety and worry can 
          prevent sleep, while poor sleep can worsen mental health symptoms. Understanding 
          this connection helps us provide better support.
        </AlertDescription>
      </Alert>

      {/* Worries about next day */}
      <CheckboxField
        control={form.control}
        name="mentalHealth.worriesAffectSleep"
        label="Do worries about the next day often contribute to difficulty falling asleep or extend your nighttime awakenings?"
      />

      {/* Anxiety in bed */}
      <CheckboxField
        control={form.control}
        name="mentalHealth.anxietyInBed"
        label="Do you have anxiety or persistent rumination while in bed at night?"
        description="Racing thoughts, worry loops, or inability to quiet your mind"
      />

      {/* Time in bed trying */}
      <CheckboxField
        control={form.control}
        name="mentalHealth.timeInBedTrying"
        label="Do you spend time in bed trying to sleep?"
        description="Lying awake for extended periods hoping sleep will come"
      />

      {/* Cancel activities */}
      <RadioGroupField
        control={form.control}
        name="mentalHealth.cancelsAfterPoorSleep"
        label="How often do you cancel activities following a night of poor sleep?"
        options={[
          { value: 'never', label: 'Never' },
          { value: '1-2week', label: '1-2 times a week' },
          { value: '3+week', label: '3 or more times a week' },
        ]}
      />

      {/* Sleep anxiety warning */}
      {hasSignificantAnxiety && (
        <Alert className="border-amber-200 bg-amber-50">
          <Brain className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-900">
            <strong>Sleep-Related Anxiety Detected</strong>
            <br />
            It&apos;s likely that your anxiety related to sleep is interfering with your ability 
            to surrender to sleep at night. This creates a vicious cycle where worry about sleep 
            prevents sleep, which increases worry. Consider these strategies:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Practice relaxation techniques before bed (deep breathing, progressive muscle relaxation)</li>
              <li>Keep a worry journal - write down concerns before bed to &quot;park&quot; them</li>
              <li>Limit time in bed when not sleeping (get up after 20 minutes if awake)</li>
              <li>Consider Cognitive Behavioral Therapy for Insomnia (CBT-I)</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Moderate to severe insomnia */}
      {moderateToSevereInsomnia && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-900">
            <strong>Significant Sleep Impact on Daily Life</strong>
            <br />
            Your sleep difficulties are significantly impacting your daily functioning. This level 
            of impairment suggests moderate to severe insomnia that warrants professional evaluation. 
            We strongly recommend consulting with a sleep specialist or mental health professional 
            who can provide targeted treatment.
          </AlertDescription>
        </Alert>
      )}

      {/* Performance anxiety */}
      {timeInBedTrying && (
        <Alert>
          <Brain className="h-4 w-4" />
          <AlertDescription>
            <strong>Sleep Effort Paradox</strong>
            <br />
            The harder you try to sleep, the more elusive it becomes. Sleep is a passive process 
            that cannot be forced. Instead of &quot;trying&quot; to sleep:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Focus on relaxation rather than sleep</li>
              <li>If not asleep within 20 minutes, get up and do a quiet activity</li>
              <li>Return to bed only when genuinely sleepy</li>
              <li>Use your bed only for sleep and intimacy, not for worrying</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Positive message for those without issues */}
      {!worriesAffectSleep && !anxietyInBed && !timeInBedTrying && cancelsAfterPoorSleep === 'never' && (
        <Alert className="border-green-200 bg-green-50">
          <Heart className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-900">
            <strong>Good Mental Sleep Health!</strong>
            <br />
            You don&apos;t appear to have significant anxiety or worry related to sleep. This is 
            excellent as it means your mind isn&apos;t creating barriers to natural sleep. Continue 
            maintaining this healthy relationship with sleep.
          </AlertDescription>
        </Alert>
      )}

      {/* General mental health resources */}
      <Alert>
        <Brain className="h-4 w-4" />
        <AlertDescription>
          <strong>Mental Health Resources</strong>
          <br />
          If you&apos;re experiencing anxiety, depression, or other mental health concerns that 
          affect your sleep, remember that help is available. Mental health professionals can 
          provide evidence-based treatments that address both sleep and emotional well-being. 
          Don&apos;t hesitate to reach out for support when needed.
        </AlertDescription>
      </Alert>
    </div>
  )
}
