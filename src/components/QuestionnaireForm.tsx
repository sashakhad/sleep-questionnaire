'use client';

import React, { useState } from 'react';
import { QuestionnaireStep } from './QuestionnaireStep';
import { QuestionnaireNavigation } from './QuestionnaireNavigation';
import { questionnaireData, demographicQuestions } from '../lib/questionnaire-data';
import { QuestionnaireResponse } from '../validations/questionnaire';
import { scoreQuestionnaire } from '../lib/scoring';
import { generateNarrativeReport, formatReportForDisplay } from '../lib/report-generator';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface QuestionnaireFormProps {
  onComplete?: (reportId: string) => void;
}

export function QuestionnaireForm({ onComplete }: QuestionnaireFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Partial<QuestionnaireResponse>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forceRender, setForceRender] = useState(0);

  const allSections = [
    { id: 'demographics', title: 'Basic Information', questions: demographicQuestions },
    ...questionnaireData
  ];

  const sectionTitles = allSections.map(section => section.title);

  const handleStepComplete = async (stepData: Record<string, unknown>) => {
    const currentSection = allSections[currentStep];
    if (!currentSection) {return;}
    
    const updatedResponses = {
      ...responses,
      [currentSection.id]: stepData
    };
    setResponses(updatedResponses);

    if (currentStep < allSections.length - 1) {
      const nextStep = currentStep + 1;
      console.log('=== STEP NAVIGATION DEBUG ===');
      console.log('Current step:', currentStep);
      console.log('Next step:', nextStep);
      console.log('Current section:', currentSection.id);
      console.log('Next section:', allSections[nextStep]?.id);
      console.log('=== END STEP NAVIGATION DEBUG ===');
      
      setCurrentStep(nextStep);
      setForceRender(prev => prev + 1);
    } else {
      await handleSubmitQuestionnaire(updatedResponses);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitQuestionnaire = async (finalResponses: Partial<QuestionnaireResponse>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (!finalResponses.demographics || !finalResponses.section1 || !finalResponses.section2) {
        throw new Error('Missing required questionnaire data');
      }

      const completeResponse: QuestionnaireResponse = {
        demographics: finalResponses.demographics,
        section1: finalResponses.section1,
        section2: finalResponses.section2,
        section3: finalResponses.section3 || {},
        section4: finalResponses.section4 || {},
        section5: finalResponses.section5 || {},
        section6: finalResponses.section6 || {},
        section7: finalResponses.section7 || {},
        section8: finalResponses.section8 || {}
      } as QuestionnaireResponse;

      const scoring = scoreQuestionnaire(completeResponse);
      
      const narrativeReport = generateNarrativeReport(completeResponse, scoring);
      const formattedReport = formatReportForDisplay(narrativeReport);

      const response = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birthYear: finalResponses.demographics.birthYear,
          zipcode: finalResponses.demographics.zipcode,
          sex: finalResponses.demographics.sex,
          responses: finalResponses,
          scores: scoring,
          report: formattedReport
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save questionnaire response');
      }

      const result = await response.json();
      
      if (onComplete) {
        onComplete(result.id);
      }
    } catch (err) {
      console.error('Error submitting questionnaire:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-red-600">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => setError(null)}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  if (isSubmitting) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Generating Your Sleep Report...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3">Please wait while we analyze your responses...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentSection = allSections[currentStep];
  if (!currentSection) {
    return <div>Loading...</div>;
  }
  
  console.log('=== QuestionnaireForm RENDER DEBUG ===');
  console.log('QuestionnaireForm render - currentStep:', currentStep);
  console.log('QuestionnaireForm render - currentSection:', currentSection);
  console.log('QuestionnaireForm render - currentSection.id:', currentSection.id);
  console.log('QuestionnaireForm render - currentSection.title:', currentSection.title);
  console.log('QuestionnaireForm render - allSections length:', allSections.length);
  console.log('QuestionnaireForm render - allSections[currentStep]:', allSections[currentStep]);
  
  const defaultValues = (responses as any)[currentSection.id] || {};
  console.log('QuestionnaireForm render - defaultValues for section:', currentSection.id, defaultValues);
  console.log('=== END QuestionnaireForm DEBUG ===');

  return (
    <div className="space-y-6">
      <QuestionnaireNavigation
        currentStep={currentStep}
        totalSteps={allSections.length}
        sectionTitles={sectionTitles}
      />
      
      <QuestionnaireStep
        key={`${currentSection.id}-${currentStep}-${forceRender}-${Date.now()}`}
        section={currentSection}
        onNext={handleStepComplete}
        onPrevious={currentStep > 0 ? handlePrevious : undefined}
        isFirst={currentStep === 0}
        isLast={currentStep === allSections.length - 1}
        defaultValues={defaultValues}
      />
    </div>
  );
}
