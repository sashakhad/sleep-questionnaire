import { QuestionnaireResponse } from '../validations/questionnaire';
import { ScoringResult } from './scoring';

export interface ReportSection {
  title: string;
  content: string;
  links?: Array<{ text: string; url: string }>;
}

export interface NarrativeReport {
  summary: string;
  sections: ReportSection[];
  nextSteps: string[];
}

const DISORDER_MESSAGES = {
  'insomnia': {
    title: 'Insomnia Symptoms Detected',
    content: 'Your responses suggest you may be experiencing insomnia, which involves difficulty falling asleep, staying asleep, or waking up too early. This is one of the most common sleep disorders and is highly treatable.',
    links: [
      { text: 'Learn about insomnia treatment options', url: 'https://somnahealth.com/insomnia-treatment' },
      { text: 'Find a sleep specialist near you', url: 'https://somnahealth.com/find-specialist' }
    ]
  },
  'sleep-apnea': {
    title: 'Sleep Apnea Risk Identified',
    content: 'Your symptoms suggest you may have sleep apnea, a condition where breathing repeatedly stops and starts during sleep. This can significantly impact your health and requires medical evaluation.',
    links: [
      { text: 'Understanding sleep apnea', url: 'https://somnahealth.com/sleep-apnea' },
      { text: 'Schedule a sleep study', url: 'https://somnahealth.com/sleep-study' }
    ]
  },
  'restless-legs': {
    title: 'Restless Legs Syndrome Indicators',
    content: 'You may have Restless Legs Syndrome (RLS), which causes uncomfortable sensations in your legs and an irresistible urge to move them. This condition is treatable and can significantly improve with proper care.',
    links: [
      { text: 'RLS treatment options', url: 'https://somnahealth.com/restless-legs' },
      { text: 'Lifestyle changes for RLS', url: 'https://somnahealth.com/rls-lifestyle' }
    ]
  },
  'narcolepsy': {
    title: 'Narcolepsy Symptoms Present',
    content: 'Your responses indicate possible narcolepsy, a neurological disorder that affects your brain\'s ability to control sleep-wake cycles. This requires immediate medical attention from a sleep specialist.',
    links: [
      { text: 'Narcolepsy diagnosis and treatment', url: 'https://somnahealth.com/narcolepsy' },
      { text: 'Find a neurologist specializing in sleep', url: 'https://somnahealth.com/find-neurologist' }
    ]
  },
  'circadian-disorder': {
    title: 'Circadian Rhythm Disorder',
    content: 'Your sleep patterns suggest a circadian rhythm disorder, where your internal body clock is misaligned with your desired sleep schedule. This can often be improved with light therapy and sleep schedule adjustments.',
    links: [
      { text: 'Circadian rhythm treatments', url: 'https://somnahealth.com/circadian-treatment' },
      { text: 'Light therapy guidance', url: 'https://somnahealth.com/light-therapy' }
    ]
  },
  'comisa': {
    title: 'COMISA - Combined Sleep Disorders',
    content: 'You appear to have both insomnia and sleep apnea (COMISA), which requires specialized treatment addressing both conditions simultaneously. This combination is more complex but very treatable.',
    links: [
      { text: 'COMISA treatment approaches', url: 'https://somnahealth.com/comisa' },
      { text: 'Comprehensive sleep evaluation', url: 'https://somnahealth.com/comprehensive-evaluation' }
    ]
  }
};

const OPTIMIZATION_MESSAGES = {
  'irregular-sleep-schedule': {
    title: 'Sleep Schedule Optimization',
    content: 'Your sleep schedule varies significantly, which can disrupt your circadian rhythm. Maintaining consistent bedtimes and wake times can dramatically improve your sleep quality.',
    links: [
      { text: 'Creating a consistent sleep schedule', url: 'https://somnahealth.com/sleep-schedule' },
      { text: 'Sleep hygiene tips', url: 'https://somnahealth.com/sleep-hygiene' }
    ]
  },
  'bedroom-hygiene': {
    title: 'Bedroom Environment Improvement',
    content: 'Your bedroom environment could be optimized for better sleep. The ideal sleep environment is cool, dark, quiet, and comfortable.',
    links: [
      { text: 'Optimizing your bedroom for sleep', url: 'https://somnahealth.com/bedroom-optimization' },
      { text: 'Sleep environment checklist', url: 'https://somnahealth.com/bedroom-checklist' }
    ]
  },
  'caffeine-optimization': {
    title: 'Caffeine Management',
    content: 'Your caffeine consumption may be affecting your sleep. Consider reducing intake and avoiding caffeine after 2 PM to improve sleep quality.',
    links: [
      { text: 'Caffeine and sleep guide', url: 'https://somnahealth.com/caffeine-sleep' },
      { text: 'Healthy caffeine alternatives', url: 'https://somnahealth.com/caffeine-alternatives' }
    ]
  },
  'alcohol-optimization': {
    title: 'Alcohol and Sleep',
    content: 'Alcohol consumption can significantly disrupt sleep quality, even if it initially makes you feel drowsy. Reducing alcohol intake can lead to more restorative sleep.',
    links: [
      { text: 'How alcohol affects sleep', url: 'https://somnahealth.com/alcohol-sleep' },
      { text: 'Healthy evening routines', url: 'https://somnahealth.com/evening-routine' }
    ]
  },
  'exercise-routine': {
    title: 'Exercise and Sleep Connection',
    content: 'Regular exercise can significantly improve sleep quality, but timing matters. Aim for at least 150 minutes of moderate exercise per week, finishing at least 3 hours before bedtime.',
    links: [
      { text: 'Exercise for better sleep', url: 'https://somnahealth.com/exercise-sleep' },
      { text: 'Sleep-friendly workout routines', url: 'https://somnahealth.com/sleep-workouts' }
    ]
  },
  'nap-optimization': {
    title: 'Strategic Napping',
    content: 'Your napping patterns may be interfering with nighttime sleep. Strategic napping (20-30 minutes before 3 PM) can be beneficial, but longer or later naps can disrupt your sleep drive.',
    links: [
      { text: 'Healthy napping guidelines', url: 'https://somnahealth.com/healthy-napping' },
      { text: 'Alternatives to napping', url: 'https://somnahealth.com/nap-alternatives' }
    ]
  }
};

export function generateNarrativeReport(
  responses: QuestionnaireResponse,
  scoring: ScoringResult
): NarrativeReport {
  const sections: ReportSection[] = [];
  const nextSteps: string[] = [];
  
  let summary = '';
  if (scoring.sleepDisorders.length > 0) {
    summary = `Based on your responses, you may have symptoms consistent with ${scoring.sleepDisorders.length} sleep disorder(s). `;
    summary += `We recommend consulting with a healthcare professional for proper evaluation and treatment.`;
  } else if (scoring.healthOptimizationAreas.length > 0) {
    summary = `Your sleep patterns show opportunities for optimization in ${scoring.healthOptimizationAreas.length} area(s). `;
    summary += `With some targeted improvements, you can enhance your sleep quality and overall well-being.`;
  } else {
    summary = `Your responses suggest generally healthy sleep patterns. Continue maintaining good sleep hygiene practices.`;
  }
  
  scoring.sleepDisorders.forEach(disorder => {
    const message = DISORDER_MESSAGES[disorder as keyof typeof DISORDER_MESSAGES];
    if (message) {
      sections.push(message);
      nextSteps.push(`Consult with a sleep specialist about ${disorder.replace('-', ' ')}`);
    }
  });
  
  scoring.healthOptimizationAreas.forEach(area => {
    const message = OPTIMIZATION_MESSAGES[area as keyof typeof OPTIMIZATION_MESSAGES];
    if (message) {
      sections.push(message);
      nextSteps.push(`Implement ${area.replace('-', ' ')} improvements`);
    }
  });
  
  if (scoring.riskLevel === 'high') {
    nextSteps.unshift('Schedule an appointment with a sleep medicine physician as soon as possible');
  } else if (scoring.riskLevel === 'moderate') {
    nextSteps.push('Consider keeping a sleep diary for 2 weeks to track patterns');
  }
  
  sections.push({
    title: 'Additional Resources',
    content: 'For more comprehensive sleep health information and to connect with our network of sleep specialists, visit our website.',
    links: [
      { text: 'Somna Health Sleep Education Center', url: 'https://somnahealth.com/education' },
      { text: 'Find a Sleep Specialist', url: 'https://somnahealth.com/find-specialist' },
      { text: 'Sleep Health Blog', url: 'https://somnahealth.com/blog' },
      { text: 'Download Sleep Tracking Apps', url: 'https://somnahealth.com/apps' }
    ]
  });
  
  return {
    summary,
    sections,
    nextSteps
  };
}

export function formatReportForDisplay(report: NarrativeReport): string {
  let formatted = `# Your Sleep Health Assessment Results\n\n`;
  formatted += `## Summary\n${report.summary}\n\n`;
  
  report.sections.forEach(section => {
    formatted += `## ${section.title}\n`;
    formatted += `${section.content}\n\n`;
    
    if (section.links && section.links.length > 0) {
      formatted += `**Helpful Resources:**\n`;
      section.links.forEach(link => {
        formatted += `- [${link.text}](${link.url})\n`;
      });
      formatted += `\n`;
    }
  });
  
  if (report.nextSteps.length > 0) {
    formatted += `## Recommended Next Steps\n`;
    report.nextSteps.forEach((step, index) => {
      formatted += `${index + 1}. ${step}\n`;
    });
    formatted += `\n`;
  }
  
  formatted += `---\n\n`;
  formatted += `*This assessment is for educational purposes only and does not constitute medical advice. `;
  formatted += `Please consult with a qualified healthcare professional for proper diagnosis and treatment.*\n\n`;
  formatted += `*Generated by Somna Health Sleep Assessment Tool*`;
  
  return formatted;
}
