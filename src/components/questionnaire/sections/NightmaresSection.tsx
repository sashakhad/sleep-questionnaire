import { UseFormReturn } from 'react-hook-form'
import { QuestionnaireFormData } from '@/validations/questionnaire'
import { CheckboxField } from '../form-fields/CheckboxField'
import { NumberField } from '../form-fields/NumberField'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Brain, AlertCircle, Info } from 'lucide-react'

interface NightmaresSectionProps {
  form: UseFormReturn<QuestionnaireFormData>
}

export function NightmaresSection({ form }: NightmaresSectionProps) {
  const remembersDreams = form.watch('nightmares.remembersDreams')
  const hasBadDreams = form.watch('nightmares.hasBadDreams')
  const badDreamsPerWeek = form.watch('nightmares.badDreamsPerWeek') ?? 0
  const hasNightmares = form.watch('nightmares.hasNightmares')
  const nightmaresPerWeek = form.watch('nightmares.nightmaresPerWeek') ?? 0
  const associatedWithTrauma = form.watch('nightmares.associatedWithTrauma')

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">
        Dreams and Nightmares
      </div>

      <Alert className="alert-info">
        <Brain className="h-4 w-4 text-primary" />
        <AlertDescription className="text-foreground/90">
          Understanding your dream patterns helps us provide better recommendations for your sleep health.
          Dreams are a normal part of sleep, and everyone dreams every night even if they don&apos;t remember.
        </AlertDescription>
      </Alert>

      {/* Dream recall question */}
      <CheckboxField
        control={form.control}
        name="nightmares.remembersDreams"
        label="I remember my dreams at least a few nights a week"
      />

      {/* Dream recall info popup */}
      {remembersDreams && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Remembering your dreams can be a function of many factors. You are dreaming every night.
            You can improve dream awareness or recall by varying your wake time by 10-20 minutes a night,
            increasing your sleep time, and making an effort to remember and make notes about your dreams
            when you wake up.
          </AlertDescription>
        </Alert>
      )}

      {/* Definitions section */}
      <div className="border-border bg-card/50 rounded-xl border p-5 space-y-3">
        <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
          Understanding Dreams vs Nightmares
        </h3>
        <div className="space-y-2 text-sm text-foreground/80">
          <p>
            <strong>Bad dreams</strong> involve disturbing or negative dream content.
          </p>
          <p>
            <strong>Nightmares</strong> are bad dreams that also involve waking up feeling scared, panicked, or upset.
          </p>
        </div>
      </div>

      {/* Bad dreams question */}
      <CheckboxField
        control={form.control}
        name="nightmares.hasBadDreams"
        label="I have bad dreams, but not nightmares"
        description="Disturbing dreams where you don't wake up feeling scared or panicked"
      />

      {/* Bad dreams frequency */}
      {hasBadDreams && (
        <NumberField
          control={form.control}
          name="nightmares.badDreamsPerWeek"
          label="How many nights a week do you have bad dreams?"
          placeholder="0-7"
          min={0}
          max={7}
          description="Enter the average number of nights per week"
        />
      )}

      {/* Bad dreams warning (3+ per week) */}
      {badDreamsPerWeek >= 3 && (
        <Alert className="alert-warning">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-900">
            <strong>Frequent Bad Dreams</strong>
            <br />
            You endorsed symptoms of having frequent bad dreams. This can be a sign of a history of trauma,
            a mental health condition, or may be caused by some medications. Please see the section on our
            website that has more information on dreams and nightmares.
          </AlertDescription>
        </Alert>
      )}

      {/* Nightmares question */}
      <CheckboxField
        control={form.control}
        name="nightmares.hasNightmares"
        label="I have nightmares"
        description="Bad dreams that wake you up feeling scared, panicked, or upset"
      />

      {/* Nightmare frequency - only show if they have nightmares */}
      {hasNightmares && (
        <>
          <NumberField
            control={form.control}
            name="nightmares.nightmaresPerWeek"
            label="How many nights a week do you have nightmares?"
            placeholder="0-7"
            min={0}
            max={7}
            description="Enter the average number of nights per week"
          />

          <CheckboxField
            control={form.control}
            name="nightmares.associatedWithTrauma"
            label="My nightmares are associated with exposure to trauma or a history of post traumatic stress disorder (PTSD)"
          />
        </>
      )}

      {/* Nightmare disorder warning (2+ per week) */}
      {nightmaresPerWeek >= 2 && (
        <Alert className="alert-warning">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-900">
            <strong>Possible Nightmare Disorder</strong>
            <br />
            You endorsed symptoms of a nightmare parasomnia/disorder. This can be a sign of a history of
            trauma, a mental health disorder, and can be caused by some medications. Frequent nightmares
            can be distressing and associated with stress, trauma, and mood disturbance. Please see the
            section on our website that has more information on nightmares. If your nightmares are
            distressing, we suggest that you consult with a behavioral sleep specialist.
          </AlertDescription>
        </Alert>
      )}

      {/* Less frequent nightmares info */}
      {hasNightmares && nightmaresPerWeek > 0 && nightmaresPerWeek < 2 && (
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
