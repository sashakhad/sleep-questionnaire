'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { QuestionnaireSection, Question } from '../lib/questionnaire-data';

interface QuestionnaireStepProps {
  section: QuestionnaireSection;
  onNext: (data: Record<string, unknown>) => void;
  onPrevious?: (() => void) | undefined;
  isFirst?: boolean;
  isLast?: boolean;
  defaultValues?: Record<string, unknown>;
}

function createDynamicSchema(questions: Question[], formValues: Record<string, any> = {}): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const schemaFields: Record<string, z.ZodTypeAny> = {};
  
  questions.forEach(question => {
    if (question.type === 'radio' && question.required !== false) {
      schemaFields[question.id] = z.string().min(1, 'This field is required');
    } else if (question.type === 'checkbox') {
      schemaFields[question.id] = z.array(z.string()).default([]);
    } else if (question.type === 'number') {
      const numberSchema = z.number().min(question.min || 0);
      if (question.max) {numberSchema.max(question.max);}
      schemaFields[question.id] = question.required !== false ? numberSchema : numberSchema.optional();
    } else if (question.type === 'text' || question.type === 'time') {
      schemaFields[question.id] = question.required !== false 
        ? z.string().min(1, 'This field is required')
        : z.string().default('');
    } else if (question.type === 'scale') {
      schemaFields[question.id] = z.number().min(question.min || 1).max(question.max || 10);
    } else if (question.type === 'radio' && question.required === false) {
      schemaFields[question.id] = z.string().default('');
    }
    
    if (question.subQuestions) {
      question.subQuestions.forEach(subQ => {
        if (shouldShowQuestion(subQ, formValues)) {
          if (subQ.type === 'number') {
            schemaFields[subQ.id] = subQ.required !== false 
              ? z.number().min(subQ.min || 0).max(subQ.max || 100)
              : z.number().min(subQ.min || 0).max(subQ.max || 100).optional();
          } else if (subQ.type === 'text' || subQ.type === 'time') {
            schemaFields[subQ.id] = subQ.required !== false 
              ? z.string().min(1, 'This field is required')
              : z.string().default('');
          } else if (subQ.type === 'radio') {
            schemaFields[subQ.id] = subQ.required !== false 
              ? z.string().min(1, 'This field is required')
              : z.string().default('');
          } else if (subQ.type === 'scale') {
            schemaFields[subQ.id] = subQ.required !== false 
              ? z.number().min(subQ.min || 1).max(subQ.max || 10)
              : z.number().min(subQ.min || 1).max(subQ.max || 10).optional();
          }
        } else {
          if (subQ.type === 'number') {
            schemaFields[subQ.id] = z.number().optional();
          } else if (subQ.type === 'text' || subQ.type === 'time') {
            schemaFields[subQ.id] = z.string().default('');
          } else if (subQ.type === 'radio') {
            schemaFields[subQ.id] = z.string().default('');
          } else if (subQ.type === 'scale') {
            schemaFields[subQ.id] = z.number().optional();
          }
        }
      });
    }
  });
  
  return z.object(schemaFields);
}

function shouldShowQuestion(question: Question, formValues: Record<string, any>): boolean {
  if (!question.condition) {return true;}
  
  const condition = question.condition;
  const match = condition.match(/(\d+\.\d+[a-z]?)\s*===\s*"([^"]+)"/);
  if (match && match[1] && match[2]) {
    const fieldId = match[1];
    const expectedValue = match[2];
    return formValues[fieldId] === expectedValue;
  }
  
  const numericMatch = condition.match(/(\d+\.\d+[a-z]?)\s*>\s*(\d+)/);
  if (numericMatch && numericMatch[1] && numericMatch[2]) {
    const fieldId = numericMatch[1];
    const threshold = numericMatch[2];
    return (formValues[fieldId] || 0) > parseInt(threshold);
  }
  
  return true;
}

function renderQuestion(question: Question, form: any, formValues: Record<string, unknown>) {
  if (!shouldShowQuestion(question, formValues)) {return null;}
  
  return (
    <div key={question.id} className="space-y-4">
      <FormField
        control={form.control}
        name={question.id}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">{question.text}</FormLabel>
            <FormControl>
              {question.type === 'radio' && question.options ? (
                <RadioGroup
                  onValueChange={(value) => {
                    console.log(`Radio change for ${question.id}: ${value}`);
                    field.onChange(value);
                  }}
                  value={field.value ?? ""}
                  className="flex flex-col space-y-2"
                >
                  {question.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                      <label
                        htmlFor={`${question.id}-${option.value}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              ) : question.type === 'checkbox' && question.options ? (
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${question.id}-${option.value}`}
                        checked={(field.value ?? []).includes(option.value)}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value ?? [];
                          if (checked) {
                            field.onChange([...currentValues, option.value]);
                          } else {
                            field.onChange(currentValues.filter((v: string) => v !== option.value));
                          }
                        }}
                      />
                      <label
                        htmlFor={`${question.id}-${option.value}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              ) : question.type === 'number' ? (
                <Input
                  type="number"
                  placeholder={question.placeholder}
                  min={question.min}
                  max={question.max}
                  step={question.step}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                />
              ) : question.type === 'time' ? (
                <Input
                  type="time"
                  placeholder={question.placeholder}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                />
              ) : question.type === 'scale' ? (
                <div className="space-y-2">
                  <Input
                    type="range"
                    min={question.min || 1}
                    max={question.max || 10}
                    step={1}
                    value={field.value ?? (question.min || 1)}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{question.min || 1}</span>
                    <span>Current: {field.value ?? (question.min || 1)}</span>
                    <span>{question.max || 10}</span>
                  </div>
                </div>
              ) : (
                <Input
                  type="text"
                  placeholder={question.placeholder}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Render sub-questions */}
      {question.subQuestions && question.subQuestions.map(subQuestion => 
        renderQuestion(subQuestion, form, formValues)
      )}
    </div>
  );
}

function createDefaultValues(questions: Question[]): Record<string, any> {
  const defaults: Record<string, any> = {};
  
  questions.forEach(question => {
    if (question.type === 'radio') {
      defaults[question.id] = '';
    } else if (question.type === 'checkbox') {
      defaults[question.id] = [];
    } else if (question.type === 'text' || question.type === 'time') {
      defaults[question.id] = '';
    } else if (question.type === 'number') {
      defaults[question.id] = undefined;
    } else if (question.type === 'scale') {
      defaults[question.id] = question.min || 1;
    }
    
    if (question.subQuestions) {
      question.subQuestions.forEach(subQ => {
        if (subQ.type === 'radio') {
          defaults[subQ.id] = '';
        } else if (subQ.type === 'text' || subQ.type === 'time') {
          defaults[subQ.id] = '';
        } else if (subQ.type === 'number') {
          defaults[subQ.id] = undefined;
        } else if (subQ.type === 'scale') {
          defaults[subQ.id] = subQ.min || 1;
        }
      });
    }
  });
  
  return defaults;
}

export function QuestionnaireStep({
  section,
  onNext,
  onPrevious,
  isFirst = false,
  isLast = false,
  defaultValues = {}
}: QuestionnaireStepProps) {
  console.log('=== QuestionnaireStep PROPS DEBUG ===');
  console.log('QuestionnaireStep render - Section ID:', section.id);
  console.log('QuestionnaireStep render - Section title:', section.title);
  console.log('QuestionnaireStep render - Section questions:', section.questions.map(q => q.id));
  console.log('QuestionnaireStep render - Default values passed:', defaultValues);
  console.log('=== END PROPS DEBUG ===');
  
  const formDefaults = React.useMemo(() => {
    const calculated = { ...createDefaultValues(section.questions), ...defaultValues };
    console.log('QuestionnaireStep render - Calculated formDefaults:', calculated);
    return calculated;
  }, [section.id, defaultValues]);
  
  const form = useForm({
    defaultValues: formDefaults,
    mode: 'onChange'
  });

  React.useEffect(() => {
    console.log('useEffect triggered for section:', section.id);
    console.log('useEffect - formDefaults:', formDefaults);
    console.log('useEffect - current form values:', form.getValues());
    const currentValues = form.getValues();
    const hasExistingData = Object.values(currentValues).some(value => 
      value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true)
    );
    
    if (!hasExistingData) {
      console.log('No existing data found, resetting form with defaults');
      form.reset(formDefaults);
    } else {
      console.log('Existing data found, preserving form state');
    }
    setIsFormValid(false);
  }, [section.id]);
  
  const watchedValues = form.watch();
  
  const [isFormValid, setIsFormValid] = React.useState(false);
  
  React.useEffect(() => {
    const validationResults = section.questions.map(question => {
      const value = watchedValues[question.id];
      let isValid = true;
      
      if (question.type === 'radio' && question.required !== false) {
        isValid = value && value !== '';
      } else if (question.type === 'checkbox') {
        isValid = true;
      } else if (question.type === 'number' && question.required !== false) {
        isValid = value !== undefined && value !== null && value !== '';
      } else if ((question.type === 'text' || question.type === 'time') && question.required !== false) {
        isValid = value && value !== '';
      }
      
      console.log(`Question ${question.id} (${question.type}): value=${JSON.stringify(value)}, required=${question.required !== false}, isValid=${isValid}`);
      return isValid;
    });
    
    const allValid = validationResults.every(Boolean);
    console.log('Form validation results:', validationResults);
    console.log('All questions valid:', allValid);
    console.log('Watched values:', watchedValues);
    console.log('Setting isFormValid to:', allValid);
    
    setIsFormValid(allValid);
  }, [watchedValues, section.questions]);
  
  function onSubmit(data: Record<string, unknown>) {
    console.log('Form submission data:', data);
    console.log('Watched values:', watchedValues);
    console.log('Form validation state:', form.formState);
    console.log('Form errors:', form.formState.errors);
    console.log('Section ID:', section.id);
    console.log('Section questions:', section.questions.map(q => q.id));
    console.log('Form defaults:', formDefaults);
    onNext(data);
  }
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{section.title}</CardTitle>
        <CardDescription>
          Please answer the following questions about your sleep patterns.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {section.questions.map(question => renderQuestion(question, form, watchedValues))}
            
            <div className="flex justify-between pt-6">
              {!isFirst && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onPrevious}
                >
                  Previous
                </Button>
              )}
              <Button
                type="submit"
                className={isFirst ? "ml-auto" : ""}
                disabled={!isFormValid}
              >
                {isLast ? 'Generate Report' : 'Next'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
