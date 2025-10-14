export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface StageScore {
  score: number;
  maxScore: number;
  title: string;
  summary: string;
  details: { label: string; value: string; pass: boolean }[];
}

export interface CaseAnalysis {
  id: string;
  fileName: string;
  submittedAt: string;
  overallScore: number;
  riskLevel: RiskLevel;
  stages: {
    technical: StageScore;
    enrichment: StageScore;
    content: StageScore;
  };
  geminiSummary: string;
}