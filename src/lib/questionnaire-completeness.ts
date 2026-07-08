import type { QuestionnaireFormData } from '@/validations/questionnaire';

export function hasSufficientAnswers(data: QuestionnaireFormData): boolean {
  const coreTimes = [
    data.scheduledSleep.lightsOutTime,
    data.scheduledSleep.wakeupTime,
    data.unscheduledSleep.lightsOutTime,
    data.unscheduledSleep.wakeupTime,
  ];

  if (coreTimes.some(time => !time || time === '')) {
    return false;
  }

  const hasAnyDaytimeRating =
    data.daytime.tirednessRating !== null ||
    data.daytime.fatigueRating !== null ||
    data.daytime.sleepinessSeverity !== null;

  return hasAnyDaytimeRating;
}
