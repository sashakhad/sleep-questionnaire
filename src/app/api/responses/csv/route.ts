import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { QuestionnaireFormData } from '@/validations/questionnaire';

// Escape CSV values to handle commas, quotes, and newlines
function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (Array.isArray(value)) {
    return escapeCsvValue(value.join('; '));
  }
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Flatten the questionnaire data for CSV export
// Uses optional chaining to handle missing sections in older records
function flattenQuestionnaireData(data: QuestionnaireFormData): Record<string, unknown> {
  return {
    // Demographics section
    demographics_year_of_birth: data.demographics?.yearOfBirth ?? null,
    demographics_sex: data.demographics?.sex ?? null,
    demographics_zipcode: data.demographics?.zipcode ?? null,
    demographics_weight: data.demographics?.weight ?? null,
    demographics_height: data.demographics?.height ?? null,

    // Daytime section
    daytime_naps_days_per_week: data.daytime?.plannedNaps?.daysPerWeek ?? null,
    daytime_naps_per_week: data.daytime?.plannedNaps?.napsPerWeek ?? null,
    daytime_naps_duration: data.daytime?.plannedNaps?.duration ?? null,
    daytime_fall_asleep_during: data.daytime?.fallAsleepDuring ?? null,
    daytime_sleepiness_interferes: data.daytime?.sleepinessInterferes ?? null,
    daytime_sleepiness_severity: data.daytime?.sleepinessSeverity ?? null,
    daytime_tired_but_cant_sleep: data.daytime?.tiredButCantSleep ?? null,
    daytime_weakness_when_excited: data.daytime?.weaknessWhenExcited ?? null,
    daytime_sleep_paralysis: data.daytime?.sleepParalysis ?? null,
    daytime_diagnosed_narcolepsy: data.daytime?.diagnosedNarcolepsy ?? null,
    daytime_pain_affects_sleep: data.daytime?.painAffectsSleep ?? null,
    daytime_pain_severity: data.daytime?.painSeverity ?? null,
    daytime_joint_muscle_pain: data.daytime?.jointMusclePain ?? null,
    daytime_non_restorative_sleep: data.daytime?.nonRestorativeSleep ?? null,
    daytime_sleepiness_rating: data.daytime?.sleepinessRating ?? null,
    daytime_tiredness_rating: data.daytime?.tirednessRating ?? null,
    daytime_fatigue_rating: data.daytime?.fatigueRating ?? null,

    // Scheduled sleep section
    scheduled_lights_out_time: data.scheduledSleep?.lightsOutTime ?? null,
    scheduled_lights_out_varies: data.scheduledSleep?.lightsOutVaries ?? null,
    scheduled_pre_bed_activity: data.scheduledSleep?.preBedActivity ?? null,
    scheduled_minutes_to_fall_asleep: data.scheduledSleep?.minutesToFallAsleep ?? null,
    scheduled_night_wakeups: data.scheduledSleep?.nightWakeups ?? null,
    scheduled_wakeup_reasons: data.scheduledSleep?.wakeupReasons ?? null,
    scheduled_minutes_awake_at_night: data.scheduledSleep?.minutesAwakeAtNight ?? null,
    scheduled_wakeup_time: data.scheduledSleep?.wakeupTime ?? null,
    scheduled_get_out_of_bed_time: data.scheduledSleep?.getOutOfBedTime ?? null,
    scheduled_early_wakeup_days: data.scheduledSleep?.earlyWakeupDays ?? null,
    scheduled_early_wakeup_minutes: data.scheduledSleep?.earlyWakeupMinutes ?? null,
    scheduled_uses_alarm: data.scheduledSleep?.usesAlarm ?? null,

    // Unscheduled sleep section
    unscheduled_lights_out_time: data.unscheduledSleep?.lightsOutTime ?? null,
    unscheduled_minutes_to_fall_asleep: data.unscheduledSleep?.minutesToFallAsleep ?? null,
    unscheduled_night_wakeups: data.unscheduledSleep?.nightWakeups ?? null,
    unscheduled_wakeup_reasons: data.unscheduledSleep?.wakeupReasons ?? null,
    unscheduled_minutes_awake_at_night: data.unscheduledSleep?.minutesAwakeAtNight ?? null,
    unscheduled_wakeup_time: data.unscheduledSleep?.wakeupTime ?? null,
    unscheduled_get_out_of_bed_time: data.unscheduledSleep?.getOutOfBedTime ?? null,
    unscheduled_uses_alarm: data.unscheduledSleep?.usesAlarm ?? null,

    // Breathing disorders section (symptoms only)
    breathing_snores: data.breathingDisorders?.snores ?? null,
    breathing_stops_breathing: data.breathingDisorders?.stopsBreathing ?? null,
    breathing_mouth_breathes: data.breathingDisorders?.mouthBreathes ?? null,
    breathing_wakes_dry_mouth: data.breathingDisorders?.wakesWithDryMouth ?? null,

    // Restless legs section (symptoms only)
    rls_trouble_lying_still: data.restlessLegs?.troubleLyingStill ?? null,
    rls_urge_to_move_legs: data.restlessLegs?.urgeToMoveLegs ?? null,
    rls_movement_relieves: data.restlessLegs?.movementRelieves ?? null,
    rls_daytime_discomfort: data.restlessLegs?.daytimeDiscomfort ?? null,
    rls_leg_cramps: data.restlessLegs?.legCramps ?? null,

    // Parasomnia section
    parasomnia_night_behaviors: data.parasomnia?.nightBehaviors ?? null,
    parasomnia_remembers_events: data.parasomnia?.remembersEvents ?? null,
    parasomnia_acts_out_dreams: data.parasomnia?.actsOutDreams ?? null,
    parasomnia_bedwetting: data.parasomnia?.bedwetting ?? null,
    parasomnia_diagnosed: data.parasomnia?.diagnosedParasomnia ?? null,
    parasomnia_type: data.parasomnia?.parasomniaType ?? null,
    parasomnia_received_treatment: data.parasomnia?.receivedTreatment ?? null,
    parasomnia_treatment_type: data.parasomnia?.treatmentType ?? null,

    // Nightmares section
    nightmares_has: data.nightmares?.hasNightmares ?? null,
    nightmares_per_week: data.nightmares?.nightmaresPerWeek ?? null,
    nightmares_associated_trauma: data.nightmares?.associatedWithTrauma ?? null,

    // Chronotype section
    chronotype_preference: data.chronotype?.preference ?? null,
    chronotype_preference_strength: data.chronotype?.preferenceStrength ?? null,
    chronotype_shift_work: data.chronotype?.shiftWork ?? null,
    chronotype_shift_type: data.chronotype?.shiftType ?? null,
    chronotype_shift_days_per_week: data.chronotype?.shiftDaysPerWeek ?? null,
    chronotype_past_shift_work_years: data.chronotype?.pastShiftWorkYears ?? null,
    chronotype_frequent_time_zone_travel: data.chronotype?.frequentTimeZoneTravel ?? null,
    chronotype_work_school_time: data.chronotype?.workSchoolTime ?? null,

    // Sleep hygiene section
    hygiene_supplements: data.sleepHygiene?.supplements ?? null,
    hygiene_prescription_meds: data.sleepHygiene?.prescriptionMeds ?? null,
    hygiene_stimulants: data.sleepHygiene?.stimulants ?? null,
    hygiene_stimulant_time: data.sleepHygiene?.stimulantTime ?? null,
    hygiene_smokes_nicotine: data.sleepHygiene?.smokesNicotine ?? null,

    // Bedroom section
    bedroom_relaxing: data.bedroom?.relaxing ?? null,
    bedroom_comfortable: data.bedroom?.comfortable ?? null,
    bedroom_dark: data.bedroom?.dark ?? null,
    bedroom_quiet: data.bedroom?.quiet ?? null,

    // Lifestyle section
    lifestyle_caffeine_per_day: data.lifestyle?.caffeinePerDay ?? null,
    lifestyle_last_caffeine_time: data.lifestyle?.lastCaffeineTime ?? null,
    lifestyle_alcohol_per_week: data.lifestyle?.alcoholPerWeek ?? null,
    lifestyle_exercise_days_per_week: data.lifestyle?.exerciseDaysPerWeek ?? null,
    lifestyle_exercise_duration: data.lifestyle?.exerciseDuration ?? null,
    lifestyle_exercise_end_time: data.lifestyle?.exerciseEndTime ?? null,

    // Mental health section
    mental_worries_affect_sleep: data.mentalHealth?.worriesAffectSleep ?? null,
    mental_anxiety_in_bed: data.mentalHealth?.anxietyInBed ?? null,
    mental_time_in_bed_trying: data.mentalHealth?.timeInBedTrying ?? null,
    mental_cancels_after_poor_sleep: data.mentalHealth?.cancelsAfterPoorSleep ?? null,
    mental_diagnosed_medical_conditions: data.mentalHealth?.diagnosedMedicalConditions ?? null,
    mental_diagnosed_mental_health_conditions: data.mentalHealth?.diagnosedMentalHealthConditions ?? null,
    mental_currently_receiving_treatment: data.mentalHealth?.currentlyReceivingTreatment ?? null,

    // Sleep disorder diagnoses section
    sleep_disorder_diagnosed_osa: data.sleepDisorderDiagnoses?.diagnosedOSA ?? null,
    sleep_disorder_osa_severity: data.sleepDisorderDiagnoses?.osaSeverity ?? null,
    sleep_disorder_osa_treated: data.sleepDisorderDiagnoses?.osaTreated ?? null,
    sleep_disorder_osa_treatment_type: data.sleepDisorderDiagnoses?.osaTreatmentType ?? null,
    sleep_disorder_diagnosed_rls: data.sleepDisorderDiagnoses?.diagnosedRLS ?? null,
    sleep_disorder_rls_treated: data.sleepDisorderDiagnoses?.rlsTreated ?? null,
    sleep_disorder_rls_treatment: data.sleepDisorderDiagnoses?.rlsTreatment ?? null,
  };
}

export async function GET(request: Request) {
  // Auth is handled by middleware
  try {
    const url = new URL(request.url);

    // Parse optional pagination/limit parameters for CSV export
    // Default to 10000 rows max to prevent memory exhaustion
    const rawLimit = parseInt(url.searchParams.get('limit') || '10000', 10);
    const limit = Number.isNaN(rawLimit) || rawLimit < 1 ? 10000 : Math.min(rawLimit, 10000);

    const rawOffset = parseInt(url.searchParams.get('offset') || '0', 10);
    const offset = Number.isNaN(rawOffset) || rawOffset < 0 ? 0 : rawOffset;

    const responses = await prisma.questionnaireResponse.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        yearOfBirth: true,
        sex: true,
        zipcode: true,
        weight: true,
        height: true,
        createdAt: true,
        rawData: true,
      },
    });

    // Define headers - basic info + all questionnaire fields
    const basicHeaders = [
      'id',
      'year_of_birth',
      'sex',
      'zipcode',
      'weight_lbs',
      'height_inches',
      'submitted_date',
      'submitted_time',
    ];

    // Get questionnaire field headers from the first response with data
    const firstWithData = responses.find(r => r.rawData);
    const questionnaireHeaders = firstWithData
      ? Object.keys(flattenQuestionnaireData(firstWithData.rawData as QuestionnaireFormData))
      : [];

    const allHeaders = [...basicHeaders, ...questionnaireHeaders];

    // Build rows
    const rows = responses.map(response => {
      const date = new Date(response.createdAt);
      const basicData: Record<string, unknown> = {
        id: response.id,
        year_of_birth: response.yearOfBirth,
        sex: response.sex,
        zipcode: response.zipcode,
        weight_lbs: response.weight,
        height_inches: response.height,
        submitted_date: date.toISOString().split('T')[0],
        submitted_time: date.toTimeString().split(' ')[0],
      };

      // Flatten questionnaire data if available
      const questionnaireData = response.rawData
        ? flattenQuestionnaireData(response.rawData as QuestionnaireFormData)
        : {};

      // Create row in header order
      return allHeaders.map(header => {
        const value = header in basicData ? basicData[header] : questionnaireData[header];
        return value;
      });
    });

    const csvLines = [
      allHeaders.map(escapeCsvValue).join(','),
      ...rows.map(row => row.map(escapeCsvValue).join(',')),
    ];

    const csv = csvLines.join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="questionnaire-responses-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error generating CSV:', error);
    return NextResponse.json({ error: 'Failed to generate CSV' }, { status: 500 });
  }
}
