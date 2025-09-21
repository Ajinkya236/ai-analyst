import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Settings Component
 * 
 * Manages application settings, AI agent configurations, and user preferences.
 * Provides interface for customizing system behavior and appearance.
 */
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings">
      <div class="settings-header">
        <h1 class="settings-title">Settings</h1>
        <p class="settings-description">Configure your AI Analyst application preferences and agent settings</p>
      </div>
      
      <div class="settings-content">
        <div class="settings-nav">
          <button class="nav-item" 
                  [class.active]="activeTab === 'general'" 
                  (click)="setActiveTab('general')">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
            </svg>
            General
          </button>
          <button class="nav-item" 
                  [class.active]="activeTab === 'ai-agents'" 
                  (click)="setActiveTab('ai-agents')">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
            </svg>
            AI Agents
          </button>
          <button class="nav-item" 
                  [class.active]="activeTab === 'preferences'" 
                  (click)="setActiveTab('preferences')">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 12l2 2 4-4"></path>
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
            </svg>
            Preferences
          </button>
          <button class="nav-item" 
                  [class.active]="activeTab === 'notifications'" 
                  (click)="setActiveTab('notifications')">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            Notifications
          </button>
          <button class="nav-item" 
                  [class.active]="activeTab === 'security'" 
                  (click)="setActiveTab('security')">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <circle cx="12" cy="16" r="1"></circle>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Security
          </button>
        </div>
        
        <div class="settings-panel">
          <!-- General Settings -->
          <div class="settings-section" *ngIf="activeTab === 'general'">
            <h2 class="section-title">General Settings</h2>
            
            <div class="setting-group">
              <h3 class="group-title">Application</h3>
              <div class="setting-item">
                <div class="setting-info">
                  <label class="setting-label">Application Name</label>
                  <p class="setting-description">Customize the application name displayed in the header</p>
                </div>
                <input type="text" class="form-input" [(ngModel)]="settings.appName">
              </div>
              
              <div class="setting-item">
                <div class="setting-info">
                  <label class="setting-label">Default Language</label>
                  <p class="setting-description">Select your preferred language for the interface</p>
                </div>
                <select class="form-input" [(ngModel)]="settings.language">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              
              <div class="setting-item">
                <div class="setting-info">
                  <label class="setting-label">Theme</label>
                  <p class="setting-description">Choose your preferred color theme</p>
                </div>
                <div class="theme-options">
                  <label class="theme-option" [class.selected]="settings.theme === 'light'">
                    <input type="radio" name="theme" value="light" [(ngModel)]="settings.theme">
                    <div class="theme-preview light"></div>
                    <span>Light</span>
                  </label>
                  <label class="theme-option" [class.selected]="settings.theme === 'dark'">
                    <input type="radio" name="theme" value="dark" [(ngModel)]="settings.theme">
                    <div class="theme-preview dark"></div>
                    <span>Dark</span>
                  </label>
                  <label class="theme-option" [class.selected]="settings.theme === 'auto'">
                    <input type="radio" name="theme" value="auto" [(ngModel)]="settings.theme">
                    <div class="theme-preview auto"></div>
                    <span>Auto</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div class="setting-group">
              <h3 class="group-title">Data Management</h3>
              <div class="setting-item">
                <div class="setting-info">
                  <label class="setting-label">Auto-save Interval</label>
                  <p class="setting-description">How often to automatically save your work</p>
                </div>
                <select class="form-input" [(ngModel)]="settings.autoSaveInterval">
                  <option value="30">30 seconds</option>
                  <option value="60">1 minute</option>
                  <option value="300">5 minutes</option>
                  <option value="600">10 minutes</option>
                </select>
              </div>
              
              <div class="setting-item">
                <div class="setting-info">
                  <label class="setting-label">Data Retention</label>
                  <p class="setting-description">How long to keep completed analyses</p>
                </div>
                <select class="form-input" [(ngModel)]="settings.dataRetention">
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">1 year</option>
                  <option value="0">Forever</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- AI Agents Settings -->
          <div class="settings-section" *ngIf="activeTab === 'ai-agents'">
            <h2 class="section-title">AI Agent Configuration</h2>
            
            <div class="agents-list">
              <div class="agent-config" *ngFor="let agent of aiAgents">
                <div class="agent-header">
                  <div class="agent-info">
                    <h3 class="agent-name">{{ agent.name }}</h3>
                    <p class="agent-description">{{ agent.description }}</p>
                  </div>
                  <div class="agent-toggle">
                    <label class="toggle-switch">
                      <input type="checkbox" [(ngModel)]="agent.enabled">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div class="agent-settings" *ngIf="agent.enabled">
                  <div class="setting-item">
                    <label class="setting-label">Priority</label>
                    <select class="form-input" [(ngModel)]="agent.priority">
                      <option value="1">Low</option>
                      <option value="2">Medium</option>
                      <option value="3">High</option>
                      <option value="4">Critical</option>
                    </select>
                  </div>
                  
                  <div class="setting-item">
                    <label class="setting-label">Timeout (seconds)</label>
                    <input type="number" class="form-input" [(ngModel)]="agent.timeout" min="30" max="3600">
                  </div>
                  
                  <div class="setting-item">
                    <label class="setting-label">Retry Attempts</label>
                    <input type="number" class="form-input" [(ngModel)]="agent.retryAttempts" min="0" max="5">
                  </div>
                  
                  <div class="setting-item" *ngIf="agent.parameters">
                    <label class="setting-label">Parameters</label>
                    <div class="parameters-list">
                      <div class="parameter-item" *ngFor="let param of agent.parameters">
                        <label class="param-label">{{ param.name }}</label>
                        <input type="text" class="form-input" [(ngModel)]="param.value" [placeholder]="param.placeholder">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Preferences Settings -->
          <div class="settings-section" *ngIf="activeTab === 'preferences'">
            <h2 class="section-title">Analysis Preferences</h2>
            
            <div class="setting-group">
              <h3 class="group-title">Default Weights</h3>
              <div class="weights-config">
                <div class="weight-item" *ngFor="let weight of defaultWeights">
                  <label class="weight-label">{{ weight.name }}</label>
                  <div class="weight-control">
                    <input type="range" 
                           min="0" 
                           max="100" 
                           [(ngModel)]="weight.value"
                           class="weight-slider">
                    <span class="weight-value">{{ weight.value }}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="setting-group">
              <h3 class="group-title">Display Options</h3>
              <div class="checkbox-settings">
                <label class="checkbox-setting">
                  <input type="checkbox" [(ngModel)]="preferences.showConfidenceScores">
                  <span class="checkmark"></span>
                  <div class="checkbox-info">
                    <span class="checkbox-label">Show Confidence Scores</span>
                    <span class="checkbox-description">Display confidence percentages for all analysis sections</span>
                  </div>
                </label>
                
                <label class="checkbox-setting">
                  <input type="checkbox" [(ngModel)]="preferences.showRiskFlags">
                  <span class="checkmark"></span>
                  <div class="checkbox-info">
                    <span class="checkbox-label">Highlight Risk Flags</span>
                    <span class="checkbox-description">Emphasize potential risks and issues in analysis</span>
                  </div>
                </label>
                
                <label class="checkbox-setting">
                  <input type="checkbox" [(ngModel)]="preferences.enableVisualizations">
                  <span class="checkmark"></span>
                  <div class="checkbox-info">
                    <span class="checkbox-label">Enable Visualizations</span>
                    <span class="checkbox-description">Show charts and graphs in analysis reports</span>
                  </div>
                </label>
                
                <label class="checkbox-setting">
                  <input type="checkbox" [(ngModel)]="preferences.autoGenerateInsights">
                  <span class="checkmark"></span>
                  <div class="checkbox-info">
                    <span class="checkbox-label">Auto-generate Insights</span>
                    <span class="checkbox-description">Automatically generate key insights from analysis data</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          <!-- Notifications Settings -->
          <div class="settings-section" *ngIf="activeTab === 'notifications'">
            <h2 class="section-title">Notification Preferences</h2>
            
            <div class="setting-group">
              <h3 class="group-title">Email Notifications</h3>
              <div class="checkbox-settings">
                <label class="checkbox-setting">
                  <input type="checkbox" [(ngModel)]="notifications.analysisComplete">
                  <span class="checkmark"></span>
                  <div class="checkbox-info">
                    <span class="checkbox-label">Analysis Complete</span>
                    <span class="checkbox-description">Notify when AI analysis is finished</span>
                  </div>
                </label>
                
                <label class="checkbox-setting">
                  <input type="checkbox" [(ngModel)]="notifications.agentStatus">
                  <span class="checkmark"></span>
                  <div class="checkbox-info">
                    <span class="checkbox-label">Agent Status Updates</span>
                    <span class="checkbox-description">Notify about AI agent status changes</span>
                  </div>
                </label>
                
                <label class="checkbox-setting">
                  <input type="checkbox" [(ngModel)]="notifications.weeklySummary">
                  <span class="checkmark"></span>
                  <div class="checkbox-info">
                    <span class="checkbox-label">Weekly Summary</span>
                    <span class="checkbox-description">Receive weekly analysis summary reports</span>
                  </div>
                </label>
              </div>
            </div>
            
            <div class="setting-group">
              <h3 class="group-title">In-App Notifications</h3>
              <div class="checkbox-settings">
                <label class="checkbox-setting">
                  <input type="checkbox" [(ngModel)]="notifications.browserNotifications">
                  <span class="checkmark"></span>
                  <div class="checkbox-info">
                    <span class="checkbox-label">Browser Notifications</span>
                    <span class="checkbox-description">Show desktop notifications for important events</span>
                  </div>
                </label>
                
                <label class="checkbox-setting">
                  <input type="checkbox" [(ngModel)]="notifications.soundAlerts">
                  <span class="checkmark"></span>
                  <div class="checkbox-info">
                    <span class="checkbox-label">Sound Alerts</span>
                    <span class="checkbox-description">Play sounds for notifications</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          <!-- Security Settings -->
          <div class="settings-section" *ngIf="activeTab === 'security'">
            <h2 class="section-title">Security & Privacy</h2>
            
            <div class="setting-group">
              <h3 class="group-title">Data Security</h3>
              <div class="setting-item">
                <div class="setting-info">
                  <label class="setting-label">Data Encryption</label>
                  <p class="setting-description">Encrypt all data at rest and in transit</p>
                </div>
                <div class="security-status enabled">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 12l2 2 4-4"></path>
                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                  </svg>
                  Enabled
                </div>
              </div>
              
              <div class="setting-item">
                <div class="setting-info">
                  <label class="setting-label">Session Timeout</label>
                  <p class="setting-description">Automatically log out after period of inactivity</p>
                </div>
                <select class="form-input" [(ngModel)]="security.sessionTimeout">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="240">4 hours</option>
                  <option value="0">Never</option>
                </select>
              </div>
            </div>
            
            <div class="setting-group">
              <h3 class="group-title">Privacy</h3>
              <div class="checkbox-settings">
                <label class="checkbox-setting">
                  <input type="checkbox" [(ngModel)]="privacy.analyticsTracking">
                  <span class="checkmark"></span>
                  <div class="checkbox-info">
                    <span class="checkbox-label">Analytics Tracking</span>
                    <span class="checkbox-description">Allow anonymous usage analytics to improve the product</span>
                  </div>
                </label>
                
                <label class="checkbox-setting">
                  <input type="checkbox" [(ngModel)]="privacy.errorReporting">
                  <span class="checkmark"></span>
                  <div class="checkbox-info">
                    <span class="checkbox-label">Error Reporting</span>
                    <span class="checkbox-description">Automatically report errors to help improve stability</span>
                  </div>
                </label>
              </div>
            </div>
            
            <div class="setting-group">
              <h3 class="group-title">Data Export</h3>
              <div class="setting-item">
                <div class="setting-info">
                  <label class="setting-label">Export All Data</label>
                  <p class="setting-description">Download all your analysis data and settings</p>
                </div>
                <button class="btn btn-outline" (click)="exportData()">
                  <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7,10 12,15 17,10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Save Button -->
      <div class="settings-footer">
        <button class="btn btn-outline" (click)="resetSettings()">
          Reset to Defaults
        </button>
        <button class="btn btn-primary" (click)="saveSettings()">
          Save Settings
        </button>
      </div>
    </div>
  `,
  styles: [`
    .settings {
      padding: var(--space-6);
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .settings-header {
      margin-bottom: var(--space-8);
      padding-bottom: var(--space-6);
      border-bottom: 1px solid var(--medium-gray);
    }
    
    .settings-title {
      font-size: var(--font-size-4xl);
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: var(--space-2);
    }
    
    .settings-description {
      font-size: var(--font-size-lg);
      color: var(--text-medium);
      margin: 0;
    }
    
    .settings-content {
      display: flex;
      gap: var(--space-8);
      margin-bottom: var(--space-8);
    }
    
    .settings-nav {
      width: 250px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }
    
    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4);
      background: none;
      border: 1px solid var(--medium-gray);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-fast);
      text-align: left;
    }
    
    .nav-item:hover {
      background-color: var(--light-gray);
      border-color: var(--primary-blue);
    }
    
    .nav-item.active {
      background-color: var(--primary-blue);
      color: var(--white);
      border-color: var(--primary-blue);
    }
    
    .nav-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }
    
    .settings-panel {
      flex: 1;
      background-color: var(--white);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--medium-gray);
      padding: var(--space-6);
    }
    
    .settings-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-8);
    }
    
    .section-title {
      font-size: var(--font-size-2xl);
      font-weight: 600;
      color: var(--text-dark);
      margin: 0 0 var(--space-6) 0;
    }
    
    .setting-group {
      border: 1px solid var(--medium-gray);
      border-radius: var(--radius-lg);
      padding: var(--space-6);
    }
    
    .group-title {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: var(--space-6);
    }
    
    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-4) 0;
      border-bottom: 1px solid var(--light-gray);
    }
    
    .setting-item:last-child {
      border-bottom: none;
    }
    
    .setting-info {
      flex: 1;
      margin-right: var(--space-6);
    }
    
    .setting-label {
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: var(--space-1);
      display: block;
    }
    
    .setting-description {
      font-size: var(--font-size-sm);
      color: var(--text-medium);
      margin: 0;
    }
    
    .form-input {
      width: 200px;
      padding: var(--space-3) var(--space-4);
      border: 1px solid var(--medium-gray);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
    }
    
    .theme-options {
      display: flex;
      gap: var(--space-4);
    }
    
    .theme-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      cursor: pointer;
      padding: var(--space-3);
      border: 2px solid var(--medium-gray);
      border-radius: var(--radius-lg);
      transition: all var(--transition-fast);
    }
    
    .theme-option:hover {
      border-color: var(--primary-blue);
    }
    
    .theme-option.selected {
      border-color: var(--primary-blue);
      background-color: rgb(37 99 235 / 0.05);
    }
    
    .theme-option input {
      display: none;
    }
    
    .theme-preview {
      width: 40px;
      height: 30px;
      border-radius: var(--radius-md);
      border: 1px solid var(--medium-gray);
    }
    
    .theme-preview.light {
      background: linear-gradient(to bottom, #ffffff 50%, #f8fafc 50%);
    }
    
    .theme-preview.dark {
      background: linear-gradient(to bottom, #1e293b 50%, #0f172a 50%);
    }
    
    .theme-preview.auto {
      background: linear-gradient(45deg, #ffffff 50%, #1e293b 50%);
    }
    
    .agents-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }
    
    .agent-config {
      border: 1px solid var(--medium-gray);
      border-radius: var(--radius-lg);
      padding: var(--space-6);
    }
    
    .agent-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
    }
    
    .agent-name {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: var(--space-1);
    }
    
    .agent-description {
      color: var(--text-medium);
      margin: 0;
    }
    
    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 24px;
    }
    
    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    
    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--medium-gray);
      transition: var(--transition-fast);
      border-radius: 24px;
    }
    
    .toggle-slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: var(--white);
      transition: var(--transition-fast);
      border-radius: 50%;
    }
    
    input:checked + .toggle-slider {
      background-color: var(--primary-blue);
    }
    
    input:checked + .toggle-slider:before {
      transform: translateX(26px);
    }
    
    .agent-settings {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-4);
    }
    
    .parameters-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    
    .parameter-item {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }
    
    .param-label {
      font-size: var(--font-size-sm);
      font-weight: 500;
      color: var(--text-dark);
    }
    
    .weights-config {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }
    
    .weight-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .weight-label {
      font-weight: 500;
      color: var(--text-dark);
      min-width: 150px;
    }
    
    .weight-control {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      flex: 1;
      max-width: 300px;
    }
    
    .weight-slider {
      flex: 1;
      height: 6px;
      background: var(--light-gray);
      border-radius: 3px;
      outline: none;
      -webkit-appearance: none;
    }
    
    .weight-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px;
      height: 20px;
      background: var(--primary-blue);
      border-radius: 50%;
      cursor: pointer;
    }
    
    .weight-value {
      font-weight: 600;
      color: var(--primary-blue);
      min-width: 40px;
      text-align: right;
    }
    
    .checkbox-settings {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }
    
    .checkbox-setting {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
      cursor: pointer;
    }
    
    .checkbox-setting input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: var(--primary-blue);
      margin-top: 2px;
    }
    
    .checkbox-info {
      flex: 1;
    }
    
    .checkbox-label {
      font-weight: 500;
      color: var(--text-dark);
      display: block;
      margin-bottom: var(--space-1);
    }
    
    .checkbox-description {
      font-size: var(--font-size-sm);
      color: var(--text-medium);
    }
    
    .security-status {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: 500;
    }
    
    .security-status.enabled {
      background-color: rgb(16 185 129 / 0.1);
      color: var(--success);
    }
    
    .security-status svg {
      width: 16px;
      height: 16px;
    }
    
    .settings-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-4);
      padding-top: var(--space-6);
      border-top: 1px solid var(--medium-gray);
    }
    
    .btn-icon {
      width: 20px;
      height: 20px;
    }
    
    @media (max-width: 768px) {
      .settings {
        padding: var(--space-4);
      }
      
      .settings-content {
        flex-direction: column;
      }
      
      .settings-nav {
        width: 100%;
        flex-direction: row;
        overflow-x: auto;
        padding-bottom: var(--space-2);
      }
      
      .nav-item {
        white-space: nowrap;
        flex-shrink: 0;
      }
      
      .setting-item {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-3);
      }
      
      .setting-info {
        margin-right: 0;
      }
      
      .form-input {
        width: 100%;
      }
      
      .theme-options {
        flex-direction: column;
      }
      
      .agent-settings {
        grid-template-columns: 1fr;
      }
      
      .weight-item {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-2);
      }
      
      .weight-control {
        max-width: none;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  activeTab = 'general';
  
  settings = {
    appName: 'AI Analyst',
    language: 'en',
    theme: 'light',
    autoSaveInterval: 60,
    dataRetention: 365
  };
  
  aiAgents = [
    {
      id: '1',
      name: 'Founder Voice Agent',
      description: 'Conducts structured interviews with founders',
      enabled: true,
      priority: 3,
      timeout: 1800,
      retryAttempts: 2,
      parameters: [
        { name: 'Interview Duration', value: '30', placeholder: 'Minutes' },
        { name: 'Question Count', value: '15', placeholder: 'Number of questions' }
      ]
    },
    {
      id: '2',
      name: 'Behavioral Assessment Agent',
      description: 'Sends and processes psychometric surveys',
      enabled: true,
      priority: 2,
      timeout: 900,
      retryAttempts: 1,
      parameters: [
        { name: 'Survey Type', value: 'Big Five', placeholder: 'Assessment type' },
        { name: 'Response Timeout', value: '7', placeholder: 'Days' }
      ]
    },
    {
      id: '3',
      name: 'Deep Research Agent',
      description: 'Searches public and paid sources for market data',
      enabled: true,
      priority: 4,
      timeout: 3600,
      retryAttempts: 3,
      parameters: [
        { name: 'Data Sources', value: '10', placeholder: 'Number of sources' },
        { name: 'Search Depth', value: 'Deep', placeholder: 'Search level' }
      ]
    },
    {
      id: '4',
      name: 'Data Ingestion Agent',
      description: 'Processes and normalizes uploaded data',
      enabled: true,
      priority: 1,
      timeout: 600,
      retryAttempts: 2,
      parameters: [
        { name: 'Processing Mode', value: 'Fast', placeholder: 'Processing speed' },
        { name: 'Quality Check', value: 'true', placeholder: 'Enable quality checks' }
      ]
    }
  ];
  
  defaultWeights = [
    { name: 'Founder Profile', value: 25 },
    { name: 'Market Analysis', value: 20 },
    { name: 'Competitive Landscape', value: 15 },
    { name: 'Financial Projections', value: 20 },
    { name: 'Risk Assessment', value: 20 }
  ];
  
  preferences = {
    showConfidenceScores: true,
    showRiskFlags: true,
    enableVisualizations: true,
    autoGenerateInsights: true
  };
  
  notifications = {
    analysisComplete: true,
    agentStatus: true,
    weeklySummary: false,
    browserNotifications: true,
    soundAlerts: false
  };
  
  security = {
    sessionTimeout: 60
  };
  
  privacy = {
    analyticsTracking: true,
    errorReporting: true
  };

  ngOnInit(): void {
    // Load settings from storage
    this.loadSettings();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  private loadSettings(): void {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('ai-analyst-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      Object.assign(this.settings, settings.settings || {});
      Object.assign(this.preferences, settings.preferences || {});
      Object.assign(this.notifications, settings.notifications || {});
      Object.assign(this.security, settings.security || {});
      Object.assign(this.privacy, settings.privacy || {});
    }
  }

  saveSettings(): void {
    const allSettings = {
      settings: this.settings,
      preferences: this.preferences,
      notifications: this.notifications,
      security: this.security,
      privacy: this.privacy,
      aiAgents: this.aiAgents,
      defaultWeights: this.defaultWeights
    };
    
    localStorage.setItem('ai-analyst-settings', JSON.stringify(allSettings));
    console.log('Settings saved successfully');
    // Show success notification
  }

  resetSettings(): void {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      // Reset to default values
      this.ngOnInit();
      console.log('Settings reset to defaults');
    }
  }

  exportData(): void {
    console.log('Exporting all data');
    // Implementation would generate and download data export
  }
}
