import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { AIAgent, AgentType, AgentStatus, AgentExecution, ExecutionStatus } from '../models/ai-agent.model';

/**
 * AI Agent Service
 * 
 * Manages AI agent operations including triggering, monitoring, and configuration.
 * Handles agent lifecycle, execution tracking, and status updates.
 */
@Injectable({
  providedIn: 'root'
})
export class AIAgentService {
  private agentsSubject = new BehaviorSubject<AIAgent[]>([]);
  public agents$ = this.agentsSubject.asObservable();
  
  private executionsSubject = new BehaviorSubject<AgentExecution[]>([]);
  public executions$ = this.executionsSubject.asObservable();
  
  private baseUrl = '/api/ai-agents';

  constructor(private http: HttpClient) {
    this.loadAgents();
    this.startStatusPolling();
  }

  /**
   * Get all AI agents
   */
  getAgents(): Observable<AIAgent[]> {
    return this.agents$;
  }

  /**
   * Get agent by ID
   */
  getAgent(id: string): Observable<AIAgent> {
    return this.http.get<AIAgent>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create new agent
   */
  createAgent(agent: Partial<AIAgent>): Observable<AIAgent> {
    return this.http.post<AIAgent>(this.baseUrl, agent);
  }

  /**
   * Update agent configuration
   */
  updateAgent(id: string, updates: Partial<AIAgent>): Observable<AIAgent> {
    return this.http.put<AIAgent>(`${this.baseUrl}/${id}`, updates);
  }

  /**
   * Delete agent
   */
  deleteAgent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Trigger agent execution
   */
  triggerAgent(id: string, input?: any): Observable<AgentExecution> {
    return this.http.post<AgentExecution>(`${this.baseUrl}/${id}/trigger`, { input });
  }

  /**
   * Trigger multiple agents
   */
  triggerMultipleAgents(agentIds: string[], input?: any): Observable<AgentExecution[]> {
    return this.http.post<AgentExecution[]>(`${this.baseUrl}/trigger-multiple`, {
      agentIds,
      input
    });
  }

  /**
   * Stop agent execution
   */
  stopAgent(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/stop`, {});
  }

  /**
   * Pause agent execution
   */
  pauseAgent(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/pause`, {});
  }

  /**
   * Resume agent execution
   */
  resumeAgent(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/resume`, {});
  }

  /**
   * Get agent execution history
   */
  getExecutionHistory(agentId?: string): Observable<AgentExecution[]> {
    const params = agentId ? { agentId } : {};
    return this.http.get<AgentExecution[]>(`${this.baseUrl}/executions`, { params });
  }

  /**
   * Get current executions
   */
  getCurrentExecutions(): Observable<AgentExecution[]> {
    return this.executions$;
  }

  /**
   * Get execution by ID
   */
  getExecution(id: string): Observable<AgentExecution> {
    return this.http.get<AgentExecution>(`${this.baseUrl}/executions/${id}`);
  }

  /**
   * Cancel execution
   */
  cancelExecution(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/executions/${id}/cancel`, {});
  }

  /**
   * Get agent metrics
   */
  getAgentMetrics(agentId?: string, timeRange?: string): Observable<any> {
    const params: any = {};
    if (agentId) params.agentId = agentId;
    if (timeRange) params.timeRange = timeRange;
    
    return this.http.get(`${this.baseUrl}/metrics`, { params });
  }

  /**
   * Get agent logs
   */
  getAgentLogs(agentId: string, level?: string): Observable<any[]> {
    const params = level ? { level } : {};
    return this.http.get<any[]>(`${this.baseUrl}/${agentId}/logs`, { params });
  }

  /**
   * Update agent configuration
   */
  updateAgentConfiguration(agentId: string, config: any): Observable<AIAgent> {
    return this.http.put<AIAgent>(`${this.baseUrl}/${agentId}/configuration`, config);
  }

  /**
   * Test agent configuration
   */
  testAgentConfiguration(agentId: string, testInput?: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${agentId}/test`, { input: testInput });
  }

  /**
   * Get agent health status
   */
  getAgentHealth(agentId?: string): Observable<any> {
    const params = agentId ? { agentId } : {};
    return this.http.get(`${this.baseUrl}/health`, { params });
  }

  /**
   * Restart agent
   */
  restartAgent(agentId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${agentId}/restart`, {});
  }

  /**
   * Get agent capabilities
   */
  getAgentCapabilities(agentId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${agentId}/capabilities`);
  }

  /**
   * Validate agent input
   */
  validateAgentInput(agentId: string, input: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${agentId}/validate-input`, { input });
  }

  /**
   * Get agent output schema
   */
  getAgentOutputSchema(agentId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${agentId}/output-schema`);
  }

  /**
   * Load agents from storage
   */
  private loadAgents(): void {
    // Load from localStorage for demo purposes
    const stored = localStorage.getItem('ai-analyst-agents');
    if (stored) {
      try {
        const agents = JSON.parse(stored);
        this.agentsSubject.next(agents);
      } catch (error) {
        console.error('Error loading agents:', error);
        this.initializeDefaultAgents();
      }
    } else {
      this.initializeDefaultAgents();
    }
  }

  /**
   * Initialize default agents
   */
  private initializeDefaultAgents(): void {
    const defaultAgents: AIAgent[] = [
      {
        id: '1',
        name: 'Founder Voice Agent',
        type: AgentType.FOUNDER_VOICE,
        description: 'Conducts structured interviews with founders',
        status: AgentStatus.IDLE,
        configuration: {
          enabled: true,
          priority: 3,
          timeout: 1800,
          retryAttempts: 2,
          parameters: {
            interviewDuration: 30,
            questionCount: 15,
            language: 'en'
          }
        },
        lastExecution: undefined,
        executionHistory: []
      },
      {
        id: '2',
        name: 'Behavioral Assessment Agent',
        type: AgentType.BEHAVIORAL_ASSESSMENT,
        description: 'Sends and processes psychometric surveys',
        status: AgentStatus.IDLE,
        configuration: {
          enabled: true,
          priority: 2,
          timeout: 900,
          retryAttempts: 1,
          parameters: {
            surveyType: 'Big Five',
            responseTimeout: 7,
            language: 'en'
          }
        },
        lastExecution: undefined,
        executionHistory: []
      },
      {
        id: '3',
        name: 'Deep Research Agent',
        type: AgentType.DEEP_RESEARCH,
        description: 'Searches public and paid sources for market data',
        status: AgentStatus.IDLE,
        configuration: {
          enabled: true,
          priority: 4,
          timeout: 3600,
          retryAttempts: 3,
          parameters: {
            dataSources: 10,
            searchDepth: 'Deep',
            includePaidSources: true
          }
        },
        lastExecution: undefined,
        executionHistory: []
      },
      {
        id: '4',
        name: 'Data Ingestion Agent',
        type: AgentType.DATA_INGESTION,
        description: 'Processes and normalizes uploaded data',
        status: AgentStatus.IDLE,
        configuration: {
          enabled: true,
          priority: 1,
          timeout: 600,
          retryAttempts: 2,
          parameters: {
            processingMode: 'Fast',
            qualityCheck: true,
            enableOCR: true
          }
        },
        lastExecution: undefined,
        executionHistory: []
      },
      {
        id: '5',
        name: 'Curated Memo Agent',
        type: AgentType.CURATED_MEMO,
        description: 'Generates final curated investment memos',
        status: AgentStatus.IDLE,
        configuration: {
          enabled: true,
          priority: 5,
          timeout: 7200,
          retryAttempts: 1,
          parameters: {
            memoFormat: 'Professional',
            includeVisualizations: true,
            riskAnalysis: true
          }
        },
        lastExecution: undefined,
        executionHistory: []
      }
    ];

    this.agentsSubject.next(defaultAgents);
    this.saveAgents(defaultAgents);
  }

  /**
   * Save agents to storage
   */
  private saveAgents(agents: AIAgent[]): void {
    localStorage.setItem('ai-analyst-agents', JSON.stringify(agents));
  }

  /**
   * Start polling for agent status updates
   */
  private startStatusPolling(): void {
    // Poll every 5 seconds for status updates
    interval(5000).subscribe(() => {
      this.updateAgentStatuses();
    });
  }

  /**
   * Update agent statuses (simulated)
   */
  private updateAgentStatuses(): void {
    const agents = this.agentsSubject.value;
    const updatedAgents = agents.map(agent => {
      // Simulate random status changes for demo
      if (Math.random() < 0.1) { // 10% chance of status change
        const statuses = [AgentStatus.IDLE, AgentStatus.RUNNING, AgentStatus.COMPLETED, AgentStatus.FAILED];
        const currentIndex = statuses.indexOf(agent.status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        agent.status = statuses[nextIndex];
        
        if (agent.status === AgentStatus.RUNNING) {
          agent.lastExecution = new Date();
        }
      }
      return agent;
    });

    this.agentsSubject.next(updatedAgents);
    this.saveAgents(updatedAgents);
  }

  /**
   * Simulate agent execution
   */
  simulateAgentExecution(agentId: string, input?: any): void {
    const agents = this.agentsSubject.value;
    const agent = agents.find(a => a.id === agentId);
    
    if (agent) {
      agent.status = AgentStatus.RUNNING;
      agent.lastExecution = new Date();
      
      // Simulate execution completion after random time
      const executionTime = Math.random() * 30000 + 10000; // 10-40 seconds
      
      setTimeout(() => {
        agent.status = Math.random() < 0.8 ? AgentStatus.COMPLETED : AgentStatus.FAILED;
        this.agentsSubject.next([...agents]);
        this.saveAgents(agents);
      }, executionTime);
    }
  }
}
