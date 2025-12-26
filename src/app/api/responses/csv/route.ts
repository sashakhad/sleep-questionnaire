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
function flattenQuestionnaireData(data: QuestionnaireFormData): Record<string, unknown> {
  return {
    // Daytime section
    daytime_naps_days_per_week: data.daytime.plannedNaps.daysPerWeek,
    daytime_naps_duration: data.daytime.plannedNaps.duration,
    daytime_fall_asleep_during: data.daytime.fallAsleepDuring,
    daytime_tiredness_interferes: data.daytime.tirednessInterferes,
    daytime_tiredness_severity: data.daytime.tirednessSeverity,
    daytime_tired_but_cant_sleep: data.daytime.tiredButCantSleep,
    daytime_dreams_while_falling_asleep: data.daytime.dreamsWhileFallingAsleep,
    daytime_weakness_when_excited: data.daytime.weaknessWhenExcited,
    daytime_sleep_paralysis: data.daytime.sleepParalysis,
    daytime_diagnosed_narcolepsy: data.daytime.diagnosedNarcolepsy,
    daytime_pain_affects_sleep: data.daytime.painAffectsSleep,
    daytime_pain_severity: data.daytime.painSeverity,
    daytime_muscle_joint_pain: data.daytime.muscleJointPain,
    daytime_non_restorative_sleep: data.daytime.nonRestorativeSleep,

    // Scheduled sleep section
    scheduled_lights_out_time: data.scheduledSleep.lightsOutTime,
    scheduled_lights_out_varies: data.scheduledSleep.lightsOutVaries,
    scheduled_minutes_to_fall_asleep: data.scheduledSleep.minutesToFallAsleep,
    scheduled_night_wakeups: data.scheduledSleep.nightWakeups,
    scheduled_wakeup_reasons: data.scheduledSleep.wakeupReasons,
    scheduled_minutes_awake_at_night: data.scheduledSleep.minutesAwakeAtNight,
    scheduled_wakeup_time: data.scheduledSleep.wakeupTime,
    scheduled_get_out_of_bed_time: data.scheduledSleep.getOutOfBedTime,
    scheduled_early_wakeup_days: data.scheduledSleep.earlyWakeupDays,
    scheduled_early_wakeup_minutes: data.scheduledSleep.earlyWakeupMinutes,
    scheduled_uses_alarm: data.scheduledSleep.usesAlarm,
    scheduled_planned_naps_per_week: data.scheduledSleep.plannedNapsPerWeek,
    scheduled_average_nap_minutes: data.scheduledSleep.averageNapMinutes,

    // Unscheduled sleep section
    unscheduled_lights_out_time: data.unscheduledSleep.lightsOutTime,
    unscheduled_minutes_to_fall_asleep: data.unscheduledSleep.minutesToFallAsleep,
    unscheduled_night_wakeups: data.unscheduledSleep.nightWakeups,
    unscheduled_wakeup_reasons: data.unscheduledSleep.wakeupReasons,
    unscheduled_minutes_awake_at_night: data.unscheduledSleep.minutesAwakeAtNight,
    unscheduled_wakeup_time: data.unscheduledSleep.wakeupTime,
    unscheduled_get_out_of_bed_time: data.unscheduledSleep.getOutOfBedTime,
    unscheduled_early_wakeup_days: data.unscheduledSleep.earlyWakeupDays,
    unscheduled_early_wakeup_minutes: data.unscheduledSleep.earlyWakeupMinutes,
    unscheduled_uses_alarm: data.unscheduledSleep.usesAlarm,
    unscheduled_planned_naps_per_week: data.unscheduledSleep.plannedNapsPerWeek,
    unscheduled_average_nap_minutes: data.unscheduledSleep.averageNapMinutes,

    // Breathing disorders section
    breathing_diagnosed: data.breathingDisorders.diagnosed,
    breathing_severity: data.breathingDisorders.severity,
    breathing_treatment: data.breathingDisorders.treatment,
    breathing_snores: data.breathingDisorders.snores,
    breathing_stops_breathing: data.breathingDisorders.stopsBreathing,
    breathing_mouth_breathes: data.breathingDisorders.mouthBreathes,
    breathing_wakes_dry_mouth: data.breathingDisorders.wakesWithDryMouth,

    // Restless legs section
    rls_diagnosed: data.restlessLegs.diagnosed,
    rls_treatment: data.restlessLegs.treatment,
    rls_trouble_lying_still: data.restlessLegs.troubleLyingStill,
    rls_urge_to_move_legs: data.restlessLegs.urgeToMoveLegs,
    rls_movement_relieves: data.restlessLegs.movementRelieves,
    rls_daytime_discomfort: data.restlessLegs.daytimeDiscomfort,

    // Parasomnia section
    parasomnia_night_behaviors: data.parasomnia.nightBehaviors,
    parasomnia_remembers_events: data.parasomnia.remembersEvents,
    parasomnia_acts_out_dreams: data.parasomnia.actsOutDreams,
    parasomnia_bedwetting: data.parasomnia.bedwetting,
    parasomnia_diagnosed: data.parasomnia.diagnosedParasomnia,
    parasomnia_type: data.parasomnia.parasomniaType,
    parasomnia_received_treatment: data.parasomnia.receivedTreatment,
    parasomnia_treatment_type: data.parasomnia.treatmentType,

    // Nightmares section
    nightmares_has: data.nightmares.hasNightmares,
    nightmares_per_week: data.nightmares.nightmaresPerWeek,
    nightmares_associated_trauma: data.nightmares.associatedWithTrauma,

    // Chronotype section
    chronotype_preference: data.chronotype.preference,
    chronotype_shift_work: data.chronotype.shiftWork,
    chronotype_shift_type: data.chronotype.shiftType,
    chronotype_shift_days_per_week: data.chronotype.shiftDaysPerWeek,
    chronotype_past_shift_work_years: data.chronotype.pastShiftWorkYears,
    chronotype_frequent_time_zone_travel: data.chronotype.frequentTimeZoneTravel,
    chronotype_work_school_time: data.chronotype.workSchoolTime,

    // Sleep hygiene section
    hygiene_supplements: data.sleepHygiene.supplements,
    hygiene_prescription_meds: data.sleepHygiene.prescriptionMeds,
    hygiene_stimulants: data.sleepHygiene.stimulants,
    hygiene_stimulant_time: data.sleepHygiene.stimulantTime,
    hygiene_smokes_nicotine: data.sleepHygiene.smokesNicotine,

    // Bedroom section
    bedroom_relaxing: data.bedroom.relaxing,
    bedroom_comfortable: data.bedroom.comfortable,
    bedroom_dark: data.bedroom.dark,
    bedroom_quiet: data.bedroom.quiet,

    // Lifestyle section
    lifestyle_caffeine_per_day: data.lifestyle.caffeinePerDay,
    lifestyle_last_caffeine_time: data.lifestyle.lastCaffeineTime,
    lifestyle_alcohol_wine_per_week: data.lifestyle.alcoholPerWeek.wine,
    lifestyle_alcohol_cocktails_per_week: data.lifestyle.alcoholPerWeek.cocktails,
    lifestyle_exercise_days_per_week: data.lifestyle.exerciseDaysPerWeek,
    lifestyle_exercise_duration: data.lifestyle.exerciseDuration,
    lifestyle_exercise_end_time: data.lifestyle.exerciseEndTime,

    // Mental health section
    mental_worries_affect_sleep: data.mentalHealth.worriesAffectSleep,
    mental_anxiety_in_bed: data.mentalHealth.anxietyInBed,
    mental_time_in_bed_trying: data.mentalHealth.timeInBedTrying,
    mental_cancels_after_poor_sleep: data.mentalHealth.cancelsAfterPoorSleep,
    mental_diagnosed_medical_conditions: data.mentalHealth.diagnosedMedicalConditions,
    mental_diagnosed_mental_health_conditions: data.mentalHealth.diagnosedMentalHealthConditions,
    mental_currently_receiving_treatment: data.mentalHealth.currentlyReceivingTreatment,
  };
}

export async function GET() {
  // Auth is handled by middleware
  try {
    const responses = await prisma.questionnaireResponse.findMany({
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
