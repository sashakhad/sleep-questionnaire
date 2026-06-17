export type SeverityLevel = 'none' | 'mild' | 'moderate' | 'severe' | 'moderate-to-severe';

export interface ReportDisplayMetrics {
  scheduledTST: number;
  unscheduledTST: number;
  scheduledSE: number;
  unscheduledSE: number;
  scheduledSOL: number;
  unscheduledSOL: number;
  scheduledWASO: number;
  unscheduledWASO: number;
  midSleepScheduled: string;
  midSleepUnscheduled: string;
  weeklyAvgTST: number;
  socialJetLag: number;
  midSleepTimeChange: number;
}

export type InsomniaSeverityLabel = 'none' | 'mild' | 'moderate-to-severe';
export type ChronotypeType = 'delayed' | 'advanced' | 'normal';

export interface ScoringMetric {
  label: string;
  value: string;
  note?: string;
}

export interface ScoringCriterion {
  label: string;
  actual: string;
  threshold?: string;
  met: boolean;
}

export interface DiagnosticBreakdown {
  id: string;
  label: string;
  outcome: string;
  criteria: ScoringCriterion[];
  notes?: string[];
}

export interface ScoringBreakdown {
  metrics: ScoringMetric[];
  diagnoses: DiagnosticBreakdown[];
}

export interface FullReportResult {
  metrics: ReportDisplayMetrics;
  chronotypeLabel: string;
  chronotypeType: ChronotypeType;
  edsScore: number;
  edsSeverity: SeverityLevel;
  hasEDSFromNaps: boolean;
  hasInsomnia: boolean;
  insomniaSeverity: InsomniaSeverityLabel;
  hasOSA: boolean;
  hasCOMISA: boolean;
  hasRLS: boolean;
  hasNightmares: boolean;
  hasBadDreamWarning: boolean;
  hasNarcolepsy: boolean;
  hasAnxiety: boolean;
  hasEDS: boolean;
  hasInsufficientSleep: boolean;
  hasMildRespiratoryDisturbance: boolean;
  hasPoorHygiene: boolean;
  hasLegCrampsConcern: boolean;
  hasChronicFatigueSymptoms: boolean;
  hasPainAffectingSleep: boolean;
  hasPainRelatedSleepDisturbance: boolean;
  hasMedicationRelatedSleepDisturbance: boolean;
  osaTreatmentIneffective: boolean;
  rlsTreatmentIneffective: boolean;
  hasDiagnosedOSA: boolean;
  hasDiagnosedRLS: boolean;
  hasSevereTiredness: boolean;
  hasParasomniaSafetyRisk: boolean;
  hasMedicationAlcoholRisk: boolean;
  avgWeeklySleep: number;
  algorithmBreakdown?: ScoringBreakdown;
}
