import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Sidebar Component
 * 
 * Main navigation sidebar with stage-based workflow navigation.
 * Implements responsive design with collapsible mobile menu.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="sidebar">
      <div class="sidebar-header">
        <h2 class="sidebar-title">Workflow</h2>
        <p class="sidebar-subtitle">AI-Powered Investment Analysis</p>
      </div>
      
      <div class="sidebar-content">
        <div class="nav-section">
          <h3 class="nav-section-title">Main Navigation</h3>
          <ul class="nav-list">
            <li class="nav-item">
              <a routerLink="/reports" routerLinkActive="active" class="nav-link">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10,9 9,9 8,9"></polyline>
                </svg>
                <span class="nav-text">My Reports</span>
              </a>
            </li>
          </ul>
        </div>
        
        <div class="nav-section">
          <h3 class="nav-section-title">Analysis Stages</h3>
          <ul class="nav-list">
            <li class="nav-item">
              <a routerLink="/stage-0" routerLinkActive="active" class="nav-link">
                <div class="stage-indicator stage-0"></div>
                <div class="nav-content">
                  <span class="nav-text">Stage 0: Data Collection</span>
                  <span class="nav-description">Upload sources & trigger AI agents</span>
                </div>
                <div class="nav-status" [class.completed]="stage0Completed">
                  <svg *ngIf="stage0Completed" class="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                  <span *ngIf="!stage0Completed" class="status-count">{{ stage0PendingCount }}</span>
                </div>
              </a>
            </li>
            <li class="nav-item">
              <a routerLink="/stage-1" routerLinkActive="active" class="nav-link" [class.disabled]="!stage0Completed">
                <div class="stage-indicator stage-1"></div>
                <div class="nav-content">
                  <span class="nav-text">Stage 1: AI-Generated Memo</span>
                  <span class="nav-description">AI synthesizes data into memos</span>
                </div>
                <div class="nav-status" [class.completed]="stage1Completed">
                  <svg *ngIf="stage1Completed" class="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                  <span *ngIf="!stage1Completed && stage0Completed" class="status-count">{{ stage1PendingCount }}</span>
                </div>
              </a>
            </li>
            <li class="nav-item">
              <a routerLink="/stage-2" routerLinkActive="active" class="nav-link" [class.disabled]="!stage1Completed">
                <div class="stage-indicator stage-2"></div>
                <div class="nav-content">
                  <span class="nav-text">Stage 2: Curated Memo</span>
                  <span class="nav-description">Final curated investment memo</span>
                </div>
                <div class="nav-status" [class.completed]="stage2Completed">
                  <svg *ngIf="stage2Completed" class="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                  <span *ngIf="!stage2Completed && stage1Completed" class="status-count">{{ stage2PendingCount }}</span>
                </div>
              </a>
            </li>
          </ul>
        </div>
        
        <div class="nav-section">
          <h3 class="nav-section-title">AI Agents</h3>
          <ul class="nav-list">
            <li class="nav-item" *ngFor="let agent of aiAgents">
              <div class="nav-link agent-link" [class.running]="agent.status === 'running'">
                <div class="agent-indicator" [class.running]="agent.status === 'running'"></div>
                <div class="nav-content">
                  <span class="nav-text">{{ agent.name }}</span>
                  <span class="nav-description">{{ agent.description }}</span>
                </div>
                <div class="agent-status">
                  <span class="status-badge" [class]="'status-' + agent.status">{{ agent.status }}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
        
        <div class="nav-section">
          <h3 class="nav-section-title">Settings</h3>
          <ul class="nav-list">
            <li class="nav-item">
              <a routerLink="/settings" routerLinkActive="active" class="nav-link">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
                </svg>
                <span class="nav-text">Preferences</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="sidebar-footer">
        <div class="progress-indicator">
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="overallProgress"></div>
          </div>
          <span class="progress-text">{{ overallProgress }}% Complete</span>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      height: 100%;
      background-color: var(--white);
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }
    
    .sidebar-header {
      padding: var(--space-6);
      border-bottom: 1px solid var(--medium-gray);
    }
    
    .sidebar-title {
      font-size: var(--font-size-xl);
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: var(--space-1);
    }
    
    .sidebar-subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-medium);
      margin: 0;
    }
    
    .sidebar-content {
      flex: 1;
      padding: var(--space-4) 0;
    }
    
    .nav-section {
      margin-bottom: var(--space-8);
    }
    
    .nav-section-title {
      font-size: var(--font-size-xs);
      font-weight: 600;
      color: var(--text-light);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 var(--space-4) var(--space-6);
    }
    
    .nav-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    
    .nav-item {
      margin: 0;
    }
    
    .nav-link {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-6);
      color: var(--text-medium);
      text-decoration: none;
      transition: all var(--transition-fast);
      position: relative;
    }
    
    .nav-link:hover {
      background-color: var(--light-gray);
      color: var(--text-dark);
    }
    
    .nav-link.active {
      background-color: rgb(37 99 235 / 0.1);
      color: var(--primary-blue);
      border-right: 3px solid var(--primary-blue);
    }
    
    .nav-link.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }
    
    .nav-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }
    
    .nav-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }
    
    .nav-text {
      font-size: var(--font-size-sm);
      font-weight: 500;
    }
    
    .nav-description {
      font-size: var(--font-size-xs);
      color: var(--text-light);
    }
    
    .stage-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    
    .stage-indicator.stage-0 {
      background-color: var(--warning);
    }
    
    .stage-indicator.stage-1 {
      background-color: var(--info);
    }
    
    .stage-indicator.stage-2 {
      background-color: var(--success);
    }
    
    .nav-status {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    
    .status-icon {
      width: 16px;
      height: 16px;
      color: var(--success);
    }
    
    .status-count {
      background-color: var(--primary-blue);
      color: var(--white);
      font-size: var(--font-size-xs);
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 10px;
      min-width: 20px;
      text-align: center;
    }
    
    .agent-link {
      cursor: pointer;
    }
    
    .agent-link.running {
      background-color: rgb(16 185 129 / 0.1);
    }
    
    .agent-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--text-light);
      flex-shrink: 0;
    }
    
    .agent-indicator.running {
      background-color: var(--success);
      animation: pulse 2s infinite;
    }
    
    .agent-status {
      display: flex;
      align-items: center;
    }
    
    .status-badge {
      font-size: var(--font-size-xs);
      font-weight: 500;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: capitalize;
    }
    
    .status-idle {
      background-color: var(--light-gray);
      color: var(--text-medium);
    }
    
    .status-running {
      background-color: rgb(16 185 129 / 0.1);
      color: var(--success);
    }
    
    .status-completed {
      background-color: rgb(59 130 246 / 0.1);
      color: var(--info);
    }
    
    .status-failed {
      background-color: rgb(239 68 68 / 0.1);
      color: var(--error);
    }
    
    .sidebar-footer {
      padding: var(--space-6);
      border-top: 1px solid var(--medium-gray);
    }
    
    .progress-indicator {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }
    
    .progress-bar {
      width: 100%;
      height: 6px;
      background-color: var(--light-gray);
      border-radius: 3px;
      overflow: hidden;
    }
    
    .progress-fill {
      height: 100%;
      background-color: var(--primary-blue);
      transition: width var(--transition-normal);
    }
    
    .progress-text {
      font-size: var(--font-size-xs);
      color: var(--text-medium);
      text-align: center;
    }
    
    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        top: 0;
        left: -100%;
        width: 280px;
        height: 100vh;
        z-index: 1000;
        transition: left var(--transition-normal);
      }
      
      .sidebar.open {
        left: 0;
      }
    }
  `]
})
export class SidebarComponent {
  // Stage completion status
  stage0Completed = false;
  stage1Completed = false;
  stage2Completed = false;
  
  // Pending counts
  stage0PendingCount = 5;
  stage1PendingCount = 2;
  stage2PendingCount = 1;
  
  // Overall progress
  overallProgress = 35;
  
  // AI Agents status
  aiAgents = [
    {
      id: '1',
      name: 'Founder Voice Agent',
      description: 'Conducting founder interviews',
      status: 'running'
    },
    {
      id: '2',
      name: 'Deep Research Agent',
      description: 'Analyzing market data',
      status: 'idle'
    },
    {
      id: '3',
      name: 'Data Ingestion Agent',
      description: 'Processing uploaded files',
      status: 'completed'
    },
    {
      id: '4',
      name: 'Curated Memo Agent',
      description: 'Generating final memo',
      status: 'failed'
    }
  ];
}
