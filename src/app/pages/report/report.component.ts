import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Stage0Component } from '../stage-0/stage-0.component';
import { Stage1Component } from '../stage-1/stage-1.component';
import { Stage2Component } from '../stage-2/stage-2.component';

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
  currentStage: number;
}

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule, Stage0Component, Stage1Component, Stage2Component],
  template: `
    <div class="report-page">
      <!-- Header with Back Button and Report Title -->
      <div class="report-header">
        <div class="header-content">
          <button class="back-btn" (click)="goBack()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
            Back to Reports
          </button>
          <div class="report-title-section">
            <h1 class="report-title">{{ report?.title || 'Loading...' }}</h1>
            <p class="company-name">{{ report?.companyName || 'Loading...' }}</p>
          </div>
        </div>
      </div>

      <!-- Stage Navigation Bar -->
      <div class="stage-navigation">
        <div class="stage-container">
          <button 
            class="stage-btn" 
            [class.active]="currentStage === 0"
            [class.completed]="currentStage > 0"
            (click)="navigateToStage(0)"
          >
            <div class="stage-number">0</div>
            <div class="stage-label">Data Collection</div>
          </button>
          <button 
            class="stage-btn" 
            [class.active]="currentStage === 1"
            [class.completed]="currentStage > 1"
            (click)="navigateToStage(1)"
          >
            <div class="stage-number">1</div>
            <div class="stage-label">AI-Generated Memo</div>
          </button>
          <button 
            class="stage-btn" 
            [class.active]="currentStage === 2"
            [class.completed]="currentStage > 2"
            (click)="navigateToStage(2)"
          >
            <div class="stage-number">2</div>
            <div class="stage-label">Curated Memo</div>
          </button>
        </div>
      </div>

      <!-- Stage Content -->
      <div class="stage-content">
        <ng-container [ngSwitch]="currentStage">
          <!-- Stage 0: Data Collection -->
          <app-stage-0 
            *ngSwitchCase="0" 
            [reportId]="reportId"
            (stageComplete)="onStageComplete(0)"
          ></app-stage-0>
          
          <!-- Stage 1: AI-Generated Memo -->
          <app-stage-1 
            *ngSwitchCase="1" 
            [reportId]="reportId"
            (stageComplete)="onStageComplete(1)"
          ></app-stage-1>
          
          <!-- Stage 2: Curated Memo -->
          <app-stage-2 
            *ngSwitchCase="2" 
            [reportId]="reportId"
            (stageComplete)="onStageComplete(2)"
          ></app-stage-2>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .report-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f1419 0%, #1e2a3a 20%, #2d4059 40%, #3d5a80 60%, #5a4fcf 80%, #7b68ee 100%);
      position: relative;
    }

    .report-page::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
                  radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%);
      pointer-events: none;
    }

    .report-header {
      padding: 20px 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
      z-index: 2;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .back-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: white;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .back-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    }

    .back-btn svg {
      width: 16px;
      height: 16px;
    }

    .report-title-section {
      flex: 1;
    }

    .report-title {
      font-size: 28px;
      font-weight: 700;
      color: white;
      margin: 0 0 4px 0;
    }

    .company-name {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
    }

    .stage-navigation {
      padding: 20px 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
      z-index: 2;
    }

    .stage-container {
      display: flex;
      gap: 12px;
      max-width: 800px;
      margin: 0 auto;
    }

    .stage-btn {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 16px 20px;
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }

    .stage-btn:hover {
      background: rgba(255, 255, 255, 0.12);
      color: rgba(255, 255, 255, 0.8);
    }

    .stage-btn.active {
      background: rgba(79, 172, 254, 0.2);
      border-color: rgba(79, 172, 254, 0.4);
      color: white;
    }

    .stage-btn.completed {
      background: rgba(40, 202, 66, 0.2);
      border-color: rgba(40, 202, 66, 0.4);
      color: rgba(40, 202, 66, 1);
    }

    .stage-btn.completed::after {
      content: '✓';
      position: absolute;
      top: 8px;
      right: 8px;
      width: 20px;
      height: 20px;
      background: rgba(40, 202, 66, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    }

    .stage-number {
      font-size: 24px;
      font-weight: 700;
      line-height: 1;
    }

    .stage-label {
      font-size: 14px;
      font-weight: 500;
      text-align: center;
    }

    .stage-content {
      position: relative;
      z-index: 2;
      min-height: calc(100vh - 200px);
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .stage-container {
        flex-direction: column;
        gap: 8px;
      }

      .stage-btn {
        flex-direction: row;
        justify-content: flex-start;
        text-align: left;
      }

      .stage-number {
        font-size: 20px;
        margin-right: 12px;
      }

      .stage-label {
        font-size: 16px;
      }
    }
  `]
})
export class ReportComponent implements OnInit {
  reportId: string = '';
  report: Report | null = null;
  currentStage: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.reportId = params['id'];
      this.loadReport();
    });
  }

  loadReport(): void {
    // Mock data - in real implementation, fetch from API
    this.report = {
      id: this.reportId,
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
      status: 'in-progress',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      createdBy: 'user1',
      currentStage: 0
    };
    
    this.currentStage = this.report.currentStage;
  }

  goBack(): void {
    this.router.navigate(['/reports']);
  }

  navigateToStage(stage: number): void {
    this.currentStage = stage;
    // Update report stage in backend
    this.updateReportStage(stage);
  }

  onStageComplete(stage: number): void {
    if (stage < 2) {
      this.currentStage = stage + 1;
      this.updateReportStage(this.currentStage);
    }
  }

  updateReportStage(stage: number): void {
    if (this.report) {
      this.report.currentStage = stage;
      this.report.updatedAt = new Date();
      // In real implementation, update via API
      console.log(`Updated report ${this.reportId} to stage ${stage}`);
    }
  }
}
