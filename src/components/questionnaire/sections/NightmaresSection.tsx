import { UseFormReturn } from 'react-hook-form'
import { QuestionnaireFormData } from '@/validations/questionnaire'
import { CheckboxField } from '../form-fields/CheckboxField'
import { NumberField } from '../form-fields/NumberField'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Brain, AlertCircle } from 'lucide-react'

interface NightmaresSectionProps {
  form: UseFormReturn<QuestionnaireFormData>
}

export function NightmaresSection({ form }: NightmaresSectionProps) {
  const hasNightmares = form.watch('nightmares.hasNightmares')
  const nightmaresPerWeek = form.watch('nightmares.nightmaresPerWeek') ?? 0
  const associatedWithTrauma = form.watch('nightmares.associatedWithTrauma')

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">
        Nightmares and Dream Disturbances
      </div>

      <Alert className="alert-info">
        <Brain className="h-4 w-4 text-primary" />
        <AlertDescription className="text-foreground/90">
          Nightmares can disturb sleep and cause distress during the day. Understanding their 
          frequency and triggers helps us provide better recommendations for your sleep health.
        </AlertDescription>
      </Alert>

      {/* Has nightmares */}
      <CheckboxField
        control={form.control}
        name="nightmares.hasNightmares"
        label="Do you have nightmares?"
      />

      {/* Nightmare frequency - only show if they have nightmares */}
      {hasNightmares && (
        <>
          <NumberField
            control={form.control}
            name="nightmares.nightmaresPerWeek"
            label="On how many nights a week do you have nightmares?"
            placeholder="0-7"
            min={0}
            max={7}
            description="Enter the average number of nights per week"
          />

          <CheckboxField
            control={form.control}
            name="nightmares.associatedWithTrauma"
            label="Are your nightmares associated with exposure to trauma or a history of post traumatic stress disorder (PTSD)?"
          />
        </>
      )}

      {/* Frequent nightmares warning */}
      {nightmaresPerWeek >= 3 && (
        <Alert className="alert-warning">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-900">
            <strong>Frequent Nightmares Detected</strong>
            <br />
            Frequent nightmares can be distressing and associated with stress, trauma, and mood 
            disturbance. If your nightmares are distressing, we suggest that you consult with a 
            behavioral sleep specialist. There are effective treatments for nightmare disorders, 
            and when they are persistent, a sleep specialist or psychiatrist may suggest a trial 
            of medication.
          </AlertDescription>
        </Alert>
      )}

      {/* Less frequent nightmares info */}
      {hasNightmares && nightmaresPerWeek > 0 && nightmaresPerWeek < 3 && (
        <Alert>
          <Brain className="h-4 w-4" />
          <AlertDescription>
            Nightmares can disturb sleep and can cause distress during the day. If you experience 
            distress as a result of your nightmares, we recommend that you consult with a behavioral 
            sleep specialist or mental health professional.
          </AlertDescription>
        </Alert>
      )}

      {/* PTSD/Trauma warning */}
      {associatedWithTrauma && (
        <Alert className="alert-danger">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-900">
            <strong>Trauma-Related Nightmares</strong>
            <br />
            Trauma and PTSD are serious mental health challenges that require treatment by a provider 
            who specializes in treatment of trauma. Nightmares are one of many symptoms of PTSD and 
            trauma, and for most people, treatment of PTSD with evidence-based therapies is a high priority. 
            Please consider seeking help from a qualified mental health professional who specializes in trauma.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
