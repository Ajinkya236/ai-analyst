import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Not Found Component
 * 
 * 404 error page with helpful navigation options.
 * Implements user-friendly error handling and recovery.
 */
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found">
      <div class="error-content">
        <div class="error-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        
        <h1 class="error-title">404 - Page Not Found</h1>
        <p class="error-description">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        
        <div class="error-actions">
          <button class="btn btn-primary" routerLink="/dashboard">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9,22 9,12 15,12 15,22"></polyline>
            </svg>
            Go to Dashboard
          </button>
          <button class="btn btn-outline" (click)="goBack()">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
            Go Back
          </button>
        </div>
        
        <div class="helpful-links">
          <h3 class="links-title">Helpful Links</h3>
          <div class="links-grid">
            <a routerLink="/stage-0" class="help-link">
              <svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7,10 12,15 17,10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <div class="link-content">
                <span class="link-title">Data Collection</span>
                <span class="link-description">Start a new analysis</span>
              </div>
            </a>
            
            <a routerLink="/reports" class="help-link">
              <svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
              </svg>
              <div class="link-content">
                <span class="link-title">My Reports</span>
                <span class="link-description">View your analyses</span>
              </div>
            </a>
            
            <a routerLink="/settings" class="help-link">
              <svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
              </svg>
              <div class="link-content">
                <span class="link-title">Settings</span>
                <span class="link-description">Configure preferences</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-6);
      background: linear-gradient(135deg, var(--off-white) 0%, var(--light-gray) 100%);
    }
    
    .error-content {
      text-align: center;
      max-width: 600px;
      width: 100%;
    }
    
    .error-icon {
      width: 120px;
      height: 120px;
      margin: 0 auto var(--space-8);
      color: var(--text-light);
    }
    
    .error-icon svg {
      width: 100%;
      height: 100%;
    }
    
    .error-title {
      font-size: var(--font-size-4xl);
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: var(--space-4);
    }
    
    .error-description {
      font-size: var(--font-size-lg);
      color: var(--text-medium);
      margin-bottom: var(--space-8);
      line-height: 1.6;
    }
    
    .error-actions {
      display: flex;
      gap: var(--space-4);
      justify-content: center;
      margin-bottom: var(--space-12);
    }
    
    .btn-icon {
      width: 20px;
      height: 20px;
    }
    
    .helpful-links {
      background-color: var(--white);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--medium-gray);
      padding: var(--space-8);
    }
    
    .links-title {
      font-size: var(--font-size-xl);
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: var(--space-6);
    }
    
    .links-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-4);
    }
    
    .help-link {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4);
      background-color: var(--off-white);
      border: 1px solid var(--medium-gray);
      border-radius: var(--radius-lg);
      text-decoration: none;
      color: inherit;
      transition: all var(--transition-fast);
    }
    
    .help-link:hover {
      background-color: var(--light-gray);
      border-color: var(--primary-blue);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    
    .link-icon {
      width: 32px;
      height: 32px;
      color: var(--primary-blue);
      flex-shrink: 0;
    }
    
    .link-content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-1);
    }
    
    .link-title {
      font-weight: 600;
      color: var(--text-dark);
    }
    
    .link-description {
      font-size: var(--font-size-sm);
      color: var(--text-medium);
    }
    
    @media (max-width: 768px) {
      .not-found {
        padding: var(--space-4);
      }
      
      .error-actions {
        flex-direction: column;
        align-items: center;
      }
      
      .links-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class NotFoundComponent {
  goBack(): void {
    window.history.back();
  }
}
