'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { questionnaireSchema, type QuestionnaireFormData } from '@/validations/questionnaire'
import { type QuestionnaireSection } from '@/types/questionnaire'
import { cn } from '@/lib/utils'

// Import section components
import { IntroSection } from './sections/IntroSection'
import { DaytimeSection } from './sections/DaytimeSection'
import { ScheduledSleepSection } from './sections/ScheduledSleepSection'
import { UnscheduledSleepSection } from './sections/UnscheduledSleepSection'
import { BreathingDisordersSection } from './sections/BreathingDisordersSection'
import { RestlessLegsSection } from './sections/RestlessLegsSection'
import { ParasomniaSection } from './sections/ParasomniaSection'
import { NightmaresSection } from './sections/NightmaresSection'
import { ChronotypeSection } from './sections/ChronotypeSection'
import { SleepHygieneSection } from './sections/SleepHygieneSection'
import { BedroomSection } from './sections/BedroomSection'
import { LifestyleSection } from './sections/LifestyleSection'
import { MentalHealthSection } from './sections/MentalHealthSection'
import { DemographicsSection } from './sections/DemographicsSection'
import { ReportSection } from './sections/ReportSection'

const sections: QuestionnaireSection[] = [
  'intro',
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
  'demographics',
  'report'
]

const sectionTitles: Record<QuestionnaireSection, string> = {
  'intro': 'Welcome',
  'daytime': 'Daytime Feelings',
  'scheduled-sleep': 'Sleep on Work/School Days',
  'unscheduled-sleep': 'Sleep on Weekends/Free Days',
  'breathing-disorders': 'Sleep Breathing',
  'restless-legs': 'Restless Legs',
  'parasomnia': 'Sleep Behaviors',
  'nightmares': 'Nightmares',
  'chronotype': 'Sleep Preferences',
  'sleep-hygiene': 'Sleep Medications & Supplements',
  'bedroom': 'Bedroom Environment',
  'lifestyle': 'Lifestyle Factors',
  'mental-health': 'Mental Health & Sleep',
  'demographics': 'About You',
  'report': 'Your Sleep Report'
}

export function QuestionnaireForm() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const currentSection = sections[currentSectionIndex]!
  const progress = ((currentSectionIndex + 1) / sections.length) * 100

  const form = useForm<QuestionnaireFormData>({
    resolver: zodResolver(questionnaireSchema),
    mode: 'onChange',
    defaultValues: {
      daytime: {
        plannedNaps: { daysPerWeek: 0, duration: null },
        fallAsleepDuring: [],
        tirednessInterferes: false,
        tiredButCantSleep: null,
        dreamsWhileFallingAsleep: false,
        weaknessWhenExcited: [],
        sleepParalysis: false,
        diagnosedNarcolepsy: false
      },
      scheduledSleep: {
        lightsOutTime: '',
        lightsOutVaries: false,
        minutesToFallAsleep: 0,
        nightWakeups: 0,
        wakeupReasons: [],
        minutesAwakeAtNight: 0,
        wakeupTime: '',
        getOutOfBedTime: '',
        earlyWakeupDays: 0,
        earlyWakeupMinutes: null,
        usesAlarm: false,
        plannedNapsPerWeek: 0,
        averageNapMinutes: null
      },
      unscheduledSleep: {
        lightsOutTime: '',
        minutesToFallAsleep: 0,
        nightWakeups: 0,
        wakeupReasons: [],
        minutesAwakeAtNight: 0,
        wakeupTime: '',
        getOutOfBedTime: '',
        earlyWakeupDays: 0,
        earlyWakeupMinutes: null,
        usesAlarm: false,
        plannedNapsPerWeek: 0,
        averageNapMinutes: null
      },
      breathingDisorders: {
        diagnosed: false,
        severity: null,
        treatment: [],
        snores: false,
        stopsBreathing: false,
        mouthBreathes: false,
        wakesWithDryMouth: false
      },
      restlessLegs: {
        diagnosed: false,
        treatment: [],
        troubleLyingStill: false,
        urgeToMoveLegs: false,
        movementRelieves: false,
        daytimeDiscomfort: false
      },
      parasomnia: {
        nightBehaviors: [],
        remembersEvents: false,
        actsOutDreams: false,
        bedwetting: false,
        diagnosedParasomnia: false,
        parasomniaType: '',
        receivedTreatment: false,
        treatmentType: ''
      },
      nightmares: {
        hasNightmares: false,
        nightmaresPerWeek: null,
        associatedWithTrauma: false
      },
      chronotype: {
        preference: 'flexible',
        shiftWork: false,
        shiftType: '',
        shiftDaysPerWeek: null,
        pastShiftWorkYears: null,
        frequentTimeZoneTravel: false,
        workSchoolTime: ''
      },
      sleepHygiene: {
        supplements: [],
        prescriptionMeds: [],
        stimulants: '',
        stimulantTime: '',
        smokesNicotine: false
      },
      bedroom: {
        relaxing: 5,
        comfortable: 5,
        dark: 5,
        quiet: 5
      },
      lifestyle: {
        caffeinePerDay: 0,
        lastCaffeineTime: '',
        alcoholPerWeek: { wine: 0, cocktails: 0 },
        exerciseDaysPerWeek: 0,
        exerciseDuration: null,
        exerciseEndTime: ''
      },
      mentalHealth: {
        worriesAffectSleep: false,
        anxietyInBed: false,
        timeInBedTrying: false,
        cancelsAfterPoorSleep: 'never'
      },
      demographics: {
        weight: null,
        height: null,
        age: null,
        zipcode: ''
      }
    }
  })

  function handleNext() {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1)
      window.scrollTo(0, 0)
    }
  }

  function handlePrevious() {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1)
      window.scrollTo(0, 0)
    }
  }

  async function onSubmit(data: QuestionnaireFormData) {
    // Here we would normally send to API
    // For now, just go to report - data is available for report
    void data // Using data
    handleNext()
  }

  const renderSection = () => {
    switch (currentSection) {
      case 'intro':
        return <IntroSection />
      case 'daytime':
        return <DaytimeSection form={form} />
      case 'scheduled-sleep':
        return <ScheduledSleepSection form={form} />
      case 'unscheduled-sleep':
        return <UnscheduledSleepSection form={form} />
      case 'breathing-disorders':
        return <BreathingDisordersSection form={form} />
      case 'restless-legs':
        return <RestlessLegsSection form={form} />
      case 'parasomnia':
        return <ParasomniaSection form={form} />
      case 'nightmares':
        return <NightmaresSection form={form} />
      case 'chronotype':
        return <ChronotypeSection form={form} />
      case 'sleep-hygiene':
        return <SleepHygieneSection form={form} />
      case 'bedroom':
        return <BedroomSection form={form} />
      case 'lifestyle':
        return <LifestyleSection form={form} />
      case 'mental-health':
        return <MentalHealthSection form={form} />
      case 'demographics':
        return <DemographicsSection form={form} />
      case 'report':
        return <ReportSection data={form.getValues()} />
      default:
        return null
    }
  }

  const isFirstSection = currentSectionIndex === 0
  const isLastSection = currentSection === 'report'
  const isSecondToLast = currentSectionIndex === sections.length - 2

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm text-gray-600">
            <span>Section {currentSectionIndex + 1} of {sections.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Form Card */}
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="text-2xl">
              {sectionTitles[currentSection]}
            </CardTitle>
            {currentSection !== 'intro' && currentSection !== 'report' && (
              <CardDescription className="text-blue-100">
                Please answer all questions to the best of your ability
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {renderSection()}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={isFirstSection}
                    className={cn(isFirstSection && 'invisible')}
                  >
                    Previous
                  </Button>

                  {isSecondToLast ? (
                    <Button type="submit" className="ml-auto">
                      Generate Report
                    </Button>
                  ) : !isLastSection ? (
                    <Button 
                      type="button" 
                      onClick={handleNext}
                      className="ml-auto"
                    >
                      Next Section
                    </Button>
                  ) : null}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
