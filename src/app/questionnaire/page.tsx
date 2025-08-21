'use client';

import { useRouter } from 'next/navigation';
import { QuestionnaireForm } from '../../components/QuestionnaireForm';

export default function QuestionnairePage() {
  const router = useRouter();

  const handleComplete = (reportId: string) => {
    router.push(`/results/${reportId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sleep Health Assessment</h1>
          <p className="mt-2 text-gray-600">
            Please answer all questions honestly for the most accurate results.
          </p>
        </div>
        
        <QuestionnaireForm onComplete={handleComplete} />
      </div>
    </div>
  );
}
