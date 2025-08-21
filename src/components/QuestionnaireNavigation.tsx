'use client';

import React from 'react';
import { Progress } from './ui/progress';
import { Card, CardContent } from './ui/card';

interface QuestionnaireNavigationProps {
  currentStep: number;
  totalSteps: number;
  sectionTitles: string[];
}

export function QuestionnaireNavigation({
  currentStep,
  totalSteps,
  sectionTitles
}: QuestionnaireNavigationProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <Card className="w-full max-w-4xl mx-auto mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              Step {currentStep + 1} of {totalSteps}
            </h2>
            <span className="text-sm text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          
          <Progress value={progress} className="w-full" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {sectionTitles.map((title, index) => (
              <div
                key={index}
                className={`p-2 rounded text-center ${
                  index === currentStep
                    ? 'bg-primary text-primary-foreground font-medium'
                    : index < currentStep
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {title}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
