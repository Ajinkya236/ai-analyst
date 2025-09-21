/**
 * Data Source Model
 * 
 * Represents different types of data sources that can be ingested in Stage 0.
 * Includes file uploads, text input, URLs, and AI agent generated data.
 */
export interface DataSource {
  id: string;
  type: DataSourceType;
  name: string;
  description?: string;
  url?: string;
  file?: File;
  content?: string;
  status: DataSourceStatus;
  confidenceScore?: number;
  metadata?: DataSourceMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export enum DataSourceType {
  FILE_UPLOAD = 'file_upload',
  TEXT_INPUT = 'text_input',
  URL_LINK = 'url_link',
  FOUNDER_VOICE = 'founder_voice',
  BEHAVIORAL_ASSESSMENT = 'behavioral_assessment',
  DEEP_RESEARCH = 'deep_research'
}

export enum DataSourceStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  ARCHIVED = 'archived'
}

export interface DataSourceMetadata {
  fileSize?: number;
  fileType?: string;
  duration?: number; // for audio/video
  pageCount?: number; // for documents
  wordCount?: number;
  language?: string;
  extractedText?: string;
  summary?: string;
  tags?: string[];
  confidence?: number;
}
