import { Routes } from '@angular/router';

/**
 * Application Routes Configuration
 * 
 * Defines the main navigation routes for the AI Analyst app.
 * Implements lazy loading for better performance.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent),
    title: 'AI Analyst - VC Investment Analysis Platform'
  },
  {
    path: 'dashboard',
    redirectTo: '/reports',
    pathMatch: 'full'
  },
  {
    path: 'stage-0',
    loadComponent: () => import('./pages/stage-0/stage-0.component').then(m => m.Stage0Component),
    title: 'Stage 0: Data Collection - AI Analyst'
  },
  {
    path: 'stage-1',
    loadComponent: () => import('./pages/stage-1/stage-1.component').then(m => m.Stage1Component),
    title: 'Stage 1: AI-Generated Memo - AI Analyst'
  },
  {
    path: 'stage-2',
    loadComponent: () => import('./pages/stage-2/stage-2.component').then(m => m.Stage2Component),
    title: 'Stage 2: Curated Memo - AI Analyst'
  },
  {
    path: 'reports',
    loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent),
    title: 'My Reports - AI Analyst'
  },
  {
    path: 'report/:id',
    loadComponent: () => import('./pages/report/report.component').then(m => m.ReportComponent),
    title: 'Report - AI Analyst'
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
    title: 'Settings - AI Analyst'
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page Not Found - AI Analyst'
  }
];
