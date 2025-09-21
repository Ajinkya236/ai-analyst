import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

/**
 * Stage 1 Component - AI-Generated Investment Memo
 * 
 * Displays AI-generated investment memos from Stage 0 data.
 * Allows viewing, downloading, and selecting memos for Stage 2.
 */
@Component({
  selector: 'app-stage-1',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="stage-1">
      <!-- Splash Screen -->
      <div *ngIf="showSplashScreen" class="splash-screen">
        <div class="splash-content">
          <div class="loading-animation">
            <div class="spinner"></div>
            <div class="pulse-ring"></div>
            <div class="pulse-ring delay-1"></div>
            <div class="pulse-ring delay-2"></div>
          </div>
          <h2 class="splash-title">No need to stick around. This will take some time</h2>
          <p class="splash-description">Our AI agents are analyzing your data and creating comprehensive investment memos...</p>
          <div class="progress-section">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="generationProgress"></div>
            </div>
            <span class="progress-text">{{ generationProgress }}% Complete</span>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div *ngIf="!showSplashScreen" class="main-content">
        <div class="stage-header">
          <div class="stage-info">
            <h1 class="stage-title">Stage 1: AI-Generated Investment Memo</h1>
            <p class="stage-description">AI synthesizes collected data into structured investment memos</p>
          </div>
          <div class="stage-actions">
            <button class="btn btn-outline" (click)="goBack()">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M19 12H5M12 19l-7-7 7-7"></path>
              </svg>
              Previous
            </button>
            <button class="btn btn-primary" (click)="generateNewMemo()" [disabled]="isGenerating || !canGenerateMemo">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              {{ isGenerating ? 'Generating...' : (!canGenerateMemo ? 'Add Data Sources First' : 'Generate New Memo') }}
            </button>
            <button class="btn btn-success" (click)="proceedToNext()" [disabled]="generatedDecks.length === 0">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
              Next
            </button>
          </div>
        </div>
      
      <div class="stage-content">
        <!-- Generation Status -->
        <div class="generation-status" *ngIf="isGenerating">
          <div class="status-card">
            <div class="status-header">
              <div class="loading-spinner"></div>
              <h3 class="status-title">Generating Investment Memo</h3>
            </div>
            <p class="status-description">AI agents are analyzing your data sources and creating structured memos...</p>
            <div class="progress-section">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="generationProgress"></div>
              </div>
              <span class="progress-text">{{ generationProgress }}% Complete</span>
            </div>
            <div class="agent-status-list">
              <div class="agent-status-item" *ngFor="let agent of generatingAgents">
                <div class="agent-name">{{ agent.name }}</div>
                <div class="agent-progress">
                  <div class="progress-bar small">
                    <div class="progress-fill" [style.width.%]="agent.progress"></div>
                  </div>
                  <span class="progress-text">{{ agent.progress }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Memos Grid -->
        <div class="memos-section" *ngIf="!isGenerating">
          <div class="section-header">
            <h2 class="section-title">Generated Memos</h2>
            <div class="section-actions">
              <div class="filter-controls">
                <select class="form-input" [(ngModel)]="selectedFilter" (change)="filterMemos()">
                  <option value="all">All Memos</option>
                  <option value="recent">Recent</option>
                  <option value="completed">Completed</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="memos-grid" *ngIf="filteredMemos.length > 0; else noMemos">
            <div class="memo-card" *ngFor="let memo of filteredMemos" [class.selected]="memo.id === selectedMemoId">
              <div class="memo-header">
                <div class="memo-title-section">
                  <h3 class="memo-title">{{ memo.title }}</h3>
                  <div class="memo-meta">
                    <span class="memo-company">{{ memo.companyName }}</span>
                    <span class="memo-version">v{{ memo.version }}</span>
                    <span class="memo-date">{{ formatDate(memo.createdAt) }}</span>
                  </div>
                </div>
                <div class="memo-status" [class]="'status-' + memo.status">
                  {{ memo.status }}
                </div>
              </div>
              
              <div class="memo-content">
                <div class="memo-summary">
                  <p>{{ memo.summary }}</p>
                </div>
                
                <div class="memo-sections">
                  <div class="section-preview" *ngFor="let section of memo.sections.slice(0, 3)">
                    <div class="section-title">{{ section.title }}</div>
                    <div class="section-confidence">
                      <div class="confidence-bar">
                        <div class="confidence-fill" [style.width.%]="section.confidence"></div>
                      </div>
                      <span class="confidence-text">{{ section.confidence }}%</span>
                    </div>
                  </div>
                  <div class="more-sections" *ngIf="memo.sections.length > 3">
                    +{{ memo.sections.length - 3 }} more sections
                  </div>
                </div>
                
                <div class="memo-metrics">
                  <div class="metric">
                    <span class="metric-label">Sections</span>
                    <span class="metric-value">{{ memo.sections.length }}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Avg. Confidence</span>
                    <span class="metric-value">{{ memo.averageConfidence }}%</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Risk Flags</span>
                    <span class="metric-value">{{ memo.riskFlags }}</span>
                  </div>
                </div>
              </div>
              
              <div class="memo-actions">
                <button class="btn btn-outline btn-sm" (click)="viewMemo(memo.id)">
                  <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  View
                </button>
                <button class="btn btn-outline btn-sm" (click)="downloadMemo(memo.id)">
                  <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7,10 12,15 17,10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download
                </button>
                <button class="btn btn-primary btn-sm" (click)="selectForStage2(memo.id)" 
                        [disabled]="memo.status !== 'completed'">
                  <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 12l2 2 4-4"></path>
                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                  </svg>
                  Select for Stage 2
                </button>
                <button class="btn btn-outline btn-sm danger" (click)="deleteMemo(memo.id)">
                  <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="3,6 5,6 21,6"></polyline>
                    <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
          
          <ng-template #noMemos>
            <div class="empty-state">
              <div class="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                </svg>
              </div>
              <h3 class="empty-title">No Memos Generated Yet</h3>
              <p class="empty-description">Generate your first AI-powered investment memo from your collected data sources.</p>
              <button class="btn btn-primary" (click)="generateNewMemo()" [disabled]="!canGenerateMemo">
                {{ !canGenerateMemo ? 'Add Data Sources First' : 'Generate First Memo' }}
              </button>
            </div>
          </ng-template>
        </div>
      </div>
    </div>

    <!-- PPT Preview Modal -->
    <div class="modal" [class.show]="showPreviewModal" *ngIf="showPreviewModal">
      <div class="modal-content preview-modal">
        <div class="modal-header">
          <h3 class="modal-title">PPT Preview - {{ previewMemo?.title }}</h3>
          <button class="modal-close" (click)="closePreviewModal()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="preview-container">
            <div class="preview-header">
              <div class="preview-info">
                <h4>{{ previewMemo?.title }}</h4>
                <p class="preview-meta">
                  <span>Version {{ previewMemo?.version }}</span>
                  <span>{{ formatDate(previewMemo?.createdAt) }}</span>
                  <span>{{ previewMemo?.companyName }}</span>
                </p>
              </div>
              <div class="preview-actions">
                <button class="btn btn-outline btn-sm" (click)="downloadMemo(previewMemo?.id)">
                  <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7,10 12,15 17,10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download
                </button>
              </div>
            </div>
            
            <div class="preview-content">
              <div class="slide-preview">
                <div class="slide-container">
                  <div class="slide-header">
                    <h2>Investment Memo Preview</h2>
                    <div class="slide-meta">
                      <span class="confidence-score">AI Confidence: {{ previewMemo?.averageConfidence }}%</span>
                      <span class="risk-flags">Risk Flags: {{ previewMemo?.riskFlags }}</span>
                    </div>
                  </div>
                  
                  <div class="slide-content">
                    <div class="section-grid">
                      <div class="section-card" *ngFor="let section of previewMemo?.sections">
                        <div class="section-header">
                          <h3>{{ section.title }}</h3>
                          <div class="confidence-indicator">
                            <div class="confidence-bar">
                              <div class="confidence-fill" [style.width.%]="section.confidence"></div>
                            </div>
                            <span class="confidence-text">{{ section.confidence }}%</span>
                          </div>
                        </div>
                        <div class="section-preview-content">
                          <p>AI-generated content based on Stage 0 data sources...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" (click)="closePreviewModal()">Close</button>
          <button class="btn btn-primary" (click)="downloadMemo(previewMemo?.id)">
            Download Full PPT
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stage-1 {
      padding: var(--space-6);
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .splash-screen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #0f1419 0%, #1e2a3a 20%, #2d4059 40%, #3d5a80 60%, #5a4fcf 80%, #7b68ee 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .splash-content {
      text-align: center;
      color: white;
      max-width: 600px;
      padding: var(--space-8);
    }
    
    .loading-animation {
      position: relative;
      width: 120px;
      height: 120px;
      margin: 0 auto var(--space-8);
    }
    
    .spinner {
      width: 60px;
      height: 60px;
      border: 4px solid rgba(255, 255, 255, 0.2);
      border-top: 4px solid #00f2fe;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    
    .pulse-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100px;
      height: 100px;
      border: 2px solid rgba(0, 242, 254, 0.3);
      border-radius: 50%;
      animation: pulse 2s ease-out infinite;
    }
    
    .pulse-ring.delay-1 {
      animation-delay: 0.5s;
    }
    
    .pulse-ring.delay-2 {
      animation-delay: 1s;
    }
    
    @keyframes pulse {
      0% {
        transform: translate(-50%, -50%) scale(0.8);
        opacity: 1;
      }
      100% {
        transform: translate(-50%, -50%) scale(1.2);
        opacity: 0;
      }
    }
    
    .splash-title {
      font-size: var(--font-size-4xl);
      font-weight: 700;
      margin-bottom: var(--space-4);
      background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .splash-description {
      font-size: var(--font-size-lg);
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: var(--space-8);
      line-height: 1.6;
    }
    
    .stage-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-8);
      padding-bottom: var(--space-6);
      border-bottom: 1px solid var(--medium-gray);
    }
    
    .stage-title {
      font-size: var(--font-size-4xl);
      font-weight: 700;
      color: white !important;
      margin-bottom: var(--space-2);
    }
    
    .stage-description {
      font-size: var(--font-size-lg);
      color: var(--text-medium);
      margin: 0;
    }
    
    .stage-actions {
      flex-shrink: 0;
    }
    
    .btn-icon {
      width: 20px;
      height: 20px;
    }
    
    .stage-content {
      display: flex;
      flex-direction: column;
      gap: var(--space-8);
    }
    
    .generation-status {
      background-color: var(--white);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--medium-gray);
      padding: var(--space-6);
    }
    
    .status-card {
      text-align: center;
    }
    
    .status-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-4);
      margin-bottom: var(--space-4);
    }
    
    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid var(--light-gray);
      border-top: 3px solid var(--primary-blue);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .status-title {
      font-size: var(--font-size-2xl);
      font-weight: 600;
      color: var(--text-dark);
      margin: 0;
    }
    
    .status-description {
      color: var(--text-medium);
      margin-bottom: var(--space-6);
    }
    
    .progress-section {
      margin-bottom: var(--space-6);
    }
    
    .progress-bar {
      width: 100%;
      height: 12px;
      background-color: var(--light-gray);
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: var(--space-2);
    }
    
    .progress-bar.small {
      height: 6px;
    }
    
    .progress-fill {
      height: 100%;
      background-color: var(--primary-blue);
      transition: width var(--transition-normal);
    }
    
    .progress-text {
      font-size: var(--font-size-sm);
      font-weight: 500;
      color: var(--text-medium);
    }
    
    .agent-status-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      max-width: 400px;
      margin: 0 auto;
    }
    
    .agent-status-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-3);
      background-color: var(--off-white);
      border-radius: var(--radius-md);
    }
    
    .agent-name {
      font-weight: 500;
      color: var(--text-dark);
    }
    
    .agent-progress {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      flex: 1;
      max-width: 200px;
    }
    
    .memos-section {
      background-color: var(--white);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--medium-gray);
      padding: var(--space-6);
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-6);
    }
    
    .section-title {
      font-size: var(--font-size-2xl);
      font-weight: 600;
      color: var(--text-dark);
      margin: 0;
    }
    
    .filter-controls select {
      width: 200px;
    }
    
    .memos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: var(--space-6);
    }
    
    .memo-card {
      background-color: var(--off-white);
      border: 1px solid var(--medium-gray);
      border-radius: var(--radius-lg);
      padding: var(--space-6);
      transition: all var(--transition-fast);
      cursor: pointer;
    }
    
    .memo-card:hover {
      border-color: var(--primary-blue);
      box-shadow: var(--shadow-md);
    }
    
    .memo-card.selected {
      border-color: var(--primary-blue);
      background-color: rgb(37 99 235 / 0.05);
    }
    
    .memo-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-4);
    }
    
    .memo-title {
      font-size: var(--font-size-xl);
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: var(--space-2);
    }
    
    .memo-meta {
      display: flex;
      gap: var(--space-3);
      font-size: var(--font-size-sm);
      color: var(--text-medium);
    }
    
    .memo-company {
      font-weight: 500;
    }
    
    .memo-version {
      background-color: var(--light-gray);
      padding: 2px 6px;
      border-radius: 4px;
    }
    
    .memo-status {
      font-size: var(--font-size-xs);
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 12px;
      text-transform: uppercase;
    }
    
    .status-completed {
      background-color: rgb(16 185 129 / 0.1);
      color: var(--success);
    }
    
    .status-generating {
      background-color: rgb(59 130 246 / 0.1);
      color: var(--info);
    }
    
    .status-draft {
      background-color: rgb(245 158 11 / 0.1);
      color: var(--warning);
    }
    
    .memo-content {
      margin-bottom: var(--space-6);
    }
    
    .memo-summary {
      margin-bottom: var(--space-4);
    }
    
    .memo-summary p {
      color: var(--text-medium);
      line-height: 1.6;
      margin: 0;
    }
    
    .memo-sections {
      margin-bottom: var(--space-4);
    }
    
    .section-preview {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-2) 0;
      border-bottom: 1px solid var(--light-gray);
    }
    
    .section-preview:last-child {
      border-bottom: none;
    }
    
    .section-title {
      font-size: var(--font-size-sm);
      font-weight: 500;
      color: var(--text-dark);
    }
    
    .section-confidence {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    
    .confidence-bar {
      width: 60px;
      height: 4px;
      background-color: var(--light-gray);
      border-radius: 2px;
      overflow: hidden;
    }
    
    .confidence-fill {
      height: 100%;
      background-color: var(--success);
      transition: width var(--transition-normal);
    }
    
    .confidence-text {
      font-size: var(--font-size-xs);
      font-weight: 500;
      color: var(--text-medium);
      min-width: 30px;
    }
    
    .more-sections {
      font-size: var(--font-size-xs);
      color: var(--text-light);
      text-align: center;
      padding: var(--space-2) 0;
    }
    
    .memo-metrics {
      display: flex;
      gap: var(--space-6);
    }
    
    .metric {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }
    
    .metric-label {
      font-size: var(--font-size-xs);
      color: var(--text-light);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .metric-value {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-dark);
    }
    
    .memo-actions {
      display: flex;
      gap: var(--space-2);
      flex-wrap: wrap;
    }
    
    .btn.danger {
      color: var(--error);
      border-color: var(--error);
    }
    
    .btn.danger:hover {
      background-color: var(--error);
      color: var(--white);
    }
    
    .empty-state {
      text-align: center;
      padding: var(--space-16) var(--space-8);
    }
    
    .empty-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto var(--space-6);
      color: var(--text-light);
    }
    
    .empty-icon svg {
      width: 100%;
      height: 100%;
    }
    
    .empty-title {
      font-size: var(--font-size-2xl);
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: var(--space-2);
    }
    
    .empty-description {
      color: var(--text-medium);
      margin-bottom: var(--space-6);
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    /* PPT Preview Modal */
    .preview-modal {
      max-width: 1000px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .preview-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: var(--space-4);
      border-bottom: 1px solid var(--light-gray);
    }

    .preview-info h4 {
      font-size: var(--font-size-xl);
      font-weight: 600;
      color: var(--text-dark);
      margin: 0 0 var(--space-2) 0;
    }

    .preview-meta {
      display: flex;
      gap: var(--space-4);
      font-size: var(--font-size-sm);
      color: var(--text-medium);
      margin: 0;
    }

    .preview-actions {
      flex-shrink: 0;
    }

    .preview-content {
      background-color: var(--off-white);
      border-radius: var(--radius-lg);
      padding: var(--space-6);
    }

    .slide-preview {
      background-color: var(--white);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }

    .slide-container {
      padding: var(--space-6);
    }

    .slide-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-6);
      padding-bottom: var(--space-4);
      border-bottom: 2px solid var(--primary-blue);
    }

    .slide-header h2 {
      font-size: var(--font-size-2xl);
      font-weight: 700;
      color: var(--text-dark);
      margin: 0;
    }

    .slide-meta {
      display: flex;
      gap: var(--space-4);
      font-size: var(--font-size-sm);
      font-weight: 500;
    }

    .confidence-score {
      color: var(--success);
    }

    .risk-flags {
      color: var(--warning);
    }

    .section-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-4);
    }

    .section-card {
      background-color: var(--off-white);
      border: 1px solid var(--light-gray);
      border-radius: var(--radius-md);
      padding: var(--space-4);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-3);
    }

    .section-header h3 {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-dark);
      margin: 0;
    }

    .confidence-indicator {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .confidence-bar {
      width: 60px;
      height: 4px;
      background-color: var(--light-gray);
      border-radius: 2px;
      overflow: hidden;
    }

    .confidence-fill {
      height: 100%;
      background-color: var(--success);
      transition: width var(--transition-normal);
    }

    .confidence-text {
      font-size: var(--font-size-xs);
      font-weight: 500;
      color: var(--text-medium);
      min-width: 30px;
    }

    .section-preview-content {
      color: var(--text-medium);
      line-height: 1.6;
    }

    .section-preview-content p {
      margin: 0;
      font-size: var(--font-size-sm);
    }
    
    @media (max-width: 768px) {
      .stage-1 {
        padding: var(--space-4);
      }
      
      .stage-header {
        flex-direction: column;
        align-items: stretch;
        gap: var(--space-4);
      }
      
      .memos-grid {
        grid-template-columns: 1fr;
      }
      
      .memo-actions {
        flex-direction: column;
      }
      
      .memo-actions .btn {
        width: 100%;
      }
    }
  `]
})
export class Stage1Component implements OnInit {
  @Input() reportId: string = '';
  @Output() stageComplete = new EventEmitter<number>();

  private aiAgentsApiUrl = 'http://localhost:8000';

  isGenerating = false;
  generationProgress = 0;
  showSplashScreen = true;
  selectedFilter = 'all';
  selectedMemoId: string | null = null;
  generatedDecks: any[] = [];
  showPreviewModal = false;
  previewMemo: any = null;
  
  // Button state management
  canGenerateMemo = false;
  
  generatingAgents = [
    { name: 'Data Ingestion Agent', progress: 100 },
    { name: 'Founder Analysis Agent', progress: 75 },
    { name: 'Market Research Agent', progress: 50 },
    { name: 'Memo Generation Agent', progress: 25 }
  ];
  
  memos = [
    {
      id: '1',
      title: 'TechCorp Series A Investment Memo',
      companyName: 'TechCorp Inc.',
      version: 1,
      status: 'completed',
      summary: 'Comprehensive analysis of TechCorp\'s Series A opportunity, highlighting strong market position and experienced founding team.',
      sections: [
        { title: 'Founder Profile', confidence: 92 },
        { title: 'Market Analysis', confidence: 88 },
        { title: 'Competitive Landscape', confidence: 85 },
        { title: 'Financial Projections', confidence: 78 },
        { title: 'Risk Assessment', confidence: 82 }
      ],
      averageConfidence: 85,
      riskFlags: 3,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      title: 'FinTech Startup Investment Memo',
      companyName: 'PayFlow Solutions',
      version: 1,
      status: 'generating',
      summary: 'AI-powered financial services platform with strong growth potential in the B2B payments space.',
      sections: [
        { title: 'Founder Profile', confidence: 90 },
        { title: 'Market Analysis', confidence: 85 }
      ],
      averageConfidence: 87,
      riskFlags: 1,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
    },
    {
      id: '3',
      title: 'HealthTech Innovation Memo',
      companyName: 'MedTech Innovations',
      version: 2,
      status: 'draft',
      summary: 'Revolutionary healthcare technology with significant market opportunity and regulatory considerations.',
      sections: [
        { title: 'Founder Profile', confidence: 95 },
        { title: 'Market Analysis', confidence: 90 },
        { title: 'Regulatory Analysis', confidence: 75 }
      ],
      averageConfidence: 87,
      riskFlags: 5,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }
  ];
  
  filteredMemos = [...this.memos];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Check if data sources are available before enabling memo generation
    this.checkDataSourcesAvailability();
    // Start automatic generation on component init
    this.startAutomaticGeneration();
    this.loadGeneratedMemos();
  }

  checkDataSourcesAvailability(): void {
    // Check if there are any data sources available from Stage 0
    // This would typically come from a service or API call
    // For now, we'll simulate checking if sources exist
    this.http.get<any[]>(`${this.aiAgentsApiUrl}/data-sources/${this.reportId}`).subscribe({
      next: (sources) => {
        this.canGenerateMemo = sources && sources.length > 0;
        console.log(`Data sources check: ${sources?.length || 0} sources found. Can generate memo: ${this.canGenerateMemo}`);
      },
      error: (error) => {
        console.error('Error checking data sources:', error);
        // If API fails, assume no sources available
        this.canGenerateMemo = false;
      }
    });
  }


  filterMemos(): void {
    switch (this.selectedFilter) {
      case 'recent':
        this.filteredMemos = this.memos.filter(m => 
          new Date().getTime() - m.createdAt.getTime() < 24 * 60 * 60 * 1000
        );
        break;
      case 'completed':
        this.filteredMemos = this.memos.filter(m => m.status === 'completed');
        break;
      case 'draft':
        this.filteredMemos = this.memos.filter(m => m.status === 'draft');
        break;
      default:
        this.filteredMemos = [...this.memos];
    }

  }

  viewMemo(memoId: string): void {
    console.log('Viewing memo:', memoId);
    this.previewMemo = this.memos.find(m => m.id === memoId);
    this.showPreviewModal = true;
  }

  closePreviewModal(): void {
    this.showPreviewModal = false;
    this.previewMemo = null;
  }

  downloadMemo(memoId: string): void {
    console.log('Downloading memo:', memoId);
    const memo = this.memos.find(m => m.id === memoId);
    if (memo) {
      // Create a mock PPT download
      this.downloadPPT(memo);
    }
  }

  private downloadPPT(memo: any): void {
    // Create a mock PPT file content
    const pptContent = this.generateMockPPTContent(memo);
    
    // Create blob and download
    const blob = new Blob([pptContent], { type: 'application/vnd.ms-powerpoint' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${memo.title.replace(/\s+/g, '_')}_v${memo.version}.ppt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private generateMockPPTContent(memo: any): string {
    // This would be replaced with actual PPT generation
    return `PPT Content for ${memo.title}
Version: ${memo.version}
Company: ${memo.companyName}
Generated: ${memo.createdAt}

Sections:
${memo.sections.map((s: any) => `- ${s.title} (${s.confidence}% confidence)`).join('\n')}

AI Confidence Score: ${memo.averageConfidence}%
Risk Flags: ${memo.riskFlags}

This is a mock PPT file. In production, this would be a real PowerPoint file generated by the AI agent.`;
  }

  selectForStage2(memoId: string): void {
    this.selectedMemoId = memoId;
    console.log('Selected memo for Stage 2:', memoId);
    // Implementation would proceed to Stage 2
  }


  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  }

  startAutomaticGeneration(): void {
    // Start generation automatically when component loads
    setTimeout(() => {
      this.generateNewMemo();
    }, 2000); // 2 second delay to show splash screen
  }

  async loadGeneratedMemos(): Promise<void> {
    try {
      const response = await this.http.get(`${this.aiAgentsApiUrl}/ppt-generator/memos/${this.reportId}`).toPromise();
      if (response && (response as any).status === 'success') {
        const apiMemos = (response as any).memos;
        // Convert API memos to component format
        this.memos = apiMemos.map((memo: any) => ({
          id: memo.id,
          title: memo.title,
          companyName: memo.company_name,
          version: memo.version,
          status: memo.status,
          summary: memo.summary || 'AI-generated investment memo',
          sections: memo.sections || [],
          averageConfidence: memo.average_confidence || 0,
          riskFlags: memo.risk_flags || 0,
          createdAt: new Date(memo.created_at)
        }));
        this.filterMemos();
      }
    } catch (error) {
      console.error('Error loading generated memos:', error);
    }
  }

  async generateNewMemo(): Promise<void> {
    this.showSplashScreen = false;
    this.isGenerating = true;
    this.generationProgress = 0;

    try {
      // Get selected sources from Stage 0 (mock for now)
      const selectedSources = [
        { id: '1', name: 'Company Pitch Deck.pdf', type: 'file' },
        { id: '2', name: 'Financial Statements.xlsx', type: 'file' },
        { id: '3', name: 'Market Research Report', type: 'text' }
      ];

      const response = await this.http.post(`${this.aiAgentsApiUrl}/ppt-generator/generate`, {
        report_id: this.reportId,
        session_id: this.reportId,
        company_name: 'TechCorp Inc.',
        selected_sources: selectedSources,
        config: {
          include_charts: true,
          include_tables: true,
          format: 'powerpoint'
        }
      }).toPromise();

      if (response && (response as any).status === 'success') {
        const memo = (response as any).memo;
        const newMemo = {
          id: memo.id,
          title: memo.title,
          companyName: memo.company_name,
          version: memo.version,
          status: memo.status,
          summary: memo.summary,
          sections: memo.sections.map((s: any) => ({
            title: s.title,
            confidence: s.confidence
          })),
          averageConfidence: memo.average_confidence,
          riskFlags: memo.risk_flags,
          createdAt: new Date(memo.created_at)
        };
        
        this.memos.unshift(newMemo);
        this.filterMemos();
        this.generationProgress = 100;
      }
    } catch (error) {
      console.error('Error generating memo:', error);
      this.generationProgress = 0;
    } finally {
      this.isGenerating = false;
    }
  }

  async deleteMemo(memoId: string): Promise<void> {
    if (confirm('Are you sure you want to delete this memo?')) {
      try {
        const response = await this.http.delete(`${this.aiAgentsApiUrl}/ppt-generator/memos/${memoId}`).toPromise();
        if (response && (response as any).status === 'success') {
          this.memos = this.memos.filter(m => m.id !== memoId);
          this.filterMemos();
        }
      } catch (error) {
        console.error('Error deleting memo:', error);
      }
    }
  }

  goBack(): void {
    this.stageComplete.emit(-1); // Go back to previous stage
  }

  proceedToNext(): void {
    if (this.selectedMemoId) {
      this.stageComplete.emit(2); // Go to Stage 2
    }
  }
}

