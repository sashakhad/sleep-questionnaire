'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { questionnaireSchema, type QuestionnaireFormData } from '@/validations/questionnaire';
import { type QuestionnaireSection } from '@/types/questionnaire';
import { cn } from '@/lib/utils';
import { Download, TestTube } from 'lucide-react';
import type { FullReportResult } from '@/lib/diagnosis-report-types';
import {
  defaultReviewScenario,
  diagnosisScenarios,
  getDiagnosisScenario,
  type DiagnosisScenario,
} from '@/lib/diagnosis-scenarios';

const DEFAULT_PREFILL_DATA: QuestionnaireFormData = defaultReviewScenario.data;

// Import section components
import { IntroSection } from './sections/IntroSection';
import { DemographicsSection } from './sections/DemographicsSection';
import { DaytimeSection } from './sections/DaytimeSection';
import { ScheduledSleepSection } from './sections/ScheduledSleepSection';
import { UnscheduledSleepSection } from './sections/UnscheduledSleepSection';
import { BreathingDisordersSection } from './sections/BreathingDisordersSection';
import { RestlessLegsSection } from './sections/RestlessLegsSection';
import { ParasomniaSection } from './sections/ParasomniaSection';
import { NightmaresSection } from './sections/NightmaresSection';
import { ChronotypeSection } from './sections/ChronotypeSection';
import { SleepHygieneSection } from './sections/SleepHygieneSection';
import { BedroomSection } from './sections/BedroomSection';
import { LifestyleSection } from './sections/LifestyleSection';
import { MentalHealthSection } from './sections/MentalHealthSection';
import { SleepDisorderDiagnosesSection } from './sections/SleepDisorderDiagnosesSection';
import { ReportSection } from './sections/ReportSection';

export const sections: QuestionnaireSection[] = [
  'intro',
  'demographics',
  'sleep-disorder-diagnoses', // Moved to beginning per round 2 feedback
  'daytime',
  'scheduled-sleep',
  'unscheduled-sleep',
  'breathing-disorders',
  'restless-legs',
  'parasomnia',
  'nightmares',
  'chronotype',
  'sleep-hygiene',
  'bedroom',
  'lifestyle',
  'mental-health',
  'report',
];

export const sectionTitles: Record<QuestionnaireSection, string> = {
  intro: 'Welcome',
  demographics: 'About You',
  daytime: 'Daytime Functioning',
  'scheduled-sleep': 'Sleep on Work/School Nights',
  'unscheduled-sleep': 'Sleep on Weekends/Free Days',
  'breathing-disorders': 'Sleep Breathing',
  'restless-legs': 'Restless Legs',
  parasomnia: 'Sleep Behaviors',
  nightmares: 'Nightmares',
  chronotype: 'Sleep Preferences',
  'sleep-hygiene': 'Sleep Medications & Supplements',
  bedroom: 'Bedroom Environment',
  lifestyle: 'Lifestyle Factors',
  'mental-health': 'Mental Health & Sleep',
  'sleep-disorder-diagnoses': 'Sleep Disorder History',
  report: 'Your Sleep Report',
};

interface QuestionnaireFormProps {
  initialSection?: QuestionnaireSection | undefined;
  prefill?: boolean | undefined;
  onSectionChange?: ((section: QuestionnaireSection, index: number) => void) | undefined;
  initialScenarioId?: string | undefined;
  onScenarioChange?: ((scenarioId: string) => void) | undefined;
  reviewMode?: boolean | undefined;
  persistResponses?: boolean | undefined;
}

export function QuestionnaireForm({
  initialSection,
  prefill,
  onSectionChange,
  initialScenarioId,
  onScenarioChange,
  reviewMode,
  persistResponses,
}: QuestionnaireFormProps = {}) {
  const initialIndex = initialSection ? sections.indexOf(initialSection) : 0;
  const [currentSectionIndex, setCurrentSectionIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  );
  const currentSection = sections[currentSectionIndex]!;
  const [reportData, setReportData] = useState<FullReportResult | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState(
    initialScenarioId ?? defaultReviewScenario.id
  );
  const activeScenario = getDiagnosisScenario(selectedScenarioId) ?? defaultReviewScenario;
  const shouldShowScenarioTools =
    !!reviewMode ||
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_SHOW_DEV_TOOLS === 'true';
  const shouldAutoGenerateReport = !!prefill || !!reviewMode;
  const shouldIncludeBreakdown = !!prefill || !!reviewMode;
  const shouldPersistResponses = persistResponses ?? (!prefill && !reviewMode);
  const reviewDeepLink = `/review?scenario=${selectedScenarioId}`;
  // Progress: 0% on intro, 100% on report (last section)
  const progress = (currentSectionIndex / (sections.length - 1)) * 100;

  const form = useForm<QuestionnaireFormData>({
    resolver: zodResolver(questionnaireSchema),
    mode: 'onChange',
    defaultValues: {
      intro: {
        acceptedDisclaimer: false,
      },
      demographics: {
        yearOfBirth: undefined as unknown as number, // Required - will trigger validation
        sex: undefined as unknown as
          | 'male'
          | 'female'
          | 'transgender'
          | 'other'
          | 'prefer-not-to-say', // Required
        zipcode: '', // Required - min 5 chars
        weight: null,
        height: null,
      },
      daytime: {
        plannedNaps: { daysPerWeek: 0, napsPerWeek: 0, duration: null },
        fallAsleepDuring: [],
        sleepinessInterferes: false,
        sleepinessSeverity: null,
        tiredButCantSleep: null,
        weaknessWhenExcited: [],
        sleepParalysis: false,
        diagnosedNarcolepsy: false,
        painAffectsSleep: false,
        painSeverity: null,
        jointMusclePain: false,
        nonRestorativeSleep: false,
        tirednessRating: null,
        fatigueRating: null,
      },
      scheduledSleep: {
        lightsOutTime: '',
        lightsOutVaries: false,
        preBedActivity: [],
        minutesToFallAsleep: null,
        nightWakeups: 0,
        wakeupReasons: [],
        minutesAwakeAtNight: null,
        wakeupTime: '',
        getOutOfBedTime: '',
        earlyWakeupDays: 0,
        earlyWakeupMinutes: null,
        usesAlarm: false,
      },
      unscheduledSleep: {
        lightsOutTime: '',
        minutesToFallAsleep: null,
        nightWakeups: 0,
        wakeupReasons: [],
        minutesAwakeAtNight: null,
        wakeupTime: '',
        getOutOfBedTime: '',
        usesAlarm: false,
      },
      breathingDisorders: {
        snores: false,
        stopsBreathing: false,
        mouthBreathes: false,
        wakesWithDryMouth: false,
      },
      restlessLegs: {
        troubleLyingStill: false,
        urgeToMoveLegs: false,
        movementRelieves: false,
        daytimeDiscomfort: false,
        legCramps: false,
        legCrampsPerWeek: null,
      },
      parasomnia: {
        nightBehaviors: [],
        remembersEvents: false,
        actsOutDreams: false,
        hasInjuredOrLeftHome: false,
        bedwetting: false,
        diagnosedParasomnia: false,
        parasomniaType: '',
        receivedTreatment: false,
        treatmentType: '',
      },
      nightmares: {
        remembersDreams: false,
        hasBadDreams: false,
        badDreamsPerWeek: null,
        hasNightmares: false,
        nightmaresPerWeek: null,
        associatedWithTrauma: false,
        historyOfTBI: false,
        takingMedicationsThatMayCause: false,
        hasBehavioralHealthDiagnosis: false,
        hasSleepAversion: false,
      },
      chronotype: {
        preference: 'flexible',
        preferenceStrength: null,
        shiftWork: false,
        shiftType: '',
        shiftDaysPerWeek: null,
        pastShiftWorkYears: null,
        frequentTimeZoneTravel: false,
        workSchoolTime: '',
      },
      sleepHygiene: {
        supplements: [],
        supplementsOther: '',
        prescriptionMeds: [],
        prescriptionMedsOther: '',
        stimulants: '',
        stimulantTime: '',
        smokesNicotine: false,
      },
      bedroom: {
        relaxing: 5,
        comfortable: 5,
        dark: 5,
        quiet: 5,
      },
      lifestyle: {
        caffeinePerDay: 0,
        lastCaffeineTime: '',
        alcoholPerWeek: 0,
        exerciseDaysPerWeek: 0,
        exerciseDuration: null,
        exerciseEndTime: '',
      },
      mentalHealth: {
        worriesAffectSleep: false,
        anxietyInBed: false,
        timeInBedTrying: false,
        cancelsAfterPoorSleep: 'never',
        diagnosedMedicalConditions: [],
        diagnosedMentalHealthConditions: [],
        currentlyReceivingTreatment: false,
      },
      sleepDisorderDiagnoses: {
        diagnosedDisorders: [],
        otherDiagnosisDescription: '',
        diagnosedOSA: false,
        osaSeverity: null,
        osaTreated: false,
        osaTreatmentType: [],
        osaTreatmentEffective: null,
        diagnosedRLS: false,
        rlsTreated: false,
        rlsTreatment: [],
        rlsTreatmentEffective: null,
      },
    },
  });

  const navigateToSection = useCallback(
    (index: number) => {
      setCurrentSectionIndex(index);
      const section = sections[index];
      if (section && onSectionChange) {
        onSectionChange(section, index);
      }
      window.scrollTo(0, 0);
    },
    [onSectionChange]
  );

  const resetScenarioState = useCallback(() => {
    setReportData(null);
    setReportLoading(false);
    setReportError(null);
  }, []);

  const resetToScenario = useCallback(
    (scenarioData: QuestionnaireFormData, scenarioIdToSet: string) => {
      form.reset(scenarioData);
      setSelectedScenarioId(scenarioIdToSet);
      resetScenarioState();
    },
    [form, resetScenarioState]
  );

  const loadScenarioAndJumpToReport = useCallback(
    (scenarioIdToLoad: string) => {
      const scenario = getDiagnosisScenario(scenarioIdToLoad) ?? defaultReviewScenario;

      resetToScenario(scenario.data, scenario.id);
      navigateToSection(sections.length - 1);
    },
    [navigateToSection, resetToScenario]
  );

  useEffect(() => {
    if (!initialScenarioId) {
      return;
    }

    setSelectedScenarioId(initialScenarioId);
  }, [initialScenarioId]);

  useEffect(() => {
    if (!prefill || reviewMode) {
      return;
    }

    resetToScenario(DEFAULT_PREFILL_DATA, defaultReviewScenario.id);
  }, [prefill, reviewMode, resetToScenario]);

  useEffect(() => {
    if (!reviewMode) {
      return;
    }

    loadScenarioAndJumpToReport(selectedScenarioId);
  }, [reviewMode, selectedScenarioId, loadScenarioAndJumpToReport]);

  useEffect(() => {
    if (
      currentSection === 'report' &&
      !reportData &&
      !reportLoading &&
      !reportError &&
      shouldAutoGenerateReport
    ) {
      handleGenerateReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSection, shouldAutoGenerateReport, reportData, reportLoading, reportError]);

  function handleNext() {
    if (currentSectionIndex < sections.length - 1) {
      navigateToSection(currentSectionIndex + 1);
    }
  }

  function handlePrevious() {
    if (currentSectionIndex > 0) {
      navigateToSection(currentSectionIndex - 1);
    }
  }

  async function handleGenerateReport() {
    const data = form.getValues();
    setReportLoading(true);
    setReportError(null);

    if (shouldPersistResponses) {
      // Save response to database (fire-and-forget — non-blocking)
      fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch(err => console.error('Error saving questionnaire response:', err));
    }

    try {
      const diagnoseUrl = shouldIncludeBreakdown ? '/api/diagnose?debug=1' : '/api/diagnose';
      const response = await fetch(diagnoseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Diagnosis request failed');
      }

      const result: FullReportResult = await response.json();
      setReportData(result);
    } catch (error) {
      console.error('Error generating diagnosis:', error);
      setReportError('Unable to generate your report. Please try again.');
      return;
    } finally {
      setReportLoading(false);
    }

    handleNext();
  }

  // Function to handle PDF generation
  const handleGeneratePDF = async () => {
    const formData = form.getValues();

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: formData,
          // Use a generic greeting since we don't collect names
          userName: 'Patient',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sleep-report-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  function handlePreFill() {
    loadScenarioAndJumpToReport(selectedScenarioId);
  }

  function handleScenarioSelectionChange(nextScenarioId: string) {
    setSelectedScenarioId(nextScenarioId);
    onScenarioChange?.(nextScenarioId);
  }

  function getScenarioHighlights(scenario: DiagnosisScenario): string[] {
    const highlights: string[] = [];

    if (scenario.expected.hasInsomnia) {
      highlights.push(`Insomnia: ${scenario.expected.insomniaSeverity}`);
    }
    if (scenario.expected.hasOSA) {
      highlights.push('Probable OSA');
    }
    if (scenario.expected.hasCOMISA) {
      highlights.push('COMISA');
    }
    if (scenario.expected.hasRLS) {
      highlights.push('RLS');
    }
    if (scenario.expected.hasNightmares) {
      highlights.push('Nightmares');
    }
    if (scenario.expected.hasNarcolepsy) {
      highlights.push('Narcolepsy screen');
    }
    if (scenario.expected.hasEDS) {
      highlights.push('EDS');
    }
    if (scenario.expected.hasInsufficientSleep) {
      highlights.push('Insufficient sleep');
    }
    if (scenario.expected.hasChronicFatigueSymptoms) {
      highlights.push('Chronic fatigue');
    }
    if (scenario.expected.hasPainRelatedSleepDisturbance) {
      highlights.push('Pain-related sleep');
    }
    if (scenario.expected.hasMildRespiratoryDisturbance) {
      highlights.push('Mild respiratory');
    }

    if (highlights.length === 0) {
      highlights.push('No major report flags expected');
    }

    return highlights.slice(0, 3);
  }

  const renderSection = () => {
    switch (currentSection) {
      case 'intro':
        return <IntroSection form={form} />;
      case 'demographics':
        return <DemographicsSection form={form} />;
      case 'daytime':
        return <DaytimeSection form={form} />;
      case 'scheduled-sleep':
        return <ScheduledSleepSection form={form} />;
      case 'unscheduled-sleep':
        return <UnscheduledSleepSection form={form} />;
      case 'breathing-disorders':
        return <BreathingDisordersSection form={form} />;
      case 'restless-legs':
        return <RestlessLegsSection form={form} />;
      case 'parasomnia':
        return <ParasomniaSection form={form} />;
      case 'nightmares':
        return <NightmaresSection form={form} />;
      case 'chronotype':
        return <ChronotypeSection form={form} />;
      case 'sleep-hygiene':
        return <SleepHygieneSection form={form} />;
      case 'bedroom':
        return <BedroomSection form={form} />;
      case 'lifestyle':
        return <LifestyleSection form={form} />;
      case 'mental-health':
        return <MentalHealthSection form={form} />;
      case 'sleep-disorder-diagnoses':
        return <SleepDisorderDiagnosesSection form={form} />;
      case 'report':
        if (reportLoading) {
          return (
            <div className='flex flex-col items-center justify-center space-y-4 py-16'>
              <div className='border-primary h-12 w-12 animate-spin rounded-full border-b-2' />
              <p className='text-muted-foreground text-sm'>Generating your sleep report…</p>
            </div>
          );
        }
        if (reportError) {
          return (
            <div className='flex flex-col items-center justify-center space-y-4 py-16'>
              <p className='text-sm text-red-600'>{reportError}</p>
              <Button onClick={handleGenerateReport} variant='outline' size='sm'>
                Try Again
              </Button>
            </div>
          );
        }
        if (!reportData) {
          return null;
        }
        return (
          <ReportSection
            data={form.getValues()}
            report={reportData}
            onDownloadPDF={handleGeneratePDF}
            reviewMode={reviewMode}
            reviewScenario={reviewMode ? activeScenario : undefined}
          />
        );
      default:
        return null;
    }
  };

  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSection === 'report';
  const isSecondToLast = currentSectionIndex === sections.length - 2;

  // Watch fields for section-specific validation
  const acceptedDisclaimer = form.watch('intro.acceptedDisclaimer');
  const yearOfBirth = form.watch('demographics.yearOfBirth');
  const sex = form.watch('demographics.sex');
  const zipcode = form.watch('demographics.zipcode');

  // Determine if Continue should be disabled based on current section
  const isContinueDisabled = (() => {
    if (currentSection === 'intro') {
      return !acceptedDisclaimer;
    }
    if (currentSection === 'demographics') {
      // Require yearOfBirth, sex, and zipcode (min 5 chars)
      return !yearOfBirth || !sex || !zipcode || zipcode.length < 5;
    }
    return false;
  })();

  return (
    <div className='bg-gradient-sleep relative min-h-screen py-8 md:py-12'>
      {/* Subtle decorative background elements */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='bg-primary/5 absolute -top-24 -right-24 h-96 w-96 rounded-full blur-3xl' />
        <div className='bg-accent/10 absolute top-1/3 -left-24 h-72 w-72 rounded-full blur-3xl' />
        <div className='bg-primary/5 absolute right-1/4 bottom-0 h-64 w-64 rounded-full blur-3xl' />
      </div>

      <div className='relative container mx-auto max-w-3xl px-4'>
        {shouldShowScenarioTools && (
          <div className='mb-6 space-y-4'>
            <Card className='border-amber-300/40 bg-amber-50/80 shadow-sm backdrop-blur-sm'>
              <CardHeader className='space-y-2 pb-4'>
                <CardTitle className='flex items-center gap-2 text-amber-950'>
                  <TestTube className='h-5 w-5' />
                  {reviewMode ? 'Client Algorithm Review' : 'Scenario Validation Tools'}
                </CardTitle>
                <CardDescription className='text-amber-900/80'>
                  {reviewMode
                    ? 'Choose a named scenario to jump straight into the generated report and inspect the exact scoring path.'
                    : 'Load a named scenario without filling the full questionnaire by hand.'}
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                  <div className='w-full md:max-w-sm'>
                    <Select
                      value={selectedScenarioId}
                      onValueChange={handleScenarioSelectionChange}
                    >
                      <SelectTrigger className='border-amber-300/50 bg-white/90 text-amber-950'>
                        <SelectValue placeholder='Select a validation scenario' />
                      </SelectTrigger>
                      <SelectContent>
                        {diagnosisScenarios.map(scenario => (
                          <SelectItem key={scenario.id} value={scenario.id}>
                            {scenario.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {reviewMode ? (
                    <div className='rounded-lg border border-amber-300/50 bg-white/80 px-3 py-2 text-xs'>
                      <p className='font-semibold text-amber-950'>Shareable path</p>
                      <p className='font-mono text-amber-900/80'>{reviewDeepLink}</p>
                    </div>
                  ) : (
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={handlePreFill}
                      className='border-amber-300/50 bg-white/80 text-amber-700 backdrop-blur-sm hover:bg-amber-100'
                    >
                      <TestTube className='mr-2 h-4 w-4' />
                      Load Scenario & Jump to Report
                    </Button>
                  )}
                </div>

                <div className='rounded-xl border border-amber-300/40 bg-white/80 p-4'>
                  <p className='text-sm font-semibold text-amber-950'>{activeScenario.label}</p>
                  <p className='mt-1 text-sm leading-relaxed text-amber-900/80'>
                    {activeScenario.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {reviewMode && (
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-foreground text-sm font-semibold'>Scenario Index</p>
                    <p className='text-muted-foreground text-xs'>
                      Each card maps to a shareable route and expected algorithm path.
                    </p>
                  </div>
                  <p className='text-muted-foreground text-xs'>
                    {diagnosisScenarios.length} scenarios
                  </p>
                </div>
                <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
                  {diagnosisScenarios.map(scenario => {
                    const isSelected = scenario.id === selectedScenarioId;
                    const highlights = getScenarioHighlights(scenario);

                    return (
                      <button
                        key={scenario.id}
                        type='button'
                        onClick={() => handleScenarioSelectionChange(scenario.id)}
                        className={cn(
                          'bg-card text-left rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md',
                          isSelected
                            ? 'border-primary ring-primary/20 shadow-sm ring-2'
                            : 'border-border/70 hover:border-primary/40'
                        )}
                      >
                        <div className='flex items-start justify-between gap-3'>
                          <div>
                            <p className='text-foreground text-sm font-semibold'>{scenario.label}</p>
                            <p className='text-muted-foreground mt-1 text-xs leading-relaxed'>
                              {scenario.description}
                            </p>
                          </div>
                          <span
                            className={cn(
                              'inline-flex rounded-full px-2 py-1 text-[11px] font-medium',
                              isSelected
                                ? 'bg-primary/10 text-primary'
                                : 'bg-muted text-muted-foreground'
                            )}
                          >
                            {isSelected ? 'Selected' : 'Open'}
                          </span>
                        </div>

                        <div className='mt-3 flex flex-wrap gap-2'>
                          {highlights.map(highlight => (
                            <span
                              key={`${scenario.id}-${highlight}`}
                              className='bg-muted text-muted-foreground inline-flex rounded-full px-2 py-1 text-[11px] font-medium'
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>

                        <p className='text-muted-foreground mt-3 font-mono text-[11px]'>
                          /review?scenario={scenario.id}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Progress Section */}
        <div className='mb-8'>
          <div className='mb-3 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold'>
                {currentSectionIndex + 1}
              </div>
              <div>
                <p className='text-foreground/80 text-sm font-medium'>
                  Step {currentSectionIndex + 1} of {sections.length}
                </p>
                <p className='text-muted-foreground text-xs'>{sectionTitles[currentSection]}</p>
              </div>
            </div>
            <div className='text-right'>
              <p className='text-primary text-2xl font-semibold'>{Math.round(progress)}%</p>
              <p className='text-muted-foreground text-xs'>Complete</p>
            </div>
          </div>
          <div className='relative'>
            <Progress value={progress} className='h-2' />
          </div>
        </div>

        {/* Main Form Card */}
        <Card className='shadow-sleep-lg bg-card/80 overflow-hidden border-0 backdrop-blur-sm'>
          <CardHeader className='bg-gradient-sleep-header relative overflow-hidden px-6 py-8 text-white md:px-8'>
            {/* Subtle pattern overlay */}
            <div className='absolute inset-0 opacity-10'>
              <svg className='h-full w-full' xmlns='http://www.w3.org/2000/svg'>
                <defs>
                  <pattern
                    id='stars'
                    x='0'
                    y='0'
                    width='50'
                    height='50'
                    patternUnits='userSpaceOnUse'
                  >
                    <circle cx='2' cy='2' r='1' fill='currentColor' />
                    <circle cx='25' cy='30' r='0.5' fill='currentColor' />
                    <circle cx='40' cy='10' r='0.75' fill='currentColor' />
                  </pattern>
                </defs>
                <rect width='100%' height='100%' fill='url(#stars)' />
              </svg>
            </div>
            <div className='relative'>
              {/* Previous button at top of header */}
              {!isFirstSection && (
                <Button
                  type='button'
                  variant='ghost'
                  onClick={handlePrevious}
                  className='mb-2 -ml-2 gap-2 text-white/80 hover:bg-white/10 hover:text-white'
                  size='sm'
                >
                  <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 19l-7-7 7-7'
                    />
                  </svg>
                  Previous
                </Button>
              )}
              <CardTitle className='text-2xl font-semibold tracking-tight md:text-3xl'>
                {sectionTitles[currentSection]}
              </CardTitle>
              {currentSection !== 'intro' && currentSection !== 'report' && (
                <CardDescription className='mt-2 text-white/80'>
                  {reviewMode
                    ? 'Review the fixed scenario inputs used for this algorithm path.'
                    : 'Please answer all questions to the best of your ability'}
                </CardDescription>
              )}
            </div>
          </CardHeader>
          <CardContent className='px-6 py-8 md:px-8'>
            <Form {...form}>
              <form onSubmit={e => e.preventDefault()} className='space-y-8'>
                {renderSection()}

                {/* PDF Download Button - Only show on report section */}
                {currentSection === 'report' && (
                  <div className='mt-8 flex justify-center'>
                    <Button
                      type='button'
                      onClick={handleGeneratePDF}
                      size='lg'
                      className='bg-emerald-600 px-8 shadow-md hover:bg-emerald-700'
                    >
                      <Download className='mr-2 h-5 w-5' />
                      Download PDF Report
                    </Button>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className='border-border/50 flex items-center justify-between border-t pt-8'>
                  <Button
                    type='button'
                    variant='ghost'
                    onClick={handlePrevious}
                    disabled={isFirstSection}
                    className={cn(
                      'text-muted-foreground hover:text-foreground gap-2',
                      isFirstSection && 'invisible'
                    )}
                  >
                    <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 19l-7-7 7-7'
                      />
                    </svg>
                    Previous
                  </Button>

                  {isSecondToLast ? (
                    <Button
                      type='button'
                      onClick={handleGenerateReport}
                      size='lg'
                      className='ml-auto gap-2 px-6 shadow-md'
                    >
                      Generate Report
                      <svg
                        className='h-4 w-4'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                      </svg>
                    </Button>
                  ) : !isLastSection ? (
                    <Button
                      type='button'
                      onClick={handleNext}
                      size='lg'
                      disabled={isContinueDisabled}
                      className='ml-auto gap-2 px-6 shadow-md'
                    >
                      Continue
                      <svg
                        className='h-4 w-4'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 5l7 7-7 7'
                        />
                      </svg>
                    </Button>
                  ) : null}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Footer note */}
        <p className='text-muted-foreground mt-6 text-center text-xs'>
          {reviewMode
            ? 'Review mode uses fixed sample scenarios and does not save questionnaire responses.'
            : 'Your information is secure and confidential'}
        </p>
      </div>
    </div>
  );
}
