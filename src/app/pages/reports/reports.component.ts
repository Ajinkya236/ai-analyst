import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Report {
  id: string;
  title: string;
  companyName: string;
  companyDescription?: string;
  founderName: string;
  founderEmail: string;
  founderPhone: {
    countryCode: string;
    number: string;
    confidence?: number;
    provenance?: string;
  };
  status: 'draft' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reports-page">
      <!-- Header Section -->
      <div class="reports-header">
        <div class="header-content">
          <div class="header-left">
            <h1 class="page-title">My Reports</h1>
            <p class="page-subtitle">Manage and create startup evaluation reports</p>
          </div>
          <div class="header-right">
            <button class="create-report-btn" (click)="openCreateModal()">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
              Create New Report
            </button>
          </div>
        </div>
      </div>

      <!-- Search and Sort Section -->
      <div class="search-sort-section">
        <div class="search-container">
          <div class="search-bar">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input 
              type="text" 
              placeholder="Search reports by title, company, or founder..."
              [(ngModel)]="searchQuery"
              (input)="onSearchChange()"
              class="search-input"
            >
            <button *ngIf="searchQuery" class="clear-search" (click)="clearSearch()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="sort-container">
          <select [(ngModel)]="sortBy" (change)="onSortChange()" class="sort-dropdown">
            <option value="updatedAt-desc">Last Edited (Newest)</option>
            <option value="updatedAt-asc">Last Edited (Oldest)</option>
            <option value="companyName-asc">Company Name (A-Z)</option>
            <option value="companyName-desc">Company Name (Z-A)</option>
            <option value="createdAt-desc">Created Date (Newest)</option>
            <option value="createdAt-asc">Created Date (Oldest)</option>
          </select>
        </div>
      </div>

      <!-- Reports Grid -->
      <div class="reports-content">
        <div *ngIf="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading reports...</p>
        </div>

        <div *ngIf="!isLoading && filteredReports.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10,9 9,9 8,9"></polyline>
            </svg>
          </div>
          <h3>No reports found</h3>
          <p>Create your first startup evaluation report to get started.</p>
          <button class="create-first-report" (click)="openCreateModal()">
            Create Your First Report
          </button>
        </div>

        <div *ngIf="!isLoading && filteredReports.length > 0" class="reports-grid">
          <div 
            *ngFor="let report of filteredReports" 
            class="report-card"
            (click)="openReport(report.id)"
          >
            <div class="report-header">
              <div class="report-title">{{ report.title }}</div>
              <div class="report-actions">
                <button class="action-btn" (click)="openActionMenu($event, report)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="report-content">
              <div class="company-info">
                <h4 class="company-name">{{ report.companyName }}</h4>
                <p class="company-description" *ngIf="report.companyDescription">
                  {{ report.companyDescription }}
                </p>
              </div>
              
              <div class="founder-info">
                <div class="founder-details">
                  <span class="founder-name">{{ report.founderName }}</span>
                  <span class="founder-email">{{ report.founderEmail }}</span>
                </div>
                <div class="phone-info" *ngIf="report.founderPhone">
                  <span class="phone-number">
                    {{ report.founderPhone.countryCode }} {{ report.founderPhone.number }}
                  </span>
                  <span *ngIf="report.founderPhone.confidence" class="confidence-score">
                    {{ (report.founderPhone.confidence * 100).toFixed(0) }}% confidence
                  </span>
                </div>
              </div>
            </div>
            
            <div class="report-footer">
              <div class="report-status">
                <span class="status-badge" [class]="'status-' + report.status">
                  {{ report.status | titlecase }}
                </span>
              </div>
              <div class="report-meta">
                <span class="last-edited">
                  Updated {{ formatDate(report.updatedAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Menu Dropdown -->
      <div *ngIf="showActionMenu" class="action-menu" [style.left.px]="actionMenuPosition.x" [style.top.px]="actionMenuPosition.y">
        <button class="menu-item" (click)="editReportTitle()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          Edit Title
        </button>
        <button class="menu-item delete" (click)="deleteReport()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="3,6 5,6 21,6"></polyline>
            <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
          </svg>
          Delete Report
        </button>
      </div>

      <!-- Create Report Modal -->
      <div *ngIf="showCreateModal" class="modal-overlay" (click)="closeCreateModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Create New Report</h2>
            <button class="close-btn" (click)="closeCreateModal()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="form-step" [class.active]="currentStep === 1">
              <h3>Company Information</h3>
              <div class="form-group">
                <label>Company Name *</label>
                <input 
                  type="text" 
                  [(ngModel)]="newReport.companyName"
                  placeholder="Enter or search for company name..."
                  class="form-input"
                  (input)="searchCompany()"
                >
                <div *ngIf="companySearchResults.length > 0" class="search-results">
                  <div 
                    *ngFor="let company of companySearchResults" 
                    class="search-result-item"
                    (click)="selectCompany(company)"
                  >
                    <div class="company-name">{{ company.name }}</div>
                    <div class="company-description">{{ company.description }}</div>
                    <div class="confidence-badge">{{ (company.confidence * 100).toFixed(0) }}% match</div>
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label>Company Description</label>
                <textarea 
                  [(ngModel)]="newReport.companyDescription"
                  placeholder="Brief description of the company..."
                  class="form-textarea"
                  rows="3"
                ></textarea>
              </div>
            </div>
            
            <div class="form-step" [class.active]="currentStep === 2">
              <h3>Founder Information</h3>
              <div class="form-group">
                <label>Founder Name *</label>
                <input 
                  type="text" 
                  [(ngModel)]="newReport.founderName"
                  placeholder="Founder's full name"
                  class="form-input"
                >
              </div>
              
              <div class="form-group">
                <label>Founder Email *</label>
                <input 
                  type="email" 
                  [(ngModel)]="newReport.founderEmail"
                  placeholder="founder@company.com"
                  class="form-input"
                >
              </div>
              
              <div class="form-group">
                <label>Founder Phone *</label>
                <div class="phone-input-group">
                  <select [(ngModel)]="newReport.founderPhone.countryCode" class="country-code">
                    <option value="+1">+1 (US)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+91">+91 (IN)</option>
                    <option value="+86">+86 (CN)</option>
                    <option value="+81">+81 (JP)</option>
                  </select>
                  <input 
                    type="tel" 
                    [(ngModel)]="newReport.founderPhone.number"
                    placeholder="Phone number"
                    class="phone-number"
                  >
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button 
              class="btn-secondary" 
              (click)="previousStep()" 
              [disabled]="currentStep === 1"
            >
              Previous
            </button>
            <button 
              class="btn-primary" 
              (click)="nextStep()" 
              [disabled]="!canProceed()"
            >
              {{ currentStep === 2 ? 'Create Report' : 'Next' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="showDeleteModal" class="modal-overlay" (click)="closeDeleteModal()">
        <div class="modal-content delete-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Delete Report</h2>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this report? This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeDeleteModal()">Cancel</button>
            <button class="btn-danger" (click)="confirmDelete()">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f1419 0%, #1e2a3a 20%, #2d4059 40%, #3d5a80 60%, #5a4fcf 80%, #7b68ee 100%);
      padding: 24px;
    }

    .reports-header {
      margin-bottom: 32px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-title {
      font-size: 48px;
      font-weight: 700;
      color: white;
      margin-bottom: 8px;
    }

    .page-subtitle {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.7);
    }

    .create-report-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      color: white;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .create-report-btn:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
    }

    .btn-icon {
      width: 20px;
      height: 20px;
    }

    .search-sort-section {
      display: flex;
      gap: 24px;
      margin-bottom: 32px;
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
    }

    .search-container {
      flex: 1;
    }

    .search-bar {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 16px;
      width: 20px;
      height: 20px;
      color: rgba(255, 255, 255, 0.6);
    }

    .search-input {
      width: 100%;
      padding: 16px 16px 16px 48px;
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      color: white;
      font-size: 16px;
    }

    .search-input::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    .clear-search {
      position: absolute;
      right: 16px;
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      padding: 4px;
    }

    .sort-container {
      min-width: 200px;
    }

    .sort-dropdown {
      width: 100%;
      padding: 16px;
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      color: white;
      font-size: 16px;
    }

    .sort-dropdown option {
      background: #1e2a3a;
      color: white;
    }

    .reports-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .loading-state, .empty-state {
      text-align: center;
      padding: 80px 24px;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top: 3px solid #4facfe;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .empty-state h3 {
      font-size: 24px;
      color: white;
      margin-bottom: 8px;
    }

    .empty-state p {
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 24px;
    }

    .create-first-report {
      padding: 12px 24px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      color: white;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .report-card {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      padding: 24px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }

    .report-card:hover {
      background: rgba(255, 255, 255, 0.12);
      transform: translateY(-4px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }

    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .report-title {
      font-size: 20px;
      font-weight: 700;
      color: white;
      flex: 1;
    }

    .action-btn {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .action-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .company-name {
      font-size: 18px;
      font-weight: 600;
      color: white;
      margin-bottom: 8px;
    }

    .company-description {
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 16px;
    }

    .founder-info {
      margin-bottom: 16px;
    }

    .founder-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 8px;
    }

    .founder-name {
      font-size: 16px;
      font-weight: 600;
      color: white;
    }

    .founder-email {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
    }

    .phone-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .phone-number {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
    }

    .confidence-score {
      font-size: 12px;
      color: #4facfe;
      font-weight: 500;
    }

    .report-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-draft {
      background: rgba(255, 193, 7, 0.2);
      color: #ffc107;
    }

    .status-in-progress {
      background: rgba(0, 123, 255, 0.2);
      color: #007bff;
    }

    .status-completed {
      background: rgba(40, 167, 69, 0.2);
      color: #28a745;
    }

    .last-edited {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
    }

    .action-menu {
      position: fixed;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 8px 0;
      z-index: 1000;
      min-width: 160px;
    }

    .menu-item {
      width: 100%;
      padding: 12px 16px;
      background: none;
      border: none;
      color: white;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: background 0.3s ease;
    }

    .menu-item:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .menu-item.delete {
      color: #ff6b6b;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    }

    .modal-content {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      padding: 32px;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .modal-header h2 {
      font-size: 24px;
      font-weight: 700;
      color: white;
    }

    .close-btn {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .form-step {
      display: none;
    }

    .form-step.active {
      display: block;
    }

    .form-step h3 {
      font-size: 20px;
      font-weight: 600;
      color: white;
      margin-bottom: 24px;
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-group label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: white;
      margin-bottom: 8px;
    }

    .form-input, .form-textarea {
      width: 100%;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      color: white;
      font-size: 16px;
    }

    .form-input::placeholder, .form-textarea::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    .phone-input-group {
      display: flex;
      gap: 12px;
    }

    .country-code {
      min-width: 120px;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      color: white;
      font-size: 16px;
    }

    .phone-number {
      flex: 1;
    }

    .search-results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      margin-top: 8px;
      max-height: 200px;
      overflow-y: auto;
      z-index: 100;
    }

    .search-result-item {
      padding: 12px 16px;
      cursor: pointer;
      transition: background 0.3s ease;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .search-result-item:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .search-result-item:last-child {
      border-bottom: none;
    }

    .company-name {
      font-size: 16px;
      font-weight: 600;
      color: white;
      margin-bottom: 4px;
    }

    .company-description {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 8px;
    }

    .confidence-badge {
      font-size: 12px;
      color: #4facfe;
      font-weight: 500;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 32px;
    }

    .btn-primary, .btn-secondary, .btn-danger {
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
    }

    .btn-primary {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.25);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.08);
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.15);
    }

    .btn-danger {
      background: rgba(255, 107, 107, 0.2);
      color: #ff6b6b;
      border: 1px solid rgba(255, 107, 107, 0.3);
    }

    .btn-danger:hover {
      background: rgba(255, 107, 107, 0.3);
    }

    .delete-modal {
      max-width: 400px;
    }

    @media (max-width: 768px) {
      .reports-page {
        padding: 16px;
      }

      .header-content {
        flex-direction: column;
        gap: 16px;
      }

      .page-title {
        font-size: 36px;
      }

      .search-sort-section {
        flex-direction: column;
        gap: 16px;
      }

      .reports-grid {
        grid-template-columns: 1fr;
      }

      .modal-content {
        margin: 16px;
        padding: 24px;
      }
    }
  `]
})
export class ReportsComponent implements OnInit {
  reports: Report[] = [];
  filteredReports: Report[] = [];
  searchQuery = '';
  sortBy = 'updatedAt-desc';
  isLoading = false;
  showActionMenu = false;
  showCreateModal = false;
  showDeleteModal = false;
  currentStep = 1;
  selectedReport: Report | null = null;
  actionMenuPosition = { x: 0, y: 0 };

  newReport = {
    companyName: '',
    companyDescription: '',
    founderName: '',
    founderEmail: '',
    founderPhone: {
      countryCode: '+1',
      number: ''
    }
  };

  companySearchResults: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.reports = [
        {
          id: '1',
          title: 'TechCorp Analysis',
          companyName: 'TechCorp Inc.',
          companyDescription: 'AI-powered healthcare platform',
          founderName: 'John Smith',
          founderEmail: 'john@techcorp.com',
          founderPhone: {
            countryCode: '+1',
            number: '555-0123',
            confidence: 0.92,
            provenance: 'CRM'
          },
          status: 'completed',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20'),
          createdBy: 'user1'
        },
        {
          id: '2',
          title: 'StartupXYZ Evaluation',
          companyName: 'StartupXYZ',
          companyDescription: 'E-commerce automation tools',
          founderName: 'Jane Doe',
          founderEmail: 'jane@startupxyz.com',
          founderPhone: {
            countryCode: '+1',
            number: '555-0456',
            confidence: 0.85,
            provenance: 'Manual'
          },
          status: 'in-progress',
          createdAt: new Date('2024-01-18'),
          updatedAt: new Date('2024-01-19'),
          createdBy: 'user1'
        }
      ];
      this.filteredReports = [...this.reports];
      this.isLoading = false;
    }, 1000);
  }

  onSearchChange(): void {
    if (!this.searchQuery.trim()) {
      this.filteredReports = [...this.reports];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredReports = this.reports.filter(report =>
      report.title.toLowerCase().includes(query) ||
      report.companyName.toLowerCase().includes(query) ||
      report.founderName.toLowerCase().includes(query)
    );
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredReports = [...this.reports];
  }

  onSortChange(): void {
    const [field, direction] = this.sortBy.split('-');
    this.filteredReports.sort((a, b) => {
      let aValue: any = a[field as keyof Report];
      let bValue: any = b[field as keyof Report];

      if (field === 'updatedAt' || field === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else {
        aValue = aValue?.toString().toLowerCase() || '';
        bValue = bValue?.toString().toLowerCase() || '';
      }

      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  openReport(reportId: string): void {
    this.router.navigate(['/report', reportId]);
  }

  openActionMenu(event: Event, report: Report): void {
    event.stopPropagation();
    this.selectedReport = report;
    this.actionMenuPosition = {
      x: (event.target as HTMLElement).getBoundingClientRect().left,
      y: (event.target as HTMLElement).getBoundingClientRect().bottom + 8
    };
    this.showActionMenu = true;
  }

  editReportTitle(): void {
    // Implement edit title functionality
    this.showActionMenu = false;
  }

  deleteReport(): void {
    this.showActionMenu = false;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.selectedReport) {
      this.reports = this.reports.filter(r => r.id !== this.selectedReport!.id);
      this.filteredReports = this.filteredReports.filter(r => r.id !== this.selectedReport!.id);
      this.selectedReport = null;
    }
    this.showDeleteModal = false;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedReport = null;
  }

  openCreateModal(): void {
    this.showCreateModal = true;
    this.currentStep = 1;
    this.newReport = {
      companyName: '',
      companyDescription: '',
      founderName: '',
      founderEmail: '',
      founderPhone: {
        countryCode: '+1',
        number: ''
      }
    };
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.currentStep = 1;
    this.companySearchResults = [];
  }

  searchCompany(): void {
    if (this.newReport.companyName.length < 2) {
      this.companySearchResults = [];
      return;
    }

    // Simulate CRM search
    this.companySearchResults = [
      {
        name: 'TechCorp Inc.',
        description: 'AI-powered healthcare platform',
        founderEmail: 'john@techcorp.com',
        founderPhone: '+1-555-0123',
        confidence: 0.92,
        provenance: 'CRM'
      },
      {
        name: 'TechCorp Solutions',
        description: 'Enterprise software solutions',
        founderEmail: 'contact@techcorpsolutions.com',
        founderPhone: '+1-555-0456',
        confidence: 0.78,
        provenance: 'CRM'
      }
    ];
  }

  selectCompany(company: any): void {
    this.newReport.companyName = company.name;
    this.newReport.companyDescription = company.description;
    this.newReport.founderEmail = company.founderEmail;
    this.newReport.founderPhone.number = company.founderPhone.replace('+1-', '');
    this.companySearchResults = [];
  }

  nextStep(): void {
    if (this.currentStep < 2) {
      this.currentStep++;
    } else {
      this.createReport();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  canProceed(): boolean {
    if (this.currentStep === 1) {
      return !!this.newReport.companyName.trim();
    } else if (this.currentStep === 2) {
      return !!(
        this.newReport.founderName.trim() &&
        this.newReport.founderEmail.trim() &&
        this.newReport.founderPhone.number.trim()
      );
    }
    return false;
  }

  createReport(): void {
    const newReport: Report = {
      id: Date.now().toString(),
      title: this.newReport.companyName,
      companyName: this.newReport.companyName,
      companyDescription: this.newReport.companyDescription,
      founderName: this.newReport.founderName,
      founderEmail: this.newReport.founderEmail,
      founderPhone: {
        countryCode: this.newReport.founderPhone.countryCode,
        number: this.newReport.founderPhone.number,
        confidence: 1.0,
        provenance: 'Manual'
      },
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current-user'
    };

    this.reports.unshift(newReport);
    this.filteredReports = [...this.reports];
    this.closeCreateModal();
    this.router.navigate(['/report', newReport.id]);
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}