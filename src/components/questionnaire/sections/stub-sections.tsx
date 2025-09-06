// This file contains temporary exports for stub sections
// Each will be replaced with its own detailed implementation file

import { UseFormReturn } from 'react-hook-form'
import { QuestionnaireFormData } from '@/validations/questionnaire'

interface SectionProps {
  form: UseFormReturn<QuestionnaireFormData>
}

export function BreathingDisordersSection({ form: _form }: SectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sleep Breathing Disorders</h2>
      <p className="text-gray-600">Section under development</p>
    </div>
  )
}

export function RestlessLegsSection({ form: _form }: SectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Restless Legs Syndrome</h2>
      <p className="text-gray-600">Section under development</p>
    </div>
  )
}

export function ParasomniaSection({ form: _form }: SectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sleep Behaviors</h2>
      <p className="text-gray-600">Section under development</p>
    </div>
  )
}

export function NightmaresSection({ form: _form }: SectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Nightmares</h2>
      <p className="text-gray-600">Section under development</p>
    </div>
  )
}

export function ChronotypeSection({ form: _form }: SectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sleep Preferences</h2>
      <p className="text-gray-600">Section under development</p>
    </div>
  )
}

export function SleepHygieneSection({ form: _form }: SectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sleep Medications & Supplements</h2>
      <p className="text-gray-600">Section under development</p>
    </div>
  )
}

export function BedroomSection({ form: _form }: SectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Bedroom Environment</h2>
      <p className="text-gray-600">Section under development</p>
    </div>
  )
}

export function LifestyleSection({ form: _form }: SectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Lifestyle Factors</h2>
      <p className="text-gray-600">Section under development</p>
    </div>
  )
}

export function MentalHealthSection({ form: _form }: SectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Mental Health & Sleep</h2>
      <p className="text-gray-600">Section under development</p>
    </div>
  )
}

export function DemographicsSection({ form: _form }: SectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">About You</h2>
      <p className="text-gray-600">Section under development</p>
    </div>
  )
}

interface ReportSectionProps {
  data: QuestionnaireFormData
}

export function ReportSection({ data }: ReportSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Your Sleep Report</h2>
      <p className="text-gray-600">Report generation under development</p>
      <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
