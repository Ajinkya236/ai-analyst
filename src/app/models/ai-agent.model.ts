/**
 * AI Agent Models
 * 
 * Defines the structure for different AI agents used in the application.
 * Includes agent types, configurations, and execution status.
 */
export interface AIAgent {
  id: string;
  name: string;
  type: AgentType;
  description: string;
  status: AgentStatus;
  configuration: AgentConfiguration;
  lastExecution?: Date;
  executionHistory: AgentExecution[];
}

export enum AgentType {
  FOUNDER_VOICE = 'founder_voice',
  BEHAVIORAL_ASSESSMENT = 'behavioral_assessment',
  DEEP_RESEARCH = 'deep_research',
  DATA_INGESTION = 'data_ingestion',
  CURATED_MEMO = 'curated_memo'
}

export enum AgentStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  PAUSED = 'paused'
}

export interface AgentConfiguration {
  enabled: boolean;
  priority: number;
  timeout: number; // in seconds
  retryAttempts: number;
  parameters: { [key: string]: any };
}

export interface AgentExecution {
  id: string;
  agentId: string;
  status: ExecutionStatus;
  startedAt: Date;
  completedAt?: Date;
  duration?: number; // in seconds
  input: any;
  output?: any;
  error?: string;
  metrics: ExecutionMetrics;
}

export enum ExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface ExecutionMetrics {
  processingTime: number;
  memoryUsage: number;
  confidenceScore: number;
  dataProcessed: number;
  errors: number;
}

export interface AgentTrigger {
  id: string;
  agentId: string;
  triggerType: TriggerType;
  conditions: TriggerCondition[];
  enabled: boolean;
  lastTriggered?: Date;
}

export enum TriggerType {
  MANUAL = 'manual',
  SCHEDULED = 'scheduled',
  DATA_AVAILABLE = 'data_available',
  STAGE_COMPLETE = 'stage_complete',
  ERROR_OCCURRED = 'error_occurred'
}

export interface TriggerCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
}
