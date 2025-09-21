import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';

/**
 * Main App Component
 * 
 * Root component that provides the main layout structure with header, sidebar, and content area.
 * Implements responsive design with mobile-first approach.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, HeaderComponent],
  template: `
    <div class="app-layout">
      <app-header></app-header>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .main-content {
      flex: 1;
      min-width: 0;
      background-color: var(--off-white);
      overflow-y: auto;
    }
  `]
})
export class AppComponent {
  title = 'AI Analyst - VC Investment Memo App';
}
