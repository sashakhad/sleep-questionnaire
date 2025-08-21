import { QuestionnaireResponse } from '../validations/questionnaire';

export interface ScoringResult {
  edsScore: number;
  sleepDisorders: string[];
  healthOptimizationAreas: string[];
  riskLevel: 'low' | 'moderate' | 'high';
  recommendations: string[];
}

export function calculateEDSScore(section1: QuestionnaireResponse['section1']): number {
  let score = 0;
  
  if (section1['1.2']) {
    score += section1['1.2'].length;
    if (section1['1.2'].includes('talking') || section1['1.2'].includes('eating')) {
      score += 1; // Extra weight for high-risk situations
    }
  }
  
  return score;
}

export function detectInsomnia(section2: QuestionnaireResponse['section2']): boolean {
  const sleepOnsetTime = section2['2.2'];
  const nightWakeups = section2['2.4'];
  const earlyWaking = section2['2.7'];
  const earlyWakingMinutes = section2['2.7a'] || 0;
  
  const sleepOnsetInsomnia = sleepOnsetTime > 30;
  
  const maintenanceInsomnia = nightWakeups > 40;
  
  const earlyMorningInsomnia = earlyWaking > 2 && earlyWakingMinutes > 20;
  
  return sleepOnsetInsomnia || maintenanceInsomnia || earlyMorningInsomnia;
}

export function detectSleepApnea(section3: QuestionnaireResponse['section3']): boolean {
  const diagnosed = section3['3.1'] !== 'no';
  const symptoms = section3['3.2'] === 'yes' || section3['3.3'] === 'yes';
  
  return diagnosed || symptoms;
}

export function detectRestlessLegs(section4: QuestionnaireResponse['section4']): boolean {
  const troubleLyingStill = section4['4.1'] === 'yes';
  const urgeToMove = section4['4.2'] === 'yes';
  const movingHelps = section4['4.3'] === 'yes';
  
  const criteriaCount = [troubleLyingStill, urgeToMove, movingHelps].filter(Boolean).length;
  return criteriaCount >= 2;
}

export function detectNarcolepsy(section1: QuestionnaireResponse['section1']): boolean {
  const cataplexy = section1['1.6'] === 'yes';
  const sleepParalysis = section1['1.7'] === 'yes';
  const dreamingOnset = section1['1.5'] === 'yes';
  const diagnosed = section1['1.8'] === 'yes';
  
  return cataplexy || diagnosed || (sleepParalysis && dreamingOnset);
}

export function detectCircadianDisorder(
  section2: QuestionnaireResponse['section2'],
  section7: QuestionnaireResponse['section7']
): boolean {
  const bedtimeVariation = section2['2.1b'] === 'yes';
  const shiftWork = section7['7.2'] === 'yes';
  const timeZoneCrossing = section7['7.4'] === 'yes';
  const preference = section7['7.1'];
  
  const sleepOnsetTime = section2['2.2'];
  const latePreference = preference === 'late';
  // const earlyPreference = preference === 'early'; // Currently unused
  
  return bedtimeVariation || shiftWork || timeZoneCrossing || (latePreference && sleepOnsetTime > 30);
}

export function identifyHealthOptimizationAreas(responses: QuestionnaireResponse): string[] {
  const areas: string[] = [];
  
  if (responses.section2['2.1b'] === 'yes') {
    areas.push('irregular-sleep-schedule');
  }
  
  if (responses.section8['8.2'] < 7) {
    areas.push('bedroom-hygiene');
  }
  
  const caffeineAmount = responses.section8['8.3'];
  if (caffeineAmount > 4) {
    areas.push('caffeine-optimization');
  }
  
  const alcoholAmount = responses.section8['8.4'];
  if (alcoholAmount > 7) {
    areas.push('alcohol-optimization');
  }
  
  const exerciseFreq = responses.section8['8.5'];
  if (exerciseFreq < 3) {
    areas.push('exercise-routine');
  }
  
  if (responses.section1['1.1'] === 'yes' && responses.section1['1.1a'] && responses.section1['1.1a'] > 3) {
    areas.push('nap-optimization');
  }
  
  return areas;
}

export function scoreQuestionnaire(responses: QuestionnaireResponse): ScoringResult {
  const edsScore = calculateEDSScore(responses.section1);
  const sleepDisorders: string[] = [];
  
  if (detectInsomnia(responses.section2)) {
    sleepDisorders.push('insomnia');
  }
  
  if (detectSleepApnea(responses.section3)) {
    sleepDisorders.push('sleep-apnea');
  }
  
  if (detectRestlessLegs(responses.section4)) {
    sleepDisorders.push('restless-legs');
  }
  
  if (detectNarcolepsy(responses.section1)) {
    sleepDisorders.push('narcolepsy');
  }
  
  if (detectCircadianDisorder(responses.section2, responses.section7)) {
    sleepDisorders.push('circadian-disorder');
  }
  
  if (sleepDisorders.includes('insomnia') && sleepDisorders.includes('sleep-apnea')) {
    sleepDisorders.push('comisa');
  }
  
  const healthOptimizationAreas = identifyHealthOptimizationAreas(responses);
  
  let riskLevel: 'low' | 'moderate' | 'high' = 'low';
  if (sleepDisorders.length > 0) {
    riskLevel = sleepDisorders.length > 2 ? 'high' : 'moderate';
  } else if (healthOptimizationAreas.length > 3) {
    riskLevel = 'moderate';
  }
  
  const recommendations: string[] = [];
  if (sleepDisorders.length > 0) {
    recommendations.push('Consider consulting with a sleep specialist for proper diagnosis and treatment');
  }
  if (healthOptimizationAreas.length > 0) {
    recommendations.push('Focus on sleep hygiene improvements for better sleep quality');
  }
  
  return {
    edsScore,
    sleepDisorders,
    healthOptimizationAreas,
    riskLevel,
    recommendations
  };
}
