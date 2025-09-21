/**
 * Investment Memo Models
 * 
 * Defines the structure for AI-generated and curated investment memos.
 * Includes Stage 1 (AI-generated) and Stage 2 (curated) memo types.
 */
export interface InvestmentMemo {
  id: string;
  version: number;
  title: string;
  companyName: string;
  stage: MemoStage;
  status: MemoStatus;
  sections: MemoSection[];
  preferences: MemoPreferences;
  createdAt: Date;
  updatedAt: Date;
  generatedBy: string; // AI agent identifier
}

export enum MemoStage {
  STAGE_1 = 'stage_1', // AI-Generated
  STAGE_2 = 'stage_2'  // Curated
}

export enum MemoStatus {
  GENERATING = 'generating',
  COMPLETED = 'completed',
  REVIEWING = 'reviewing',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface MemoSection {
  id: string;
  title: string;
  type: SectionType;
  content: string;
  weight: number;
  confidence: number;
  subsections?: MemoSubsection[];
  visualizations?: Visualization[];
}

export enum SectionType {
  FOUNDER_PROFILE = 'founder_profile',
  PROBLEM_SIZING = 'problem_sizing',
  DIFFERENTIATION = 'differentiation',
  COMPANY_REVIEW = 'company_review',
  MARKET_ANALYSIS = 'market_analysis',
  COMPETITIVE_LANDSCAPE = 'competitive_landscape',
  FINANCIAL_PROJECTIONS = 'financial_projections',
  RISK_ASSESSMENT = 'risk_assessment',
  RECOMMENDATION = 'recommendation'
}

export interface MemoSubsection {
  id: string;
  title: string;
  content: string;
  weight: number;
  confidence: number;
}

export interface Visualization {
  id: string;
  type: VisualizationType;
  title: string;
  data: any;
  config: any;
}

export enum VisualizationType {
  CHART = 'chart',
  GRAPH = 'graph',
  TABLE = 'table',
  TIMELINE = 'timeline',
  METRIC_CARD = 'metric_card'
}

export interface MemoPreferences {
  sectionWeights: { [key in SectionType]: number };
  subsectionWeights: { [sectionId: string]: { [subsectionId: string]: number } };
  visualizationsEnabled: boolean;
  riskFlagsEnabled: boolean;
  confidenceThreshold: number;
}

export interface MemoSummary {
  totalSections: number;
  averageConfidence: number;
  riskFlags: RiskFlag[];
  keyInsights: string[];
  recommendations: string[];
  nextSteps: string[];
}

export interface RiskFlag {
  id: string;
  type: RiskType;
  severity: RiskSeverity;
  title: string;
  description: string;
  section: string;
  confidence: number;
}

export enum RiskType {
  FINANCIAL = 'financial',
  MARKET = 'market',
  COMPETITIVE = 'competitive',
  REGULATORY = 'regulatory',
  TECHNICAL = 'technical',
  OPERATIONAL = 'operational'
}

export enum RiskSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}
