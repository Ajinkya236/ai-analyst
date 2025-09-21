# Feature 4: Stage 0 - Data Collection with AI Agents

## Brief Description
Implement Stage 0 data collection page with file uploads, URL processing, text input, founder voice AI agent, behavioral assessment, deep research agent, and data ingestion. The page should show stage progress, allow source selection, and trigger AI agents for comprehensive data gathering.

## Files and Functions to Change/Create

### New Components
- `src/app/components/source-upload/source-upload.component.ts` - File upload component
- `src/app/components/ai-agent-card/ai-agent-card.component.ts` - AI agent status cards
- `src/app/components/source-list/source-list.component.ts` - Sources management list
- `src/app/components/deep-search-modal/deep-search-modal.component.ts` - Deep research modal
- `src/app/components/founder-voice-modal/founder-voice-modal.component.ts` - Founder voice call modal
- `src/app/components/behavioral-assessment-modal/behavioral-assessment-modal.component.ts` - Behavioral assessment modal

### Updated Files
- `src/app/pages/stage-0/stage-0.component.ts` - Main stage 0 component
- `src/app/services/ai-agent.service.ts` - Add AI agent methods
- `src/app/services/data-source.service.ts` - Add source management methods
- `src/app/models/data-source.model.ts` - Update data source model

## Algorithms and Implementation Steps

### Step 1: Stage 0 Layout
1. Create main stage 0 page with:
   - Stage progress indicator (rectangle shapes, not circular)
   - Back button and navigation
   - Current stage highlighted
   - Main content area for data collection

### Step 2: Source Upload System
1. Implement "Add Source" button that opens popup
2. Create dynamic input process:
   - Step 1: Choose source type (documents, video/audio, YouTube, website, text)
   - Step 2: Dynamic form based on source type
   - Step 3: Upload/input validation and processing
3. Support multiple file types:
   - Documents: PDF, DOCX, PPT, email threads
   - Media: MP4, MP3, audio files
   - URLs: YouTube links, website links
   - Text: Large text input with character limit

### Step 3: Sources Management
1. Display added sources in selectable list:
   - Checkboxes for each source
   - "Select All" functionality
   - Source type indicators
   - File size and upload date
2. Source actions:
   - Edit title (inline or modal)
   - Delete source with confirmation
   - View source details
3. Visual feedback for selected sources

### Step 4: Deep Search Agent
1. Implement deep search button and modal:
   - Company name pre-filled
   - Sector, geography, stage inputs
   - Key questions textarea
   - Search configuration options
2. AI agent behavior:
   - Multi-layered search across reliable domains
   - Data extraction and structuring
   - Confidence scoring and validation
   - Progress tracking and status updates

### Step 5: Founder Voice AI Agent
1. Create founder voice call functionality:
   - Trigger call to founder phone number
   - Adaptive Q&A system
   - Real-time transcription
   - Sentiment analysis and confidence scoring
2. Call management:
   - Retry logic (up to 3 attempts)
   - Call status tracking
   - Consent collection
   - Identity verification

### Step 6: Behavioral Assessment Agent
1. Implement behavioral assessment system:
   - SMS/email trigger to founder
   - Secure assessment link generation
   - Psychometric question sets
   - Progress tracking and completion status
2. Assessment features:
   - Multiple question types (multiple choice, Likert scale, situational judgment)
   - Save and resume functionality
   - Data encryption and security
   - Automatic scoring and analysis

### Step 7: Data Ingestion Agent
1. Create data ingestion workflow:
   - Process all selected sources
   - Use RAG, CAG, MCP for intelligent parsing
   - Parallel processing for efficiency
   - Progress tracking and status updates
2. Ingestion features:
   - Loading splash with "Please wait" message
   - Next button disabled during ingestion
   - Error handling and retry logic
   - Structured data output

### Step 8: Navigation and Progress
1. Implement stage navigation:
   - Previous button (if applicable)
   - Next button (enabled after successful ingestion)
   - Stage progress indicators
   - Breadcrumb navigation
2. Progress tracking:
   - Real-time status updates
   - Completion percentages
   - Error handling and recovery

## Technical Requirements

### Data Models
```typescript
interface DataSource {
  id: string;
  type: 'document' | 'video' | 'audio' | 'youtube' | 'website' | 'text';
  title: string;
  content: string;
  fileSize?: number;
  uploadDate: Date;
  isSelected: boolean;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  confidence?: number;
  provenance?: string;
}

interface AIAgent {
  id: string;
  name: string;
  type: 'founder-voice' | 'behavioral-assessment' | 'deep-research' | 'data-ingestion';
  status: 'idle' | 'running' | 'completed' | 'error';
  progress: number;
  lastTriggered?: Date;
  results?: any;
  error?: string;
}

interface DeepSearchConfig {
  companyName: string;
  sector: string;
  geography: string;
  stage: string;
  keyQuestions: string;
  searchDepth: 'basic' | 'comprehensive' | 'exhaustive';
}
```

### AI Agent Integration
- Founder Voice: Twilio/WebRTC integration for calls
- Behavioral Assessment: Secure form generation and SMS/email delivery
- Deep Research: Web scraping and API integration
- Data Ingestion: RAG/CAG/MCP processing pipeline

### File Upload Handling
- Support for multiple file types and sizes
- Client-side validation and preview
- Chunked upload for large files
- Progress tracking and error handling
- Secure file storage and processing

### Real-time Updates
- WebSocket connection for live status updates
- Progress bars and loading indicators
- Error notifications and recovery options
- Status synchronization across components

## Acceptance Criteria

1. **Stage Layout**: Rectangle stage indicators with proper navigation
2. **Source Upload**: Dynamic popup with multiple source type support
3. **Source Management**: Selectable list with edit/delete functionality
4. **Deep Search**: Modal with configuration and AI agent execution
5. **Founder Voice**: Call trigger with status tracking and results
6. **Behavioral Assessment**: SMS/email trigger with completion tracking
7. **Data Ingestion**: Loading splash with progress and completion
8. **Navigation**: Proper stage navigation and progress tracking
9. **Error Handling**: Comprehensive error handling and recovery
10. **Responsive Design**: Mobile-first approach with desktop enhancement

## Security Considerations

- File upload validation and sanitization
- Secure AI agent communication
- Data encryption in transit and at rest
- User consent collection and management
- Privacy protection for founder data
- Secure assessment link generation

## Performance Requirements

- Parallel processing for multiple sources
- Efficient file upload with progress tracking
- Real-time status updates without polling
- Optimized AI agent execution
- Responsive UI during long-running operations
- Memory management for large files

## Error Handling

- File upload failures and retry logic
- AI agent execution errors
- Network connectivity issues
- Data processing failures
- User input validation errors
- System timeout handling
