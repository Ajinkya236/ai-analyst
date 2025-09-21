import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, Subscription } from 'rxjs';
import { ReportService, Report } from '../../services/report.service';

interface DataSource {
  id: string;
  name: string;
  type: 'file' | 'text' | 'url' | 'youtube';
  description: string;
  size: number;
  uploadedAt: Date;
  isSelected: boolean;
  file_path?: string;
  url?: string;
  content?: string;
  ingestionStatus: 'pending' | 'loading' | 'completed' | 'failed';
  ingestionError?: string;
}

interface DeepResearchData {
  startupName: string;
  sector: string;
  geography: string;
  stage: string;
  customQuestions: string;
}

@Component({
  selector: 'app-stage-0',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stage-0.component.html',
  styleUrls: ['./stage-0.component.css']
})
export class Stage0Component implements OnInit, OnDestroy {
  @Input() reportId: string = '';
  @Output() stageComplete = new EventEmitter<number>();

  sources: DataSource[] = [];
  selectAll = false;
  showAddSourceModal = false;
  showDeepResearchModal = false;
  showRenameModal = false;
  showDeleteModal = false;
  
  // Add Source Modal properties
  selectedSourceType: 'document' | 'media' | 'link' | 'text' | null = null;
  newSourceUrl = '';
  newSourceText = '';
  newSourceName = '';
  urlError = '';
  selectedFiles: File[] = [];
  isDragOver = false;
  isUploading = false;
  uploadProgress = 0;
  uploadStatus: 'idle' | 'uploading' | 'success' | 'error' = 'idle';
  uploadMessage = '';

  // Deep Research properties
  deepResearchData: DeepResearchData = {
    startupName: 'TechCorp Inc.', // Auto-filled company name
    sector: '',
    geography: '',
    stage: '',
    customQuestions: ''
  };

  // AI Agent Status properties
  founderVoiceStatus: 'pending' | 'running' | 'completed' | 'failed' = 'pending';
  behavioralAssessmentStatus: 'pending' | 'running' | 'completed' | 'failed' = 'pending';
  deepResearchStatus: 'pending' | 'running' | 'completed' | 'failed' = 'pending';
  
  // AI Agent Configuration Modal
  showAIAgentConfigModal = false;
  aiAgentConfig = {
    dataIngestion: {
      enabled: true,
      retryAttempts: 2,
      timeout: 30000,
      batchSize: 10
    },
    deepResearch: {
      enabled: true,
      maxResults: 30,
      searchDepth: 'comprehensive',
      includeSocialMedia: true
    },
    founderVoice: {
      enabled: true,
      maxRetries: 3,
      callDuration: 15,
      followUpQuestions: true
    },
    behavioralAssessment: {
      enabled: true,
      expiryDays: 7,
      reminderDays: 3,
      autoSend: false
    }
  };

  // Stage progression and Next button logic
  canProceedToNext = false;
  canProceedToStage1 = false;
  canProceedToStage2 = false;
  ingestedSourcesCount = 0;

  // Context menu properties
  activeContextMenu: string | null = null;
  renameValue = '';
  sourceToRename: DataSource | null = null;
  sourceToDelete: DataSource | null = null;

  private aiAgentsApiUrl = 'http://localhost:8000';
  private statusPollingSubscription?: Subscription;
  currentReport: Report | null = null;

  constructor(private http: HttpClient, private reportService: ReportService) {
    this.initializeMockData();
    this.loadCurrentReport();
  }

  ngOnInit(): void {
    this.startStatusPolling();
    this.updateIngestionStatus();
    // Auto-open Add Source modal if no sources exist
    if (this.sources.length === 0) {
      this.openAddSourceModal();
    }
  }

  ngOnDestroy(): void {
    if (this.statusPollingSubscription) {
      this.statusPollingSubscription.unsubscribe();
    }
  }

  private initializeMockData(): void {
    // Mock data sources
    this.sources = [
      {
        id: '1',
        name: 'Company Pitch Deck.pdf',
        type: 'file',
        description: 'Initial pitch deck from the company',
        size: 2048000,
        uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isSelected: true,
        ingestionStatus: 'completed'
      },
      {
        id: '2',
        name: 'Financial Statements.xlsx',
        type: 'file',
        description: 'Q3 2024 financial statements',
        size: 1024000,
        uploadedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        isSelected: true,
        ingestionStatus: 'completed'
      },
      {
        id: '3',
        name: 'Company Website',
        type: 'url',
        description: 'Main company website',
        size: 0,
        uploadedAt: new Date(Date.now() - 30 * 60 * 1000),
        isSelected: false,
        url: 'https://example-company.com',
        ingestionStatus: 'pending'
      }
    ];
  }

  private loadCurrentReport(): void {
    this.reportService.currentReport$.subscribe(report => {
      this.currentReport = report;
      if (report) {
        // Update deep research data with report information
        this.deepResearchData.startupName = report.companyName;
        this.deepResearchData.sector = report.sector;
        this.deepResearchData.geography = report.geography;
        this.deepResearchData.stage = report.stage;
        
        // Load AI agent configuration
        if (report.aiAgentConfig) {
          this.aiAgentConfig = report.aiAgentConfig;
        }
      }
    });
  }

  private saveReportData(): void {
    if (this.currentReport) {
      this.reportService.updateReport(this.currentReport.id, {
        companyName: this.deepResearchData.startupName,
        sector: this.deepResearchData.sector,
        geography: this.deepResearchData.geography,
        stage: this.deepResearchData.stage,
        aiAgentConfig: this.aiAgentConfig
      });
    }
  }

  // Computed properties
  get selectedSourcesCount(): number {
    return this.sources.filter(source => source.isSelected).length;
  }

  get founderVoiceStatusText(): string {
    switch (this.founderVoiceStatus) {
      case 'pending': return 'Ready to start';
      case 'running': return 'In progress...';
      case 'completed': return 'Completed';
      case 'failed': return 'Failed';
      default: return 'Ready to start';
    }
  }

  get behavioralAssessmentStatusText(): string {
    switch (this.behavioralAssessmentStatus) {
      case 'pending': return 'Ready to send';
      case 'running': return 'Sending...';
      case 'completed': return 'Sent';
      case 'failed': return 'Failed';
      default: return 'Ready to send';
    }
  }

  get deepResearchStatusText(): string {
    switch (this.deepResearchStatus) {
      case 'pending': return 'Ready to start';
      case 'running': return 'Researching...';
      case 'completed': return 'Completed';
      case 'failed': return 'Failed';
      default: return 'Ready to start';
    }
  }

  // Status polling
  private startStatusPolling(): void {
    this.statusPollingSubscription = interval(5000).subscribe(() => {
      this.updateAgentStatuses();
      this.updateSourceIngestionStatuses();
    });
  }

  private updateAgentStatuses(): void {
    // Update founder voice status
    this.checkAgentStatus('founder-voice', 'founderVoiceStatus');
    // Update behavioral assessment status
    this.checkAgentStatus('behavioral-assessment', 'behavioralAssessmentStatus');
    // Update deep research status
    this.checkAgentStatus('deep-research', 'deepResearchStatus');
  }

  private async updateSourceIngestionStatuses(): Promise<void> {
    for (const source of this.sources) {
      if (source.ingestionStatus === 'loading') {
        try {
          const response = await this.http.get(`${this.aiAgentsApiUrl}/data-ingestion/status/${source.id}`).toPromise();
          if (response && typeof response === 'object') {
            const status = (response as any).status;
            if (status) {
              source.ingestionStatus = status;
              if (status === 'failed') {
                source.ingestionError = (response as any).error || 'Ingestion failed';
              }
            }
          }
        } catch (error) {
          console.error(`Error checking ingestion status for ${source.id}:`, error);
          source.ingestionStatus = 'failed';
          source.ingestionError = 'Status check failed';
        }
      }
    }
  }

  private async checkAgentStatus(agentType: string, statusProperty: string): Promise<void> {
    try {
      const response = await this.http.get(`${this.aiAgentsApiUrl}/agents/${agentType}/status/session_${this.reportId}`).toPromise();
      if (response && typeof response === 'object') {
        const status = (response as any).status;
        if (status) {
          (this as any)[statusProperty] = status;
        }
      }
    } catch (error) {
      console.error(`Error checking ${agentType} status:`, error);
    }
  }

  // Source management
  toggleSourceSelection(source: DataSource): void {
    source.isSelected = !source.isSelected;
    this.updateSelectAllState();
    this.triggerAutoIngestion(source);
  }

  async toggleSelectAll(): Promise<void> {
    this.selectAll = !this.selectAll;
    
    try {
      if (this.selectAll) {
        // Select all and auto-ingest
        await this.http.post(`${this.aiAgentsApiUrl}/sources/select-all`, {
          sources: this.sources.map(source => ({
            id: source.id,
            name: source.name,
            type: source.type,
            description: source.description,
            size: source.size,
            url: source.url,
            content: source.content,
            file_path: source.file_path
          })),
          report_id: this.reportId,
          session_id: this.reportId,
          config: this.aiAgentConfig.dataIngestion
        }).toPromise();
        
        // Update all sources as selected
        this.sources.forEach(source => {
          source.isSelected = true;
          source.ingestionStatus = 'completed';
        });
        
        this.updateIngestionStatus();
        console.log('All sources selected and auto-ingested');
      } else {
        // Deselect all and remove from knowledge base
        await this.http.post(`${this.aiAgentsApiUrl}/sources/deselect-all`, {
          sources: this.sources.map(source => ({
            id: source.id,
            name: source.name,
            type: source.type,
            description: source.description,
            size: source.size,
            url: source.url,
            content: source.content,
            file_path: source.file_path
          })),
          report_id: this.reportId,
          session_id: this.reportId,
          config: this.aiAgentConfig.dataIngestion
        }).toPromise();
        
        // Update all sources as deselected
        this.sources.forEach(source => {
          source.isSelected = false;
          source.ingestionStatus = 'pending';
        });
        
        this.updateIngestionStatus();
        console.log('All sources deselected and removed from knowledge base');
      }
    } catch (error) {
      console.error('Error toggling select all:', error);
      // Revert the selection state on error
      this.selectAll = !this.selectAll;
    }
  }

  private updateSelectAllState(): void {
    this.selectAll = this.sources.length > 0 && this.sources.every(source => source.isSelected);
  }

  private async triggerAutoIngestion(source: DataSource): Promise<void> {
    if (source.isSelected) {
      // Start ingestion
      source.ingestionStatus = 'loading';
      source.ingestionError = undefined;
      
      try {
        const response = await this.http.post(`${this.aiAgentsApiUrl}/sources/toggle-selection`, {
          source_id: source.id,
          is_selected: true,
          report_id: this.reportId,
          session_id: this.reportId,
          config: this.aiAgentConfig.dataIngestion
        }).toPromise();
        
        console.log('Auto-ingestion triggered for source:', source.name);
        source.ingestionStatus = 'completed';
        this.updateIngestionStatus();
      } catch (error) {
        console.error('Error triggering auto-ingestion:', error);
        source.ingestionStatus = 'failed';
        source.ingestionError = 'Failed to start ingestion';
        this.updateIngestionStatus();
      }
    } else {
      // Remove from knowledge base
      try {
        await this.http.post(`${this.aiAgentsApiUrl}/sources/toggle-selection`, {
          source_id: source.id,
          is_selected: false,
          report_id: this.reportId,
          session_id: this.reportId
        }).toPromise();
        
        console.log('Source removed from knowledge base:', source.name);
        source.ingestionStatus = 'pending';
        source.ingestionError = undefined;
        this.updateIngestionStatus();
      } catch (error) {
        console.error('Error removing source from knowledge base:', error);
      }
    }
  }

  private updateIngestionStatus(): void {
    // Count ingested sources
    this.ingestedSourcesCount = this.sources.filter(source => 
      source.isSelected && source.ingestionStatus === 'completed'
    ).length;
    
    // Count selected sources (regardless of ingestion status)
    const selectedSourcesCount = this.sources.filter(source => source.isSelected).length;
    
    // Update stage progression logic - only enable Next button when at least one source is selected
    this.canProceedToNext = selectedSourcesCount > 0;
    // Stage 1 and Stage 2 buttons should always be disabled in Stage 0
    this.canProceedToStage1 = false;
    this.canProceedToStage2 = false;
    
    console.log(`Ingestion status updated: ${this.ingestedSourcesCount} sources ingested, ${selectedSourcesCount} sources selected`);
  }

  onSourceSelectionChange(source: DataSource): void {
    this.updateSelectAllState();
    this.triggerAutoIngestion(source);
  }

  // Context menu
  toggleContextMenu(sourceId: string, event: Event): void {
    event.stopPropagation();
    this.activeContextMenu = this.activeContextMenu === sourceId ? null : sourceId;
  }

  renameSource(source: DataSource): void {
    this.sourceToRename = source;
    this.renameValue = source.name;
    this.showRenameModal = true;
    this.activeContextMenu = null;
  }

  deleteSource(source: DataSource): void {
    this.sourceToDelete = source;
    this.showDeleteModal = true;
    this.activeContextMenu = null;
  }

  confirmDelete(): void {
    if (this.sourceToDelete) {
      const index = this.sources.findIndex(s => s.id === this.sourceToDelete!.id);
      if (index > -1) {
        this.sources.splice(index, 1);
        this.updateSelectAllState();
        this.updateIngestionStatus();
      }
    }
    this.closeDeleteModal();
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.sourceToDelete = null;
  }

  // Rename modal
  closeRenameModal(): void {
    this.showRenameModal = false;
    this.sourceToRename = null;
    this.renameValue = '';
  }

  confirmRename(): void {
    if (this.sourceToRename && this.renameValue.trim()) {
      this.sourceToRename.name = this.renameValue.trim();
      this.closeRenameModal();
    }
  }

  // Add Source Modal
  openAddSourceModal(): void {
    this.showAddSourceModal = true;
    this.selectedSourceType = null;
    this.resetForm();
  }

  closeAddSourceModal(): void {
    this.showAddSourceModal = false;
    this.selectedSourceType = null;
    this.resetForm();
  }

  selectSourceType(type: 'document' | 'media' | 'link' | 'text'): void {
    this.selectedSourceType = type;
    this.resetForm();
  }

  resetForm(): void {
    this.newSourceUrl = '';
    this.newSourceText = '';
    this.newSourceName = '';
    this.urlError = '';
    this.selectedFiles = [];
    this.isUploading = false;
  }

  validateUrl(): void {
    if (this.newSourceUrl) {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(this.newSourceUrl)) {
        this.urlError = 'Please enter a valid URL';
      } else {
        this.urlError = '';
      }
    } else {
      this.urlError = '';
    }
  }

  updateTextCount(): void {
    // This method is called automatically by the input event
  }

  getWordCount(): number {
    if (!this.newSourceText) return 0;
    return this.newSourceText.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  canAddSource(): boolean {
    if (!this.selectedSourceType) return false;
    
    switch (this.selectedSourceType) {
      case 'document':
      case 'media':
        return this.selectedFiles.length > 0;
      case 'link':
        return Boolean(this.newSourceUrl && this.newSourceUrl.trim().length > 0) && this.urlError === '';
      case 'text':
        return this.newSourceText.trim().length > 0;
      default:
        return false;
    }
  }

  async addSource(): Promise<void> {
    if (!this.canAddSource()) return;

    this.isUploading = true;

    try {
      switch (this.selectedSourceType) {
        case 'document':
        case 'media':
          await this.addFileSources();
          break;
        case 'link':
          await this.addUrlSource();
          break;
        case 'text':
          await this.addTextSource();
          break;
      }
    } catch (error) {
      console.error('Error adding source:', error);
    } finally {
      this.isUploading = false;
      this.closeAddSourceModal();
    }
  }

  async addFileSources(): Promise<void> {
    this.uploadStatus = 'uploading';
    this.uploadProgress = 0;
    this.uploadMessage = 'Uploading files...';
    
    try {
      const totalFiles = this.selectedFiles.length;
      
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const file = this.selectedFiles[i];
        
        // Update progress
        this.uploadProgress = Math.round(((i + 1) / totalFiles) * 100);
        this.uploadMessage = `Uploading ${file.name}...`;
        
        const source: DataSource = {
          id: this.generateId(),
          name: this.newSourceName || file.name,
          type: this.selectedSourceType === 'document' ? 'file' : 'file',
          description: `${file.type} file - ${this.formatFileSize(file.size)}`,
          size: file.size,
          uploadedAt: new Date(),
          isSelected: true,
          file_path: file.name,
          ingestionStatus: 'loading'
        };
        
        this.sources.push(source);
        await this.triggerAutoIngestion(source);
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      this.updateIngestionStatus();
      
      // Success feedback
      this.uploadStatus = 'success';
      this.uploadMessage = `Successfully uploaded ${totalFiles} file(s)!`;
      
      // Clear selected files after successful upload
      setTimeout(() => {
        this.selectedFiles = [];
        this.uploadStatus = 'idle';
        this.uploadMessage = '';
        this.uploadProgress = 0;
      }, 3000);
      
    } catch (error) {
      this.uploadStatus = 'error';
      this.uploadMessage = 'Upload failed. Please try again.';
      console.error('Upload error:', error);
      
      // Reset after error
      setTimeout(() => {
        this.uploadStatus = 'idle';
        this.uploadMessage = '';
        this.uploadProgress = 0;
      }, 5000);
    }
  }

  async addUrlSource(): Promise<void> {
    const source: DataSource = {
      id: this.generateId(),
      name: this.newSourceName || this.extractDomainFromUrl(this.newSourceUrl),
      type: this.newSourceUrl.includes('youtube.com') ? 'youtube' : 'url',
      description: `Website link - ${this.newSourceUrl}`,
      size: 0,
      uploadedAt: new Date(),
      isSelected: true,
      url: this.newSourceUrl,
      ingestionStatus: 'loading'
    };
    this.sources.push(source);
    
    // Try to extract data from URL
    try {
      const response = await this.http.post(`${this.aiAgentsApiUrl}/data-extraction/extract-url`, {
        url: this.newSourceUrl,
        report_id: this.reportId,
        session_id: this.reportId
      }).toPromise();
      
      console.log('URL extraction response:', response);
      
      if (response && (response as any).status === 'success') {
        const result = (response as any).result;
        if (result && result.results && result.results.success) {
          source.content = result.results.extracted_data;
          source.description = `Extracted data from ${this.extractDomainFromUrl(this.newSourceUrl)}`;
          source.ingestionStatus = 'completed';
          await this.triggerAutoIngestion(source);
        } else {
          source.ingestionStatus = 'failed';
          source.ingestionError = result?.results?.error || 'Failed to extract data from URL';
          source.isSelected = false;
        }
      } else {
        source.ingestionStatus = 'failed';
        source.ingestionError = 'Failed to extract data from URL';
        source.isSelected = false;
      }
    } catch (error) {
      console.error('Error extracting data from URL:', error);
      source.ingestionStatus = 'failed';
      source.ingestionError = 'Failed to extract data from URL';
      source.isSelected = false;
    }
    this.updateIngestionStatus();
  }

  async addTextSource(): Promise<void> {
    const source: DataSource = {
      id: this.generateId(),
      name: this.newSourceName || `Text Source ${this.sources.length + 1}`,
      type: 'text',
      description: `${this.getWordCount()} words - ${this.newSourceText.length} characters`,
      size: this.newSourceText.length,
      uploadedAt: new Date(),
      isSelected: true,
      content: this.newSourceText,
      ingestionStatus: 'loading'
    };
    this.sources.push(source);
    await this.triggerAutoIngestion(source);
    this.updateIngestionStatus();
  }

  extractDomainFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return 'Unknown URL';
    }
  }

  generateId(): string {
    return 'source_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      this.selectedFiles = Array.from(files);
    }
  }

  // Deep Research Modal
  openDeepResearchModal(): void {
    this.showDeepResearchModal = true;
  }

  closeDeepResearchModal(): void {
    this.showDeepResearchModal = false;
  }

  canStartDeepResearch(): boolean {
    return this.deepResearchData.startupName.trim().length > 0;
  }

  async startDeepResearch(): Promise<void> {
    if (!this.canStartDeepResearch()) return;

    // Save report data before starting research
    this.saveReportData();

    this.deepResearchStatus = 'running';
    this.closeDeepResearchModal();

    try {
      const response = await this.http.post(`${this.aiAgentsApiUrl}/deep-research/execute`, {
        startupName: this.deepResearchData.startupName,
        sector: this.deepResearchData.sector,
        geography: this.deepResearchData.geography,
        stage: this.deepResearchData.stage,
        customQuestions: this.deepResearchData.customQuestions,
        report_id: this.reportId,
        session_id: this.reportId,
        config: this.aiAgentConfig.deepResearch
      }).toPromise();

      console.log('Deep research started:', response);
      this.deepResearchStatus = 'completed';
    } catch (error) {
      console.error('Error starting deep research:', error);
      this.deepResearchStatus = 'failed';
    }
  }

  // Founder Voice
  async triggerFounderVoice(): Promise<void> {
    this.founderVoiceStatus = 'running';

    try {
      const response = await this.http.post(`${this.aiAgentsApiUrl}/founder-voice/interview`, {
        report_id: this.reportId,
        session_id: this.reportId,
        phoneNumber: this.currentReport?.founderProfile?.phone || '+1234567890',
        config: this.aiAgentConfig.founderVoice
      }).toPromise();

      console.log('Founder voice interview started:', response);
      this.founderVoiceStatus = 'completed';
    } catch (error) {
      console.error('Error starting founder voice interview:', error);
      this.founderVoiceStatus = 'failed';
    }
  }

  // Behavioral Assessment
  async triggerBehavioralAssessment(): Promise<void> {
    this.behavioralAssessmentStatus = 'running';

    try {
      const response = await this.http.post(`${this.aiAgentsApiUrl}/behavioral-assessment/send`, {
        report_id: this.reportId,
        session_id: this.reportId,
        email: this.currentReport?.founderProfile?.email || 'founder@example.com',
        phoneNumber: this.currentReport?.founderProfile?.phone || '+1234567890',
        config: this.aiAgentConfig.behavioralAssessment
      }).toPromise();

      console.log('Behavioral assessment sent:', response);
      this.behavioralAssessmentStatus = 'completed';
    } catch (error) {
      console.error('Error sending behavioral assessment:', error);
      this.behavioralAssessmentStatus = 'failed';
    }
  }

  // AI Agent Configuration
  openAIAgentConfig(): void {
    this.showAIAgentConfigModal = true;
  }

  closeAIAgentConfig(): void {
    this.showAIAgentConfigModal = false;
  }

  saveAIAgentConfig(): void {
    // Save configuration to report
    this.saveReportData();
    console.log('Saving AI Agent Configuration:', this.aiAgentConfig);
    this.closeAIAgentConfig();
  }

  resetAIAgentConfig(): void {
    this.aiAgentConfig = {
      dataIngestion: {
        enabled: true,
        retryAttempts: 2,
        timeout: 30000,
        batchSize: 10
      },
      deepResearch: {
        enabled: true,
        maxResults: 30,
        searchDepth: 'comprehensive',
        includeSocialMedia: true
      },
      founderVoice: {
        enabled: true,
        maxRetries: 3,
        callDuration: 15,
        followUpQuestions: true
      },
      behavioralAssessment: {
        enabled: true,
        expiryDays: 7,
        reminderDays: 3,
        autoSend: false
      }
    };
  }

  // Stage progression methods
  proceedToNext(): void {
    if (this.canProceedToNext) {
      console.log('Proceeding to next stage with ingested knowledge base data');
      // Save report data and update stage
      this.saveReportData();
      if (this.currentReport) {
        this.reportService.updateStage(this.currentReport.id, 1);
      }
      // Emit event to parent component to proceed to next stage
      this.stageComplete.emit(1);
    }
  }

  proceedToStage1(): void {
    if (this.canProceedToStage1) {
      console.log('Proceeding to Stage 1 with ingested knowledge base data');
      this.saveReportData();
      if (this.currentReport) {
        this.reportService.updateStage(this.currentReport.id, 1);
      }
      this.stageComplete.emit(1);
    }
  }

  proceedToStage2(): void {
    if (this.canProceedToStage2) {
      console.log('Proceeding to Stage 2 with ingested knowledge base data');
      this.saveReportData();
      if (this.currentReport) {
        this.reportService.updateStage(this.currentReport.id, 2);
      }
      this.stageComplete.emit(2);
    }
  }

  // Get knowledge base stats for display
  getKnowledgeBaseStats(): string {
    return `${this.ingestedSourcesCount} source${this.ingestedSourcesCount !== 1 ? 's' : ''} ingested`;
  }

  // File drag and drop
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files) {
      this.selectedFiles = Array.from(files);
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  // Utility methods
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  trackBySourceId(index: number, source: DataSource): string {
    return source.id;
  }

  getIngestionStatusIcon(source: DataSource): string {
    switch (source.ingestionStatus) {
      case 'pending': return '⏳';
      case 'loading': return '⏳';
      case 'completed': return '✅';
      case 'failed': return '❌';
      default: return '⏳';
    }
  }

  getIngestionStatusText(source: DataSource): string {
    switch (source.ingestionStatus) {
      case 'pending': return 'Pending';
      case 'loading': return 'Processing...';
      case 'completed': return 'Completed';
      case 'failed': return 'Failed';
      default: return 'Pending';
    }
  }
}