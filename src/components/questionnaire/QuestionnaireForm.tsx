'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { questionnaireSchema, type QuestionnaireFormData } from '@/validations/questionnaire';
import { type QuestionnaireSection } from '@/types/questionnaire';
import { cn } from '@/lib/utils';
import { Download, TestTube } from 'lucide-react';

// Helper to generate a response code
function generateResponseCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid confusing characters
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Mock data for pre-filling in development
const MOCK_DATA: Partial<QuestionnaireFormData> = {
  intro: {
    acceptedDisclaimer: true,
  },
  demographics: {
    yearOfBirth: 1990,
    sex: 'male',
    zipcode: '10001',
    weight: 70,
    height: 175,
    responseCode: generateResponseCode(),
  },
  daytime: {
    plannedNaps: { daysPerWeek: 2, napsPerWeek: 3, duration: '30' },
    fallAsleepDuring: ['lectures', 'evening'],
    sleepinessInterferes: true,
    sleepinessSeverity: 5,
    tiredButCantSleep: '3-5days',
    weaknessWhenExcited: [],
    sleepParalysis: false,
    diagnosedNarcolepsy: false,
    painAffectsSleep: false,
    painSeverity: null,
    jointMusclePain: false,
    nonRestorativeSleep: true,
    sleepinessRating: 4,
    tirednessRating: 5,
    fatigueRating: 3,
  },
  scheduledSleep: {
    lightsOutTime: '23:00',
    lightsOutVaries: false,
    preBedActivity: [],
    minutesToFallAsleep: '30',
    nightWakeups: 2,
    wakeupReasons: ['urinate', 'noise'],
    minutesAwakeAtNight: '30',
    wakeupTime: '07:00',
    getOutOfBedTime: '07:15',
    earlyWakeupDays: 1,
    earlyWakeupMinutes: 15,
    usesAlarm: true,
  },
  unscheduledSleep: {
    lightsOutTime: '00:30',
    minutesToFallAsleep: '20',
    nightWakeups: 1,
    wakeupReasons: ['urinate'],
    minutesAwakeAtNight: '20',
    wakeupTime: '09:00',
    getOutOfBedTime: '09:30',
    usesAlarm: false,
  },
  breathingDisorders: {
    snores: true,
    stopsBreathing: false,
    mouthBreathes: true,
    wakesWithDryMouth: true,
  },
  restlessLegs: {
    troubleLyingStill: false,
    urgeToMoveLegs: false,
    movementRelieves: false,
    daytimeDiscomfort: false,
    legCramps: false,
  },
  parasomnia: {
    nightBehaviors: [],
    remembersEvents: false,
    actsOutDreams: false,
    bedwetting: false,
    diagnosedParasomnia: false,
    parasomniaType: '',
    receivedTreatment: false,
    treatmentType: '',
  },
  nightmares: {
    hasNightmares: true,
    nightmaresPerWeek: 1,
    associatedWithTrauma: false,
  },
  chronotype: {
    preference: 'late',
    preferenceStrength: 'moderate',
    shiftWork: false,
    shiftType: '',
    shiftDaysPerWeek: 0,
    pastShiftWorkYears: 0,
    frequentTimeZoneTravel: false,
    workSchoolTime: '09:00',
  },
  sleepHygiene: {
    supplements: ['melatonin'],
    prescriptionMeds: [],
    stimulants: '',
    stimulantTime: '',
    smokesNicotine: false,
  },
  bedroom: {
    relaxing: 7,
    comfortable: 8,
    dark: 6,
    quiet: 7,
  },
  lifestyle: {
    caffeinePerDay: 2,
    lastCaffeineTime: '14:00',
    alcoholPerWeek: 3,
    exerciseDaysPerWeek: 3,
    exerciseDuration: 45,
    exerciseEndTime: '18:00',
  },
  mentalHealth: {
    worriesAffectSleep: true,
    anxietyInBed: true,
    timeInBedTrying: true,
    cancelsAfterPoorSleep: '1-2week',
    diagnosedMedicalConditions: [],
    diagnosedMentalHealthConditions: ['anxiety'],
    currentlyReceivingTreatment: false,
  },
  sleepDisorderDiagnoses: {
    diagnosedOSA: false,
    osaSeverity: null,
    osaTreated: false,
    osaTreatmentType: [],
    diagnosedRLS: false,
    rlsTreated: false,
    rlsTreatment: [],
  },
};

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

const sections: QuestionnaireSection[] = [
  'intro',
  'demographics', // Moved to after intro
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
  'sleep-disorder-diagnoses', // New section at end for OSA/RLS diagnoses
  'report',
];

const sectionTitles: Record<QuestionnaireSection, string> = {
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

export function QuestionnaireForm() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const currentSection = sections[currentSectionIndex]!;
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
        yearOfBirth: null,
        sex: null,
        zipcode: '',
        weight: null,
        height: null,
        responseCode: generateResponseCode(),
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
        sleepinessRating: null,
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
      },
      parasomnia: {
        nightBehaviors: [],
        remembersEvents: false,
        actsOutDreams: false,
        bedwetting: false,
        diagnosedParasomnia: false,
        parasomniaType: '',
        receivedTreatment: false,
        treatmentType: '',
      },
      nightmares: {
        hasNightmares: false,
        nightmaresPerWeek: null,
        associatedWithTrauma: false,
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
        prescriptionMeds: [],
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
        diagnosedOSA: false,
        osaSeverity: null,
        osaTreated: false,
        osaTreatmentType: [],
        diagnosedRLS: false,
        rlsTreated: false,
        rlsTreatment: [],
      },
    },
  });

  function handleNext() {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      window.scrollTo(0, 0);
    }
  }

  function handlePrevious() {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      window.scrollTo(0, 0);
    }
  }

  async function onSubmit(data: QuestionnaireFormData) {
    try {
      // Save to database
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error('Failed to save questionnaire response');
        // Still proceed to report even if save fails
      }
    } catch (error) {
      console.error('Error saving questionnaire response:', error);
      // Still proceed to report even if save fails
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

  // Function to pre-fill form
  const handlePreFill = () => {
    form.reset(MOCK_DATA as QuestionnaireFormData);
    // Jump to the report section to test quickly
    setCurrentSectionIndex(sections.length - 1);
  };

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
        return <ReportSection data={form.getValues()} onDownloadPDF={handleGeneratePDF} />;
      default:
        return null;
    }
  };

  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSection === 'report';
  const isSecondToLast = currentSectionIndex === sections.length - 2;

  return (
    <div className='bg-gradient-sleep relative min-h-screen py-8 md:py-12'>
      {/* Subtle decorative background elements */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='bg-primary/5 absolute -top-24 -right-24 h-96 w-96 rounded-full blur-3xl' />
        <div className='bg-accent/10 absolute top-1/3 -left-24 h-72 w-72 rounded-full blur-3xl' />
        <div className='bg-primary/5 absolute right-1/4 bottom-0 h-64 w-64 rounded-full blur-3xl' />
      </div>

      <div className='relative container mx-auto max-w-3xl px-4'>
        {/* Dev Tools - Show in development or when explicitly enabled */}
        {(process.env.NODE_ENV === 'development' ||
          process.env.NEXT_PUBLIC_SHOW_DEV_TOOLS === 'true') && (
          <div className='mb-4 flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={handlePreFill}
              className='border-amber-300/50 bg-amber-50/80 text-amber-700 backdrop-blur-sm hover:bg-amber-100'
            >
              <TestTube className='mr-2 h-4 w-4' />
              Pre-fill & Jump to Report (Dev)
            </Button>
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
                  className='absolute -top-2 left-0 gap-2 text-white/80 hover:bg-white/10 hover:text-white'
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
                  Please answer all questions to the best of your ability
                </CardDescription>
              )}
            </div>
          </CardHeader>
          <CardContent className='px-6 py-8 md:px-8'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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
                    <Button type='submit' size='lg' className='ml-auto gap-2 px-6 shadow-md'>
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
          Your information is secure and confidential
        </p>
      </div>
    </div>
  );
}
