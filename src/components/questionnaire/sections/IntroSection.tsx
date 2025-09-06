import { AlertCircle, Lock, FileText } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function IntroSection() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Sleep Health Questionnaire
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Welcome to your personalized sleep assessment. This comprehensive questionnaire 
          will help us understand your sleep patterns and provide you with tailored 
          recommendations to improve your sleep health.
        </p>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Lock className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          <strong>Your Privacy is Protected</strong>
          <br />
          The information provided in this questionnaire will be de-identified and not 
          linked to you unless you choose to receive services from our sleep experts. 
          We are bound by federal and state laws and will never share your identity 
          with anyone unless you provide us with written consent.
        </AlertDescription>
      </Alert>

      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          <strong>About Your Report</strong>
          <br />
          You may print out and use the report generated from your sleep data. 
          Once generated, you will be responsible for maintaining the security of your report.
        </AlertDescription>
      </Alert>

      <Alert className="border-amber-200 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-900">
          <strong>Important Note</strong>
          <br />
          Most of these questions apply to the last week. If you were on vacation or sick, 
          please think about your most recent typical work/school week.
        </AlertDescription>
      </Alert>

      <div className="pt-6 border-t">
        <h2 className="text-xl font-semibold mb-3">What to Expect</h2>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>The questionnaire takes approximately 15-20 minutes to complete</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Answer questions about your daytime feelings and nighttime sleep patterns</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Receive a personalized sleep health report with recommendations</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Get guidance on potential sleep disorders and treatment options</span>
          </li>
        </ul>
      </div>

      <div className="text-center pt-4">
        <p className="text-sm text-gray-500">
          Click &quot;Next Section&quot; below to begin your sleep health assessment
        </p>
      </div>
    </div>
  )
}
