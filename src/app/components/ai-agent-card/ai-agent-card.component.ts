import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AIAgent {
  id: string;
  name: string;
  type: 'founder-voice' | 'behavioral-assessment' | 'deep-research' | 'data-ingestion';
  status: 'idle' | 'running' | 'completed' | 'error';
  progress: number;
  lastTriggered?: Date;
  results?: any;
  error?: string;
  description?: string;
}

@Component({
  selector: 'app-ai-agent-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="agent-card" [class]="'status-' + agent.status">
      <div class="agent-header">
        <div class="agent-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path [attr.d]="getAgentIcon(agent.type)"></path>
          </svg>
        </div>
        <div class="agent-info">
          <h4 class="agent-name">{{ agent.name }}</h4>
          <p class="agent-description">{{ agent.description || getAgentDescription(agent.type) }}</p>
        </div>
        <div class="agent-status">
          <span class="status-badge" [class]="'status-' + agent.status">
            {{ agent.status | titlecase }}
          </span>
        </div>
      </div>
      
      <div class="agent-content">
        <div *ngIf="agent.status === 'running'" class="progress-section">
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="agent.progress"></div>
          </div>
          <span class="progress-text">{{ agent.progress }}% complete</span>
        </div>
        
        <div *ngIf="agent.lastTriggered" class="last-triggered">
          Last triggered: {{ formatDate(agent.lastTriggered) }}
        </div>
        
        <div *ngIf="agent.error" class="error-message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          {{ agent.error }}
        </div>

        <div *ngIf="agent.status === 'completed' && agent.results" class="results-preview">
          <div class="results-summary">
            <span class="results-label">Results:</span>
            <span class="results-count">{{ getResultsCount(agent.results) }} items</span>
          </div>
        </div>
      </div>
      
      <div class="agent-actions">
        <button 
          class="agent-btn" 
          [class.running]="agent.status === 'running'"
          [disabled]="agent.status === 'running' || isDisabled"
          (click)="onTriggerAgent()"
        >
          <svg *ngIf="agent.status === 'running'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12,6 12,12 16,14"></polyline>
          </svg>
          <svg *ngIf="agent.status !== 'running'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polygon points="5,3 19,12 5,21"></polygon>
          </svg>
          {{ getButtonText() }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .agent-card {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      padding: 24px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .agent-card:hover {
      background: rgba(255, 255, 255, 0.12);
      transform: translateY(-2px);
    }

    .agent-card.status-running {
      border-color: #4facfe;
      background: rgba(79, 172, 254, 0.1);
    }

    .agent-card.status-completed {
      border-color: #28a745;
      background: rgba(40, 167, 69, 0.05);
    }

    .agent-card.status-error {
      border-color: #dc3545;
      background: rgba(220, 53, 69, 0.05);
    }

    .agent-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
    }

    .agent-icon {
      width: 56px;
      height: 56px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4facfe;
      flex-shrink: 0;
    }

    .agent-icon svg {
      width: 28px;
      height: 28px;
    }

    .agent-info {
      flex: 1;
      min-width: 0;
    }

    .agent-name {
      font-size: 20px;
      font-weight: 700;
      color: white;
      margin: 0 0 8px 0;
      line-height: 1.2;
    }

    .agent-description {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
      line-height: 1.4;
    }

    .agent-status {
      flex-shrink: 0;
    }

    .status-badge {
      padding: 6px 16px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-idle {
      background: rgba(108, 117, 125, 0.2);
      color: #6c757d;
    }

    .status-running {
      background: rgba(0, 123, 255, 0.2);
      color: #007bff;
    }

    .status-completed {
      background: rgba(40, 167, 69, 0.2);
      color: #28a745;
    }

    .status-error {
      background: rgba(220, 53, 69, 0.2);
      color: #dc3545;
    }

    .agent-content {
      margin-bottom: 20px;
    }

    .progress-section {
      margin-bottom: 16px;
    }

    .progress-bar {
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 8px;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
      border-radius: 4px;
      transition: width 0.3s ease;
      position: relative;
    }

    .progress-fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.3) 50%,
        transparent 100%
      );
      animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .progress-text {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
    }

    .last-triggered {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 12px;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #ff6b6b;
      background: rgba(255, 107, 107, 0.1);
      padding: 12px;
      border-radius: 8px;
      border: 1px solid rgba(255, 107, 107, 0.2);
    }

    .error-message svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    .results-preview {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 12px;
    }

    .results-summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .results-label {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
    }

    .results-count {
      font-size: 14px;
      color: #4facfe;
      font-weight: 600;
    }

    .agent-actions {
      margin-top: auto;
    }

    .agent-btn {
      width: 100%;
      padding: 16px 24px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      color: white;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .agent-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-1px);
    }

    .agent-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .agent-btn.running {
      background: rgba(0, 123, 255, 0.2);
      border-color: #007bff;
    }

    .agent-btn svg {
      width: 18px;
      height: 18px;
    }

    @media (max-width: 768px) {
      .agent-card {
        padding: 20px;
      }

      .agent-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .agent-icon {
        width: 48px;
        height: 48px;
      }

      .agent-icon svg {
        width: 24px;
        height: 24px;
      }

      .agent-name {
        font-size: 18px;
      }

      .agent-description {
        font-size: 13px;
      }
    }
  `]
})
export class AIAgentCardComponent {
  @Input() agent!: AIAgent;
  @Input() isDisabled = false;
  @Output() triggerAgent = new EventEmitter<AIAgent>();

  onTriggerAgent(): void {
    if (this.agent.status !== 'running' && !this.isDisabled) {
      this.triggerAgent.emit(this.agent);
    }
  }

  getButtonText(): string {
    switch (this.agent.status) {
      case 'running':
        return 'Running...';
      case 'completed':
        return 'Run Again';
      case 'error':
        return 'Retry';
      default:
        return 'Start';
    }
  }

  getAgentIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'founder-voice': 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
      'behavioral-assessment': 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z',
      'deep-research': 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5M7 10l5-5 5 5M12 15V3',
      'data-ingestion': 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4'
    };
    return icons[type] || 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';
  }

  getAgentDescription(type: string): string {
    const descriptions: { [key: string]: string } = {
      'founder-voice': 'Automated founder interviews with adaptive Q&A',
      'behavioral-assessment': 'Psychometric surveys via SMS/email',
      'deep-research': 'Comprehensive market and competitor analysis',
      'data-ingestion': 'Process and structure all collected data'
    };
    return descriptions[type] || 'AI agent for data processing';
  }

  getResultsCount(results: any): number {
    if (Array.isArray(results)) {
      return results.length;
    } else if (typeof results === 'object' && results !== null) {
      return Object.keys(results).length;
    }
    return 0;
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffMinutes < 1440) {
      const hours = Math.floor(diffMinutes / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffMinutes / 1440);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  }
}


