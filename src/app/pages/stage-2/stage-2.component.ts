import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Stage 2 Component - Curated Investment Memo
 * 
 * Displays the final curated investment memo with customizable preferences,
 * visual summaries, and risk analysis. Allows editing preferences and regenerating.
 */
@Component({
  selector: 'app-stage-2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="stage-2">
      <div class="stage-header">
        <div class="stage-info">
          <h1 class="stage-title">Stage 2: Curated Investment Memo</h1>
          <p class="stage-description">Final curated investment memo with actionable insights and visual summaries</p>
        </div>
        <div class="stage-actions">
          <button class="btn btn-outline" (click)="editPreferences()">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
            </svg>
            Edit Preferences
          </button>
          <button class="btn btn-primary" (click)="regenerateMemo()" [disabled]="isRegenerating || !canRegenerateMemo">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            {{ isRegenerating ? 'Regenerating...' : (!canRegenerateMemo ? 'Complete Stage 1 First' : 'Regenerate Memo') }}
          </button>
        </div>
      </div>
      
      <div class="stage-content">
        <!-- Memo Overview -->
        <div class="memo-overview">
          <div class="overview-card">
            <div class="overview-header">
              <h2 class="memo-title">{{ currentMemo.title }}</h2>
              <div class="memo-meta">
                <span class="company-name">{{ currentMemo.companyName }}</span>
                <span class="memo-version">v{{ currentMemo.version }}</span>
                <span class="memo-date">{{ formatDate(currentMemo.createdAt) }}</span>
              </div>
            </div>
            
            <div class="overview-metrics">
              <div class="metric-card">
                <div class="metric-value">{{ currentMemo.sections.length }}</div>
                <div class="metric-label">Sections</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">{{ currentMemo.averageConfidence }}%</div>
                <div class="metric-label">Avg. Confidence</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">{{ currentMemo.riskFlags.length }}</div>
                <div class="metric-label">Risk Flags</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">{{ currentMemo.keyInsights.length }}</div>
                <div class="metric-label">Key Insights</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Risk Flags -->
        <div class="risk-flags-section" *ngIf="currentMemo.riskFlags.length > 0">
          <h3 class="section-title">Risk Flags</h3>
          <div class="risk-flags-grid">
            <div class="risk-flag" *ngFor="let flag of currentMemo.riskFlags" [class]="'severity-' + flag.severity">
              <div class="flag-header">
                <div class="flag-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <div class="flag-content">
                  <h4 class="flag-title">{{ flag.title }}</h4>
                  <p class="flag-description">{{ flag.description }}</p>
                  <div class="flag-meta">
                    <span class="flag-type">{{ flag.type }}</span>
                    <span class="flag-section">{{ flag.section }}</span>
                    <span class="flag-confidence">{{ flag.confidence }}% confidence</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Memo Sections -->
        <div class="memo-sections">
          <div class="sections-header">
            <h3 class="section-title">Memo Sections</h3>
            <div class="view-controls">
              <button class="view-btn" [class.active]="viewMode === 'detailed'" (click)="setViewMode('detailed')">
                Detailed View
              </button>
              <button class="view-btn" [class.active]="viewMode === 'summary'" (click)="setViewMode('summary')">
                Summary View
              </button>
            </div>
          </div>
          
          <div class="sections-list">
            <div class="section-item" *ngFor="let section of currentMemo.sections">
              <div class="section-header">
                <h4 class="section-title">{{ section.title }}</h4>
                <div class="section-meta">
                  <div class="confidence-indicator">
                    <div class="confidence-bar">
                      <div class="confidence-fill" [style.width.%]="section.confidence"></div>
                    </div>
                    <span class="confidence-text">{{ section.confidence }}%</span>
                  </div>
                  <div class="weight-indicator">
                    <span class="weight-label">Weight:</span>
                    <span class="weight-value">{{ section.weight }}%</span>
                  </div>
                </div>
              </div>
              
              <div class="section-content" [class.summary]="viewMode === 'summary'">
                <div class="section-text" [innerHTML]="section.content"></div>
                
                <div class="section-subsections" *ngIf="section.subsections && section.subsections.length > 0">
                  <div class="subsection" *ngFor="let subsection of section.subsections">
                    <h5 class="subsection-title">{{ subsection.title }}</h5>
                    <div class="subsection-content" [innerHTML]="subsection.content"></div>
                    <div class="subsection-meta">
                      <span class="subsection-confidence">{{ subsection.confidence }}% confidence</span>
                      <span class="subsection-weight">{{ subsection.weight }}% weight</span>
                    </div>
                  </div>
                </div>
                
                <div class="section-visualizations" *ngIf="section.visualizations && section.visualizations.length > 0">
                  <div class="visualization" *ngFor="let viz of section.visualizations">
                    <h5 class="viz-title">{{ viz.title }}</h5>
                    <div class="viz-content">
                      <!-- Placeholder for actual visualization -->
                      <div class="viz-placeholder">
                        <svg viewBox="0 0 200 100" fill="none" stroke="currentColor">
                          <rect x="10" y="10" width="180" height="80" rx="4" fill="currentColor" opacity="0.1"/>
                          <text x="100" y="55" text-anchor="middle" font-size="14" fill="currentColor">
                            {{ viz.type }} Chart
                          </text>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Key Insights -->
        <div class="key-insights-section">
          <h3 class="section-title">Key Insights</h3>
          <div class="insights-grid">
            <div class="insight-card" *ngFor="let insight of currentMemo.keyInsights">
              <div class="insight-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <div class="insight-content">
                <p class="insight-text">{{ insight }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Recommendations -->
        <div class="recommendations-section">
          <h3 class="section-title">Recommendations</h3>
          <div class="recommendations-list">
            <div class="recommendation-item" *ngFor="let rec of currentMemo.recommendations; let i = index">
              <div class="rec-number">{{ i + 1 }}</div>
              <div class="rec-content">
                <h4 class="rec-title">{{ rec.title }}</h4>
                <p class="rec-description">{{ rec.description }}</p>
                <div class="rec-priority" [class]="'priority-' + rec.priority">
                  {{ rec.priority }} Priority
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="action-buttons">
          <button class="btn btn-outline btn-lg" (click)="downloadMemo()">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7,10 12,15 17,10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download PDF
          </button>
          <button class="btn btn-outline btn-lg" (click)="shareMemo()">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16,6 12,2 8,6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
            Share
          </button>
          <button class="btn btn-primary btn-lg" (click)="approveMemo()">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 12l2 2 4-4"></path>
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
            </svg>
            Approve for IC
          </button>
        </div>
      </div>
      
      <!-- Preferences Modal -->
      <div class="modal" [class.show]="showPreferencesModal" *ngIf="showPreferencesModal">
        <div class="modal-content large">
          <div class="modal-header">
            <h3 class="modal-title">Configure Report Analysis Preferences</h3>
            <p class="modal-subtitle">Set up your analysis preferences for this specific report</p>
            <button class="modal-close" (click)="closePreferencesModal()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="preferences-form">
              <div class="preference-group">
                <h4 class="group-title">Section Weights</h4>
                <div class="weight-controls">
                  <div class="weight-control" *ngFor="let section of sectionWeights">
                    <label class="weight-label">{{ section.name }}</label>
                    <div class="weight-slider">
                      <input type="range" 
                             min="0" 
                             max="100" 
                             [(ngModel)]="section.weight"
                             class="slider">
                      <span class="weight-value">{{ section.weight }}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="preference-group">
                <h4 class="group-title">Display Options</h4>
                <div class="checkbox-controls">
                  <label class="checkbox-label">
                    <input type="checkbox" [(ngModel)]="preferences.visualizationsEnabled">
                    <span class="checkmark"></span>
                    Enable Visualizations
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" [(ngModel)]="preferences.riskFlagsEnabled">
                    <span class="checkmark"></span>
                    Show Risk Flags
                  </label>
                </div>
              </div>
              
              <div class="preference-group">
                <h4 class="group-title">Confidence Threshold</h4>
                <div class="threshold-control">
                  <input type="range" 
                         min="0" 
                         max="100" 
                         [(ngModel)]="preferences.confidenceThreshold"
                         class="slider">
                  <span class="threshold-value">{{ preferences.confidenceThreshold }}%</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" (click)="closePreferencesModal()">Cancel</button>
            <button class="btn btn-primary" (click)="savePreferences()">Save Preferences</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stage-2 {
      padding: var(--space-6);
      max-width: 1200px;
      margin: 0 auto;
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
      color: var(--text-dark);
      margin-bottom: var(--space-2);
    }
    
    .stage-description {
      font-size: var(--font-size-lg);
      color: var(--text-medium);
      margin: 0;
    }
    
    .stage-actions {
      display: flex;
      gap: var(--space-3);
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
    
    .memo-overview {
      background-color: var(--white);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--medium-gray);
      padding: var(--space-6);
    }
    
    .overview-header {
      margin-bottom: var(--space-6);
    }
    
    .memo-title {
      font-size: var(--font-size-3xl);
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: var(--space-2);
    }
    
    .memo-meta {
      display: flex;
      gap: var(--space-4);
      font-size: var(--font-size-sm);
      color: var(--text-medium);
    }
    
    .company-name {
      font-weight: 600;
      color: var(--primary-blue);
    }
    
    .memo-version {
      background-color: var(--light-gray);
      padding: 2px 8px;
      border-radius: 4px;
    }
    
    .overview-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: var(--space-4);
    }
    
    .metric-card {
      text-align: center;
      padding: var(--space-4);
      background-color: var(--off-white);
      border-radius: var(--radius-lg);
    }
    
    .metric-value {
      font-size: var(--font-size-3xl);
      font-weight: 700;
      color: var(--primary-blue);
      margin-bottom: var(--space-1);
    }
    
    .metric-label {
      font-size: var(--font-size-sm);
      color: var(--text-medium);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .risk-flags-section, .memo-sections, .key-insights-section, .recommendations-section {
      background-color: var(--white);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--medium-gray);
      padding: var(--space-6);
    }
    
    .section-title {
      font-size: var(--font-size-2xl);
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: var(--space-6);
    }
    
    .risk-flags-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-4);
    }
    
    .risk-flag {
      padding: var(--space-4);
      border-radius: var(--radius-lg);
      border-left: 4px solid;
    }
    
    .severity-low {
      background-color: rgb(245 158 11 / 0.1);
      border-left-color: var(--warning);
    }
    
    .severity-medium {
      background-color: rgb(239 68 68 / 0.1);
      border-left-color: var(--error);
    }
    
    .severity-high {
      background-color: rgb(220 38 38 / 0.1);
      border-left-color: #dc2626;
    }
    
    .severity-critical {
      background-color: rgb(127 29 29 / 0.1);
      border-left-color: #7f1d1d;
    }
    
    .flag-header {
      display: flex;
      gap: var(--space-3);
    }
    
    .flag-icon {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      margin-top: 2px;
    }
    
    .flag-icon svg {
      width: 100%;
      height: 100%;
    }
    
    .flag-content {
      flex: 1;
    }
    
    .flag-title {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: var(--space-1);
    }
    
    .flag-description {
      color: var(--text-medium);
      margin-bottom: var(--space-2);
    }
    
    .flag-meta {
      display: flex;
      gap: var(--space-3);
      font-size: var(--font-size-xs);
      color: var(--text-light);
    }
    
    .sections-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-6);
    }
    
    .view-controls {
      display: flex;
      gap: var(--space-2);
    }
    
    .view-btn {
      padding: var(--space-2) var(--space-4);
      background-color: var(--off-white);
      border: 1px solid var(--medium-gray);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    
    .view-btn.active {
      background-color: var(--primary-blue);
      color: var(--white);
      border-color: var(--primary-blue);
    }
    
    .sections-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }
    
    .section-item {
      border: 1px solid var(--medium-gray);
      border-radius: var(--radius-lg);
      padding: var(--space-6);
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
    }
    
    .section-title {
      font-size: var(--font-size-xl);
      font-weight: 600;
      color: var(--text-dark);
      margin: 0;
    }
    
    .section-meta {
      display: flex;
      gap: var(--space-4);
      align-items: center;
    }
    
    .confidence-indicator {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    
    .confidence-bar {
      width: 80px;
      height: 6px;
      background-color: var(--light-gray);
      border-radius: 3px;
      overflow: hidden;
    }
    
    .confidence-fill {
      height: 100%;
      background-color: var(--success);
      transition: width var(--transition-normal);
    }
    
    .confidence-text {
      font-size: var(--font-size-sm);
      font-weight: 500;
      color: var(--text-medium);
    }
    
    .weight-indicator {
      font-size: var(--font-size-sm);
      color: var(--text-medium);
    }
    
    .weight-label {
      margin-right: var(--space-1);
    }
    
    .weight-value {
      font-weight: 600;
      color: var(--primary-blue);
    }
    
    .section-content {
      line-height: 1.6;
    }
    
    .section-content.summary {
      max-height: 200px;
      overflow: hidden;
      position: relative;
    }
    
    .section-content.summary::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40px;
      background: linear-gradient(transparent, var(--white));
    }
    
    .section-subsections {
      margin-top: var(--space-4);
    }
    
    .subsection {
      margin-bottom: var(--space-4);
      padding: var(--space-4);
      background-color: var(--off-white);
      border-radius: var(--radius-md);
    }
    
    .subsection-title {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: var(--space-2);
    }
    
    .subsection-content {
      color: var(--text-medium);
      margin-bottom: var(--space-2);
    }
    
    .subsection-meta {
      display: flex;
      gap: var(--space-4);
      font-size: var(--font-size-xs);
      color: var(--text-light);
    }
    
    .section-visualizations {
      margin-top: var(--space-4);
    }
    
    .visualization {
      margin-bottom: var(--space-4);
    }
    
    .viz-title {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: var(--space-2);
    }
    
    .viz-placeholder {
      width: 100%;
      height: 200px;
      background-color: var(--off-white);
      border: 1px solid var(--medium-gray);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-light);
    }
    
    .insights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-4);
    }
    
    .insight-card {
      display: flex;
      gap: var(--space-3);
      padding: var(--space-4);
      background-color: var(--off-white);
      border-radius: var(--radius-lg);
    }
    
    .insight-icon {
      width: 24px;
      height: 24px;
      color: var(--primary-blue);
      flex-shrink: 0;
      margin-top: 2px;
    }
    
    .insight-icon svg {
      width: 100%;
      height: 100%;
    }
    
    .insight-content {
      flex: 1;
    }
    
    .insight-text {
      color: var(--text-medium);
      margin: 0;
    }
    
    .recommendations-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }
    
    .recommendation-item {
      display: flex;
      gap: var(--space-4);
      padding: var(--space-4);
      background-color: var(--off-white);
      border-radius: var(--radius-lg);
    }
    
    .rec-number {
      width: 32px;
      height: 32px;
      background-color: var(--primary-blue);
      color: var(--white);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      flex-shrink: 0;
    }
    
    .rec-content {
      flex: 1;
    }
    
    .rec-title {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: var(--space-1);
    }
    
    .rec-description {
      color: var(--text-medium);
      margin-bottom: var(--space-2);
    }
    
    .rec-priority {
      font-size: var(--font-size-xs);
      font-weight: 500;
      padding: 2px 8px;
      border-radius: 12px;
      text-transform: uppercase;
    }
    
    .priority-high {
      background-color: rgb(239 68 68 / 0.1);
      color: var(--error);
    }
    
    .priority-medium {
      background-color: rgb(245 158 11 / 0.1);
      color: var(--warning);
    }
    
    .priority-low {
      background-color: rgb(16 185 129 / 0.1);
      color: var(--success);
    }
    
    .action-buttons {
      display: flex;
      gap: var(--space-4);
      justify-content: center;
      padding: var(--space-8) 0;
    }
    
    .btn-lg {
      padding: var(--space-4) var(--space-8);
      font-size: var(--font-size-lg);
    }
    
    .modal.large .modal-content {
      max-width: 800px;
    }
    
    .modal-subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-medium);
      margin: var(--space-2) 0 0 0;
    }
    
    .preferences-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-8);
    }
    
    .preference-group {
      border: 1px solid var(--medium-gray);
      border-radius: var(--radius-lg);
      padding: var(--space-6);
    }
    
    .group-title {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: var(--space-4);
    }
    
    .weight-controls {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }
    
    .weight-control {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .weight-label {
      font-weight: 500;
      color: var(--text-dark);
      min-width: 150px;
    }
    
    .weight-slider {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      flex: 1;
      max-width: 300px;
    }
    
    .slider {
      flex: 1;
      height: 6px;
      background: var(--light-gray);
      border-radius: 3px;
      outline: none;
      -webkit-appearance: none;
    }
    
    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px;
      height: 20px;
      background: var(--primary-blue);
      border-radius: 50%;
      cursor: pointer;
    }
    
    .weight-value, .threshold-value {
      font-weight: 600;
      color: var(--primary-blue);
      min-width: 40px;
      text-align: right;
    }
    
    .checkbox-controls {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      cursor: pointer;
    }
    
    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: var(--primary-blue);
    }
    
    .threshold-control {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }
    
    @media (max-width: 768px) {
      .stage-2 {
        padding: var(--space-4);
      }
      
      .stage-header {
        flex-direction: column;
        align-items: stretch;
        gap: var(--space-4);
      }
      
      .stage-actions {
        flex-direction: column;
      }
      
      .overview-metrics {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .risk-flags-grid {
        grid-template-columns: 1fr;
      }
      
      .insights-grid {
        grid-template-columns: 1fr;
      }
      
      .action-buttons {
        flex-direction: column;
      }
      
      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-2);
      }
      
      .section-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-2);
      }
    }
  `]
})
export class Stage2Component implements OnInit {
  @Input() reportId: string = '';
  @Output() stageComplete = new EventEmitter<number>();

  isRegenerating = false;
  viewMode: 'detailed' | 'summary' = 'detailed';
  showPreferencesModal = false;
  
  // Button state management
  canRegenerateMemo = false;
  
  sectionWeights = [
    { name: 'Founder Profile', weight: 25 },
    { name: 'Market Analysis', weight: 20 },
    { name: 'Competitive Landscape', weight: 15 },
    { name: 'Financial Projections', weight: 20 },
    { name: 'Risk Assessment', weight: 20 }
  ];
  
  preferences = {
    visualizationsEnabled: true,
    riskFlagsEnabled: true,
    confidenceThreshold: 70
  };
  
  currentMemo = {
    id: '1',
    title: 'TechCorp Series A Investment Memo',
    companyName: 'TechCorp Inc.',
    version: 2,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    sections: [
      {
        title: 'Founder Profile',
        content: 'The founding team consists of three experienced entrepreneurs with deep domain expertise in enterprise software. CEO John Smith has 15 years of experience in B2B SaaS, previously co-founded and successfully exited two companies. CTO Sarah Johnson brings strong technical leadership from her time at major tech companies. COO Mike Chen has operational expertise from scaling startups.',
        confidence: 92,
        weight: 25,
        subsections: [
          {
            title: 'Leadership Experience',
            content: 'Strong track record of building and scaling technology companies.',
            confidence: 95,
            weight: 40
          },
          {
            title: 'Domain Expertise',
            content: 'Deep understanding of enterprise software market and customer needs.',
            confidence: 90,
            weight: 35
          }
        ],
        visualizations: [
          {
            title: 'Founder Experience Timeline',
            type: 'timeline'
          }
        ]
      },
      {
        title: 'Market Analysis',
        content: 'The enterprise software market is experiencing rapid growth, driven by digital transformation initiatives. The total addressable market (TAM) is estimated at $500B, with the serviceable addressable market (SAM) at $50B. TechCorp is positioned in the high-growth segment of workflow automation, which is growing at 25% annually.',
        confidence: 88,
        weight: 20,
        subsections: [
          {
            title: 'Market Size',
            content: 'TAM: $500B, SAM: $50B, SOM: $5B',
            confidence: 85,
            weight: 30
          },
          {
            title: 'Growth Rate',
            content: '25% annual growth in workflow automation segment',
            confidence: 90,
            weight: 30
          }
        ],
        visualizations: [
          {
            title: 'Market Size Breakdown',
            type: 'chart'
          }
        ]
      }
    ],
    averageConfidence: 90,
    riskFlags: [
      {
        id: '1',
        title: 'High Customer Concentration',
        description: 'Top 3 customers represent 60% of revenue, creating significant concentration risk.',
        type: 'financial',
        severity: 'high',
        section: 'Financial Analysis',
        confidence: 85
      },
      {
        id: '2',
        title: 'Competitive Pressure',
        description: 'Large incumbents are entering the market with significant resources.',
        type: 'competitive',
        severity: 'medium',
        section: 'Competitive Landscape',
        confidence: 78
      }
    ],
    keyInsights: [
      'Strong founding team with relevant experience and successful exits',
      'Large and growing market with clear customer demand',
      'Differentiated technology with strong IP portfolio',
      'Early traction with enterprise customers showing product-market fit'
    ],
    recommendations: [
      {
        title: 'Proceed with Investment',
        description: 'Strong recommendation to proceed with Series A investment based on team, market, and traction.',
        priority: 'high'
      },
      {
        title: 'Focus on Customer Diversification',
        description: 'Work with management to reduce customer concentration risk.',
        priority: 'medium'
      }
    ]
  };

  ngOnInit(): void {
    // Check if Stage 1 is completed before enabling memo regeneration
    this.checkStage1Completion();
    // Check if this is the first time accessing stage 2 for this report
    this.checkFirstTimeAccess();
  }

  private checkStage1Completion(): void {
    // Check if Stage 1 has generated any memos
    // This would typically come from a service or API call
    // For now, we'll simulate checking if Stage 1 memos exist
    const stage1Memos = localStorage.getItem(`stage1-memos-${this.reportId}`);
    if (stage1Memos) {
      try {
        const memos = JSON.parse(stage1Memos);
        this.canRegenerateMemo = memos && memos.length > 0;
      } catch (error) {
        console.error('Error parsing Stage 1 memos:', error);
        this.canRegenerateMemo = false;
      }
    } else {
      // If no Stage 1 memos found, check if we have any generated memos in current data
      this.canRegenerateMemo = !!(this.currentMemo && this.currentMemo.id);
    }
    
    console.log(`Stage 1 completion check: Can regenerate memo: ${this.canRegenerateMemo}`);
  }

  private checkFirstTimeAccess(): void {
    // Check if preferences have been set for this report
    const reportPreferences = localStorage.getItem(`report-preferences-${this.reportId}`);
    if (!reportPreferences) {
      // First time access - show preferences popup
      setTimeout(() => {
        this.showPreferencesModal = true;
      }, 500); // Small delay to ensure component is fully loaded
    }
  }

  editPreferences(): void {
    this.showPreferencesModal = true;
  }

  closePreferencesModal(): void {
    this.showPreferencesModal = false;
  }

  savePreferences(): void {
    console.log('Saving preferences:', this.preferences);
    
    // Save preferences for this specific report
    const reportPreferences = {
      sectionWeights: this.sectionWeights,
      preferences: this.preferences,
      reportId: this.reportId,
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem(`report-preferences-${this.reportId}`, JSON.stringify(reportPreferences));
    
    this.closePreferencesModal();
    
    // Regenerate memo with new preferences
    this.regenerateMemo();
  }

  regenerateMemo(): void {
    this.isRegenerating = true;
    // Simulate regeneration
    setTimeout(() => {
      this.isRegenerating = false;
    }, 3000);
  }

  setViewMode(mode: 'detailed' | 'summary'): void {
    this.viewMode = mode;
  }

  downloadMemo(): void {
    console.log('Downloading memo as PDF');
    // Implementation would generate and download PDF
  }

  shareMemo(): void {
    console.log('Sharing memo');
    // Implementation would open share dialog
  }

  approveMemo(): void {
    console.log('Approving memo for Investment Committee');
    // Implementation would submit for approval
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

  goBack(): void {
    this.stageComplete.emit(1); // Go back to Stage 1
  }

  proceedToNext(): void {
    this.stageComplete.emit(3); // Complete all stages
  }
}
