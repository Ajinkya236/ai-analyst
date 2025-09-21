import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/**
 * Header Component
 * 
 * Main application header with navigation, user menu, and status indicators.
 * Implements responsive design with mobile-friendly navigation.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <div class="logo">
            <a routerLink="/reports" class="logo-link">
              <svg class="logo-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span class="logo-text">AI Analyst</span>
            </a>
          </div>
        </div>
        
        <div class="header-center">
          <div class="search-container">
            <input 
              type="text" 
              class="search-input" 
              placeholder="Search companies, memos, or data sources..."
              [(ngModel)]="searchQuery"
              (keyup.enter)="onSearch()"
            >
            <button class="search-btn" (click)="onSearch()" aria-label="Search">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="header-right">
          <div class="status-indicators">
            <div class="status-item" *ngIf="aiAgentsRunning > 0">
              <div class="status-dot running"></div>
              <span class="status-text">{{ aiAgentsRunning }} AI Agent{{ aiAgentsRunning > 1 ? 's' : '' }} Running</span>
            </div>
            <div class="status-item" *ngIf="pendingTasks > 0">
              <div class="status-dot pending"></div>
              <span class="status-text">{{ pendingTasks }} Pending Task{{ pendingTasks > 1 ? 's' : '' }}</span>
            </div>
          </div>
          
          <button class="settings-btn" (click)="openSettings()" aria-label="Settings">
            <svg class="settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
            </svg>
          </button>
          
          <div class="user-menu">
            <button class="user-btn" (click)="toggleUserMenu()" aria-label="User menu">
              <div class="user-avatar">
                <span class="user-initials">{{ userInitials }}</span>
              </div>
              <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
            
            <div class="user-dropdown" [class.show]="showUserMenu">
              <div class="user-info">
                <div class="user-name">{{ userName }}</div>
                <div class="user-role">{{ userRole }}</div>
              </div>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item">
                <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Profile
              </a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item logout">
                <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16,17 21,12 16,7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Sign Out
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: linear-gradient(135deg, #0f1419 0%, #1e2a3a 20%, #2d4059 40%, #3d5a80 60%, #5a4fcf 80%, #7b68ee 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      gap: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .logo {
      display: flex;
      align-items: center;
    }
    
    .logo-link {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: white;
    }
    
    .logo-icon {
      width: 32px;
      height: 32px;
      color: #4facfe;
    }
    
    .logo-text {
      font-size: 24px;
      font-weight: 700;
      color: white;
    }
    
    .header-center {
      flex: 1;
      max-width: 600px;
      margin: 0 32px;
    }
    
    .search-container {
      position: relative;
      width: 100%;
    }
    
    .search-input {
      width: 100%;
      padding: 12px 16px 12px 48px;
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      color: white;
      font-size: 16px;
      transition: all 0.3s ease;
    }
    
    .search-input::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    
    .search-input:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
    }
    
    .search-btn {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: rgba(255, 255, 255, 0.6);
    }
    
    .search-icon {
      width: 20px;
      height: 20px;
    }
    
    .header-right {
      display: flex;
      align-items: center;
      gap: 24px;
    }
    
    .status-indicators {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .status-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
    }
    
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    
    .status-dot.running {
      background-color: #4facfe;
      animation: pulse 2s infinite;
    }
    
    .status-dot.pending {
      background-color: #ffc107;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    .settings-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      color: white;
    }
    
    .settings-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
    
    .settings-icon {
      width: 20px;
      height: 20px;
    }
    
    .user-menu {
      position: relative;
    }
    
    .user-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 8px 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      color: white;
    }
    
    .user-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
    
    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #4facfe;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 14px;
    }
    
    .chevron-icon {
      width: 16px;
      height: 16px;
      color: rgba(255, 255, 255, 0.8);
      transition: transform 0.3s ease;
    }
    
    .user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 8px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      min-width: 200px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s ease;
    }
    
    .user-dropdown.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    .user-info {
      padding: 16px;
    }
    
    .user-name {
      font-weight: 600;
      color: white;
      margin-bottom: 4px;
    }
    
    .user-role {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
    }
    
    .dropdown-divider {
      height: 1px;
      background-color: rgba(255, 255, 255, 0.2);
      margin: 8px 0;
    }
    
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: white;
      text-decoration: none;
      font-size: 14px;
      transition: background-color 0.3s ease;
    }
    
    .dropdown-item:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    
    .dropdown-item.logout {
      color: #ff6b6b;
    }
    
    .dropdown-icon {
      width: 16px;
      height: 16px;
    }
    
    @media (max-width: 768px) {
      .header-content {
        padding: 12px 16px;
        gap: 16px;
      }
      
      .header-center {
        display: none;
      }
      
      .status-indicators {
        display: none;
      }
      
      .logo-text {
        display: none;
      }
      
      .settings-btn {
        width: 36px;
        height: 36px;
      }
      
      .user-btn {
        padding: 6px 8px;
      }
    }
  `]
})
export class HeaderComponent {
  searchQuery = '';
  showUserMenu = false;
  aiAgentsRunning = 2;
  pendingTasks = 3;
  userName = 'John Analyst';
  userRole = 'VC Analyst';
  userInitials = 'JA';

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  openSettings(): void {
    // Navigate to settings page
    window.location.href = '/settings';
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      // Implement search functionality
    }
  }
}
