import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Sleep Health Assessment
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Take our comprehensive 15-minute questionnaire to understand your sleep patterns and get personalized recommendations.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-2xl mr-2">🧠</span>
                Science-Based
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Our questionnaire uses psychometrically validated questions to accurately assess your sleep health.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-2xl mr-2">⏰</span>
                Quick & Easy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Complete the assessment in just 15 minutes and get immediate, personalized results.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-2xl mr-2">🔒</span>
                Privacy First
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                We only collect minimal information (birth year, location, sex) to provide accurate recommendations.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Ready to Improve Your Sleep?</CardTitle>
            <CardDescription className="text-lg">
              Our assessment will help identify potential sleep disorders or areas for sleep health optimization.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p><strong>What you&apos;ll discover:</strong></p>
                <ul className="mt-2 space-y-1">
                  <li>• Potential sleep disorders (insomnia, sleep apnea, restless legs, etc.)</li>
                  <li>• Sleep health optimization opportunities</li>
                  <li>• Personalized recommendations and resources</li>
                  <li>• Links to sleep specialists and educational content</li>
                </ul>
              </div>
              
              <Link href="/questionnaire">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Sleep Assessment
                </Button>
              </Link>
              
              <p className="text-xs text-gray-500 mt-4">
                This assessment is for educational purposes only and does not constitute medical advice.
                Please consult with a qualified healthcare professional for proper diagnosis and treatment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
