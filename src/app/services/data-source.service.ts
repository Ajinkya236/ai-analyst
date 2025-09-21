import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { DataSource, DataSourceType, DataSourceStatus } from '../models/data-source.model';

/**
 * Data Source Service
 * 
 * Manages data source operations including upload, processing, and status tracking.
 * Handles file uploads, URL processing, and AI agent data collection.
 */
@Injectable({
  providedIn: 'root'
})
export class DataSourceService {
  private dataSourcesSubject = new BehaviorSubject<DataSource[]>([]);
  public dataSources$ = this.dataSourcesSubject.asObservable();
  
  private baseUrl = '/api/data-sources';

  constructor(private http: HttpClient) {
    this.loadDataSources();
  }

  /**
   * Get all data sources
   */
  getDataSources(): Observable<DataSource[]> {
    return this.dataSources$;
  }

  /**
   * Get data source by ID
   */
  getDataSource(id: string): Observable<DataSource> {
    return this.http.get<DataSource>(`${this.baseUrl}/${id}`);
  }

  /**
   * Upload file data source
   */
  uploadFile(file: File, metadata?: any): Observable<DataSource> {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    return this.http.post<DataSource>(`${this.baseUrl}/upload`, formData);
  }

  /**
   * Add text data source
   */
  addTextSource(title: string, content: string): Observable<DataSource> {
    const dataSource = {
      type: DataSourceType.TEXT_INPUT,
      name: title,
      content: content,
      status: DataSourceStatus.PENDING
    };

    return this.http.post<DataSource>(this.baseUrl, dataSource);
  }

  /**
   * Add URL data source
   */
  addUrlSource(url: string, description?: string): Observable<DataSource> {
    const dataSource = {
      type: DataSourceType.URL_LINK,
      name: description || url,
      url: url,
      status: DataSourceStatus.PENDING
    };

    return this.http.post<DataSource>(this.baseUrl, dataSource);
  }

  /**
   * Trigger founder voice collection
   */
  triggerFounderVoice(contactInfo: any): Observable<DataSource> {
    const dataSource = {
      type: DataSourceType.FOUNDER_VOICE,
      name: 'Founder Voice Interview',
      status: DataSourceStatus.PENDING,
      metadata: contactInfo
    };

    return this.http.post<DataSource>(`${this.baseUrl}/founder-voice`, dataSource);
  }

  /**
   * Trigger behavioral assessment
   */
  triggerBehavioralAssessment(contactInfo: any): Observable<DataSource> {
    const dataSource = {
      type: DataSourceType.BEHAVIORAL_ASSESSMENT,
      name: 'Behavioral Assessment',
      status: DataSourceStatus.PENDING,
      metadata: contactInfo
    };

    return this.http.post<DataSource>(`${this.baseUrl}/behavioral-assessment`, dataSource);
  }

  /**
   * Trigger deep research
   */
  triggerDeepResearch(companyInfo: any): Observable<DataSource> {
    const dataSource = {
      type: DataSourceType.DEEP_RESEARCH,
      name: 'Deep Research Analysis',
      status: DataSourceStatus.PENDING,
      metadata: companyInfo
    };

    return this.http.post<DataSource>(`${this.baseUrl}/deep-research`, dataSource);
  }

  /**
   * Update data source
   */
  updateDataSource(id: string, updates: Partial<DataSource>): Observable<DataSource> {
    return this.http.put<DataSource>(`${this.baseUrl}/${id}`, updates);
  }

  /**
   * Delete data source
   */
  deleteDataSource(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get data source processing status
   */
  getProcessingStatus(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}/status`);
  }

  /**
   * Retry failed data source processing
   */
  retryProcessing(id: string): Observable<DataSource> {
    return this.http.post<DataSource>(`${this.baseUrl}/${id}/retry`, {});
  }

  /**
   * Get data source content
   */
  getDataSourceContent(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}/content`);
  }

  /**
   * Search data sources
   */
  searchDataSources(query: string, filters?: any): Observable<DataSource[]> {
    const params = { q: query, ...filters };
    return this.http.get<DataSource[]>(`${this.baseUrl}/search`, { params });
  }

  /**
   * Get data source statistics
   */
  getDataSourceStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats`);
  }

  /**
   * Export data sources
   */
  exportDataSources(format: 'json' | 'csv' | 'xlsx'): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export`, {
      params: { format },
      responseType: 'blob'
    });
  }

  /**
   * Load data sources from storage
   */
  private loadDataSources(): void {
    // Load from localStorage for demo purposes
    const stored = localStorage.getItem('ai-analyst-data-sources');
    if (stored) {
      try {
        const dataSources = JSON.parse(stored);
        this.dataSourcesSubject.next(dataSources);
      } catch (error) {
        console.error('Error loading data sources:', error);
      }
    }
  }

  /**
   * Save data sources to storage
   */
  private saveDataSources(dataSources: DataSource[]): void {
    localStorage.setItem('ai-analyst-data-sources', JSON.stringify(dataSources));
    this.dataSourcesSubject.next(dataSources);
  }

  /**
   * Add data source to local storage
   */
  private addDataSource(dataSource: DataSource): void {
    const current = this.dataSourcesSubject.value;
    const updated = [...current, dataSource];
    this.saveDataSources(updated);
  }

  /**
   * Update data source in local storage
   */
  private updateDataSourceLocal(id: string, updates: Partial<DataSource>): void {
    const current = this.dataSourcesSubject.value;
    const updated = current.map(ds => 
      ds.id === id ? { ...ds, ...updates } : ds
    );
    this.saveDataSources(updated);
  }

  /**
   * Remove data source from local storage
   */
  private removeDataSource(id: string): void {
    const current = this.dataSourcesSubject.value;
    const updated = current.filter(ds => ds.id !== id);
    this.saveDataSources(updated);
  }
}
