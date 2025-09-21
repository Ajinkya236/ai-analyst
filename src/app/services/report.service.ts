import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Report {
  id: string;
  companyName: string;
  founderProfile: {
    name: string;
    email: string;
    phone: string;
    linkedin?: string;
  };
  sector: string;
  geography: string;
  stage: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'in_progress' | 'completed';
  currentStage: number;
  aiAgentConfig: any;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private reportsSubject = new BehaviorSubject<Report[]>([]);
  public reports$ = this.reportsSubject.asObservable();
  
  private currentReportSubject = new BehaviorSubject<Report | null>(null);
  public currentReport$ = this.currentReportSubject.asObservable();

  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {
    this.loadReports();
  }

  private loadReports(): void {
    // Load reports from localStorage for now
    const savedReports = localStorage.getItem('ai_analyst_reports');
    if (savedReports) {
      try {
        const reports = JSON.parse(savedReports).map((report: any) => ({
          ...report,
          createdAt: new Date(report.createdAt),
          updatedAt: new Date(report.updatedAt)
        }));
        this.reportsSubject.next(reports);
      } catch (error) {
        console.error('Error loading reports:', error);
      }
    }
  }

  private saveReports(reports: Report[]): void {
    localStorage.setItem('ai_analyst_reports', JSON.stringify(reports));
    this.reportsSubject.next(reports);
  }

  createReport(reportData: Partial<Report>): Report {
    const newReport: Report = {
      id: this.generateId(),
      companyName: reportData.companyName || '',
      founderProfile: reportData.founderProfile || {
        name: '',
        email: '',
        phone: ''
      },
      sector: reportData.sector || '',
      geography: reportData.geography || '',
      stage: reportData.stage || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft',
      currentStage: 0,
      aiAgentConfig: reportData.aiAgentConfig || this.getDefaultAIAgentConfig()
    };

    const currentReports = this.reportsSubject.value;
    const updatedReports = [...currentReports, newReport];
    this.saveReports(updatedReports);

    return newReport;
  }

  updateReport(reportId: string, updates: Partial<Report>): void {
    const currentReports = this.reportsSubject.value;
    const reportIndex = currentReports.findIndex(r => r.id === reportId);
    
    if (reportIndex !== -1) {
      const updatedReport = {
        ...currentReports[reportIndex],
        ...updates,
        updatedAt: new Date()
      };
      
      currentReports[reportIndex] = updatedReport;
      this.saveReports(currentReports);
      
      // Update current report if it's the one being updated
      if (this.currentReportSubject.value?.id === reportId) {
        this.currentReportSubject.next(updatedReport);
      }
    }
  }

  getReport(reportId: string): Report | undefined {
    return this.reportsSubject.value.find(r => r.id === reportId);
  }

  setCurrentReport(report: Report | null): void {
    this.currentReportSubject.next(report);
  }

  getCurrentReport(): Report | null {
    return this.currentReportSubject.value;
  }

  deleteReport(reportId: string): void {
    const currentReports = this.reportsSubject.value;
    const updatedReports = currentReports.filter(r => r.id !== reportId);
    this.saveReports(updatedReports);
    
    // Clear current report if it's the one being deleted
    if (this.currentReportSubject.value?.id === reportId) {
      this.currentReportSubject.next(null);
    }
  }

  updateAIAgentConfig(reportId: string, config: any): void {
    this.updateReport(reportId, { aiAgentConfig: config });
  }

  updateStage(reportId: string, stage: number): void {
    this.updateReport(reportId, { currentStage: stage });
  }

  private generateId(): string {
    return 'report_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private getDefaultAIAgentConfig(): any {
    return {
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
}
