'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QuestionnaireForm } from '@/components/questionnaire/QuestionnaireForm';
import { defaultReviewScenario, getDiagnosisScenario } from '@/lib/diagnosis-scenarios';

export function ReviewPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scenarioParam = searchParams.get('scenario');
  const activeScenario = getDiagnosisScenario(scenarioParam ?? '') ?? defaultReviewScenario;

  useEffect(() => {
    if (scenarioParam === activeScenario.id) {
      return;
    }

    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.set('scenario', activeScenario.id);

    router.replace(`/review?${nextSearchParams.toString()}`, { scroll: false });
  }, [activeScenario.id, router, scenarioParam, searchParams]);

  function handleScenarioChange(nextScenarioId: string) {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.set('scenario', nextScenarioId);

    router.replace(`/review?${nextSearchParams.toString()}`, { scroll: false });
  }

  return (
    <QuestionnaireForm
      initialScenarioId={activeScenario.id}
      onScenarioChange={handleScenarioChange}
      persistResponses={false}
      prefill={true}
      reviewMode={true}
    />
  );
}
