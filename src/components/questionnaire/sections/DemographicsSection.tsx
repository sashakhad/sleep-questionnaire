import { UseFormReturn } from 'react-hook-form'
import { QuestionnaireFormData } from '@/validations/questionnaire'
import { NumberField } from '../form-fields/NumberField'
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormMessage,
  FormDescription 
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { User, Info } from 'lucide-react'

interface DemographicsSectionProps {
  form: UseFormReturn<QuestionnaireFormData>
}

export function DemographicsSection({ form }: DemographicsSectionProps) {
  const weight = form.watch('demographics.weight')
  const height = form.watch('demographics.height')
  const age = form.watch('demographics.age')
  
  // Calculate BMI if we have both weight and height
  let bmi = null
  if (weight && height && weight > 0 && height > 0) {
    // Convert height from inches to meters, weight from lbs to kg
    const heightInMeters = (height * 0.0254)
    const weightInKg = weight * 0.453592
    bmi = weightInKg / (heightInMeters * heightInMeters)
  }

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">
        About You
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <User className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          This information helps us provide more personalized recommendations. Age and body 
          measurements can influence sleep patterns and the likelihood of certain sleep disorders.
        </AlertDescription>
      </Alert>

      {/* Age */}
      <NumberField
        control={form.control}
        name="demographics.age"
        label="What is your age?"
        placeholder="Years"
        min={0}
        max={120}
        description="Your age helps us understand age-related sleep patterns"
      />

      {/* Weight and Height */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField
          control={form.control}
          name="demographics.weight"
          label="Weight"
          placeholder="Pounds"
          min={0}
          max={500}
          description="In pounds (lbs)"
        />

        <NumberField
          control={form.control}
          name="demographics.height"
          label="Height"
          placeholder="Inches"
          min={0}
          max={96}
          description="In inches (e.g., 70 for 5'10)"
        />
      </div>

      {/* BMI Display */}
      {bmi && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Body Mass Index (BMI)</h3>
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-blue-600">
              {bmi.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">
              {bmi < 18.5 ? 'Underweight' :
               bmi < 25 ? 'Normal weight' :
               bmi < 30 ? 'Overweight' :
               'Obese'}
            </div>
          </div>
        </div>
      )}

      {/* Zipcode */}
      <FormField
        control={form.control}
        name="demographics.zipcode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Zipcode</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., 12345"
                {...field}
                className="max-w-xs"
              />
            </FormControl>
            <FormDescription>
              Helps us understand regional patterns and connect you with local resources
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* BMI and Sleep Apnea Warning */}
      {bmi && bmi >= 30 && (
        <Alert className="border-amber-200 bg-amber-50">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-900">
            <strong>BMI and Sleep Apnea Risk</strong>
            <br />
            A BMI of 30 or higher is associated with increased risk of obstructive sleep apnea. 
            This is especially important if you also experience snoring, witnessed breathing 
            pauses during sleep, or excessive daytime sleepiness. Consider discussing sleep 
            apnea screening with your healthcare provider.
          </AlertDescription>
        </Alert>
      )}

      {/* Age-related sleep info */}
      {age && age >= 65 && (
        <Alert>
          <User className="h-4 w-4" />
          <AlertDescription>
            <strong>Age-Related Sleep Changes</strong>
            <br />
            Sleep patterns naturally change with age. After 65, it&apos;s common to experience:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Earlier bedtimes and wake times (advanced sleep phase)</li>
              <li>More frequent nighttime awakenings</li>
              <li>Lighter sleep with less deep sleep</li>
              <li>Increased daytime napping</li>
            </ul>
            These changes are normal, but if they significantly impact your quality of life, 
            treatments are available.
          </AlertDescription>
        </Alert>
      )}

      {/* Adolescent/young adult sleep info */}
      {age && age >= 12 && age <= 25 && (
        <Alert>
          <User className="h-4 w-4" />
          <AlertDescription>
            <strong>Sleep in Adolescents and Young Adults</strong>
            <br />
            Your age group commonly experiences delayed sleep phase, preferring to stay up late 
            and wake up late. This biological tendency often conflicts with school or work schedules. 
            If you&apos;re struggling with early morning obligations, you may benefit from light 
            therapy and sleep schedule adjustments.
          </AlertDescription>
        </Alert>
      )}

      {/* Completion message */}
      <Alert className="border-green-200 bg-green-50">
        <Info className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-900">
          <strong>Almost Done!</strong>
          <br />
          Thank you for providing this information. After you click &quot;Generate Report&quot; below, 
          we&apos;ll analyze your responses and create a personalized sleep health report with 
          specific recommendations based on your unique situation.
        </AlertDescription>
      </Alert>
    </div>
  )
}
