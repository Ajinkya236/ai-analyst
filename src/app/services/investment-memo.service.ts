import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { InvestmentMemo, MemoStage, MemoStatus, MemoPreferences } from '../models/investment-memo.model';

/**
 * Investment Memo Service
 * 
 * Manages investment memo operations including generation, editing, and analysis.
 * Handles memo lifecycle, versioning, and preference management.
 */
@Injectable({
  providedIn: 'root'
})
export class InvestmentMemoService {
  private memosSubject = new BehaviorSubject<InvestmentMemo[]>([]);
  public memos$ = this.memosSubject.asObservable();
  
  private baseUrl = '/api/investment-memos';

  constructor(private http: HttpClient) {
    this.loadMemos();
  }

  /**
   * Get all investment memos
   */
  getMemos(): Observable<InvestmentMemo[]> {
    return this.memos$;
  }

  /**
   * Get memo by ID
   */
  getMemo(id: string): Observable<InvestmentMemo> {
    return this.http.get<InvestmentMemo>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create new memo
   */
  createMemo(memo: Partial<InvestmentMemo>): Observable<InvestmentMemo> {
    return this.http.post<InvestmentMemo>(this.baseUrl, memo);
  }

  /**
   * Update memo
   */
  updateMemo(id: string, updates: Partial<InvestmentMemo>): Observable<InvestmentMemo> {
    return this.http.put<InvestmentMemo>(`${this.baseUrl}/${id}`, updates);
  }

  /**
   * Delete memo
   */
  deleteMemo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Generate Stage 1 memo from data sources
   */
  generateStage1Memo(dataSourceIds: string[]): Observable<InvestmentMemo> {
    return this.http.post<InvestmentMemo>(`${this.baseUrl}/generate/stage-1`, {
      dataSourceIds
    });
  }

  /**
   * Generate Stage 2 memo from Stage 1 memo
   */
  generateStage2Memo(stage1MemoId: string, preferences?: MemoPreferences): Observable<InvestmentMemo> {
    return this.http.post<InvestmentMemo>(`${this.baseUrl}/generate/stage-2`, {
      stage1MemoId,
      preferences
    });
  }

  /**
   * Regenerate memo with updated preferences
   */
  regenerateMemo(id: string, preferences?: MemoPreferences): Observable<InvestmentMemo> {
    return this.http.post<InvestmentMemo>(`${this.baseUrl}/${id}/regenerate`, {
      preferences
    });
  }

  /**
   * Update memo preferences
   */
  updateMemoPreferences(id: string, preferences: MemoPreferences): Observable<InvestmentMemo> {
    return this.http.put<InvestmentMemo>(`${this.baseUrl}/${id}/preferences`, preferences);
  }

  /**
   * Get memo generation status
   */
  getGenerationStatus(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}/generation-status`);
  }

  /**
   * Download memo as PDF
   */
  downloadMemoPDF(id: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/download/pdf`, {
      responseType: 'blob'
    });
  }

  /**
   * Download memo as Word document
   */
  downloadMemoWord(id: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/download/word`, {
      responseType: 'blob'
    });
  }

  /**
   * Export memo data
   */
  exportMemoData(id: string, format: 'json' | 'csv' | 'xlsx'): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/export`, {
      params: { format },
      responseType: 'blob'
    });
  }

  /**
   * Share memo
   */
  shareMemo(id: string, shareOptions: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/share`, shareOptions);
  }

  /**
   * Get memo sharing links
   */
  getMemoSharingLinks(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}/sharing-links`);
  }

  /**
   * Revoke memo sharing
   */
  revokeMemoSharing(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/sharing-links`);
  }

  /**
   * Get memo analytics
   */
  getMemoAnalytics(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}/analytics`);
  }

  /**
   * Get memo comments
   */
  getMemoComments(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${id}/comments`);
  }

  /**
   * Add memo comment
   */
  addMemoComment(id: string, comment: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/comments`, comment);
  }

  /**
   * Update memo comment
   */
  updateMemoComment(id: string, commentId: string, comment: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/comments/${commentId}`, comment);
  }

  /**
   * Delete memo comment
   */
  deleteMemoComment(id: string, commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/comments/${commentId}`);
  }

  /**
   * Get memo version history
   */
  getMemoVersionHistory(id: string): Observable<InvestmentMemo[]> {
    return this.http.get<InvestmentMemo[]>(`${this.baseUrl}/${id}/versions`);
  }

  /**
   * Restore memo version
   */
  restoreMemoVersion(id: string, version: number): Observable<InvestmentMemo> {
    return this.http.post<InvestmentMemo>(`${this.baseUrl}/${id}/restore`, { version });
  }

  /**
   * Compare memo versions
   */
  compareMemoVersions(id: string, version1: number, version2: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}/compare`, {
      params: { version1: version1.toString(), version2: version2.toString() }
    });
  }

  /**
   * Get memo templates
   */
  getMemoTemplates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/templates`);
  }

  /**
   * Create memo from template
   */
  createMemoFromTemplate(templateId: string, data: any): Observable<InvestmentMemo> {
    return this.http.post<InvestmentMemo>(`${this.baseUrl}/templates/${templateId}/create`, data);
  }

  /**
   * Search memos
   */
  searchMemos(query: string, filters?: any): Observable<InvestmentMemo[]> {
    const params = { q: query, ...filters };
    return this.http.get<InvestmentMemo[]>(`${this.baseUrl}/search`, { params });
  }

  /**
   * Get memo statistics
   */
  getMemoStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats`);
  }

  /**
   * Get memo recommendations
   */
  getMemoRecommendations(memoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${memoId}/recommendations`);
  }

  /**
   * Apply memo recommendations
   */
  applyMemoRecommendations(memoId: string, recommendationIds: string[]): Observable<InvestmentMemo> {
    return this.http.post<InvestmentMemo>(`${this.baseUrl}/${memoId}/apply-recommendations`, {
      recommendationIds
    });
  }

  /**
   * Validate memo content
   */
  validateMemoContent(memoId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${memoId}/validate`, {});
  }

  /**
   * Get memo quality score
   */
  getMemoQualityScore(memoId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${memoId}/quality-score`);
  }

  /**
   * Load memos from storage
   */
  private loadMemos(): void {
    // Load from localStorage for demo purposes
    const stored = localStorage.getItem('ai-analyst-memos');
    if (stored) {
      try {
        const memos = JSON.parse(stored);
        this.memosSubject.next(memos);
      } catch (error) {
        console.error('Error loading memos:', error);
      }
    }
  }

  /**
   * Save memos to storage
   */
  private saveMemos(memos: InvestmentMemo[]): void {
    localStorage.setItem('ai-analyst-memos', JSON.stringify(memos));
    this.memosSubject.next(memos);
  }

  /**
   * Add memo to local storage
   */
  private addMemo(memo: InvestmentMemo): void {
    const current = this.memosSubject.value;
    const updated = [...current, memo];
    this.saveMemos(updated);
  }

  /**
   * Update memo in local storage
   */
  private updateMemoLocal(id: string, updates: Partial<InvestmentMemo>): void {
    const current = this.memosSubject.value;
    const updated = current.map(memo => 
      memo.id === id ? { ...memo, ...updates } : memo
    );
    this.saveMemos(updated);
  }

  /**
   * Remove memo from local storage
   */
  private removeMemo(id: string): void {
    const current = this.memosSubject.value;
    const updated = current.filter(memo => memo.id !== id);
    this.saveMemos(updated);
  }
}
