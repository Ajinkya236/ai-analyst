import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

/**
 * Landing Page Component
 * 
 * Main landing page with hero section, benefits, social proof, FAQ, and CTA.
 * Implements glassmorphic design with dark theme and smooth animations.
 */
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="landing-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              Transform Your Startup Analysis with 
              <span class="highlight">AI-Powered Intelligence</span>
            </h1>
            <p class="hero-subtitle">
              Automate 70% of your investment memo creation while maintaining full control. 
              Get comprehensive startup insights in minutes, not hours.
            </p>
            <button class="hero-cta" (click)="navigateToReports()">
              <span>Analyze Startups</span>
              <svg class="cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
          <div class="hero-visual">
            <div class="visual-card">
              <div class="card-header">
                <div class="card-dots">
                  <div class="dot red"></div>
                  <div class="dot yellow"></div>
                  <div class="dot green"></div>
                </div>
                <div class="card-title">AI Analyst Dashboard</div>
              </div>
              <div class="card-content">
                <div class="metric-row">
                  <div class="metric">
                    <div class="metric-label">Active Analyses</div>
                    <div class="metric-value">12</div>
                  </div>
                  <div class="metric">
                    <div class="metric-label">AI Confidence</div>
                    <div class="metric-value">94%</div>
                  </div>
                </div>
                <div class="progress-section">
                  <div class="progress-item">
                    <span class="progress-label">Data Collection</span>
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: 85%"></div>
                    </div>
                  </div>
                  <div class="progress-item">
                    <span class="progress-label">AI Analysis</span>
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: 92%"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Benefits Section -->
      <section class="benefits-section">
        <div class="container">
          <h2 class="section-title">Why Choose AI Analyst?</h2>
          <div class="benefits-grid">
            <div class="benefit-card" *ngFor="let benefit of benefits">
              <div class="benefit-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path [attr.d]="benefit.icon"></path>
                </svg>
              </div>
              <h3 class="benefit-title">{{ benefit.title }}</h3>
              <p class="benefit-description">{{ benefit.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Social Proof Section -->
      <section class="social-proof-section">
        <div class="container">
          <h2 class="section-title">Trusted by Leading VCs</h2>
          <div class="testimonials-grid">
            <div class="testimonial-card" *ngFor="let testimonial of testimonials">
              <div class="testimonial-content">
                <p class="testimonial-text">"{{ testimonial.quote }}"</p>
                <div class="testimonial-author">
                  <div class="author-avatar">
                    <img [src]="testimonial.avatar" [alt]="testimonial.name">
                  </div>
                  <div class="author-info">
                    <div class="author-name">{{ testimonial.name }}</div>
                    <div class="author-title">{{ testimonial.title }}</div>
                    <div class="author-company">{{ testimonial.company }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="logos-section">
            <h3 class="logos-title">Used by top investment firms</h3>
            <div class="logos-grid">
              <div class="logo-item" *ngFor="let logo of logos">
                <div class="logo-placeholder">{{ logo.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="faq-section">
        <div class="container">
          <h2 class="section-title">Frequently Asked Questions</h2>
          <div class="faq-list">
            <div class="faq-item" *ngFor="let faq of faqs; let i = index">
              <button class="faq-question" (click)="toggleFaq(i)" [class.active]="faq.isOpen">
                <span class="question-text">{{ faq.question }}</span>
                <svg class="faq-icon" [class.rotated]="faq.isOpen" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </button>
              <div class="faq-answer" [class.open]="faq.isOpen">
                <div class="answer-content">
                  <p>{{ faq.answer }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA Section -->
      <section class="final-cta-section">
        <div class="container">
          <div class="cta-content">
            <h2 class="cta-title">Ready to Transform Your Investment Analysis?</h2>
            <p class="cta-description">
              Join leading VCs who are already saving 70% of their analysis time with AI-powered insights.
            </p>
            <button class="final-cta" (click)="navigateToReports()">
              <span>Analyze Startups</span>
              <svg class="cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .landing-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f1419 0%, #1e2a3a 20%, #2d4059 40%, #3d5a80 60%, #5a4fcf 80%, #7b68ee 100%);
      position: relative;
      overflow-x: hidden;
    }

    .landing-page::before {
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

    .hero-section {
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: 120px 0 80px;
      position: relative;
    }

    .hero-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      align-items: center;
    }

    .hero-text {
      z-index: 2;
    }

    .hero-title {
      font-size: 56px;
      font-weight: 700;
      line-height: 1.1;
      color: white;
      margin-bottom: 24px;
    }

    .highlight {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 20px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 40px;
      max-width: 500px;
    }

    .hero-cta {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 16px 32px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      color: white;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .hero-cta:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }

    .cta-icon {
      width: 20px;
      height: 20px;
      transition: transform 0.3s ease;
    }

    .hero-cta:hover .cta-icon {
      transform: translateX(4px);
    }

    .hero-visual {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .visual-card {
      width: 400px;
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    .card-dots {
      display: flex;
      gap: 6px;
    }

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .dot.red { background: #ff5f57; }
    .dot.yellow { background: #ffbd2e; }
    .dot.green { background: #28ca42; }

    .card-title {
      color: white;
      font-weight: 600;
      font-size: 16px;
    }

    .metric-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }

    .metric {
      text-align: center;
    }

    .metric-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 4px;
    }

    .metric-value {
      font-size: 24px;
      font-weight: 700;
      color: white;
    }

    .progress-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .progress-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .progress-label {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
    }

    .progress-bar {
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    .benefits-section, .social-proof-section, .faq-section, .final-cta-section {
      padding: 80px 0;
      position: relative;
      z-index: 2;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .section-title {
      font-size: 48px;
      font-weight: 700;
      color: white;
      text-align: center;
      margin-bottom: 60px;
    }

    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 32px;
    }

    .benefit-card {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      padding: 32px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .benefit-card:hover {
      background: rgba(255, 255, 255, 0.12);
      transform: translateY(-4px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }

    .benefit-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 24px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4facfe;
    }

    .benefit-icon svg {
      width: 32px;
      height: 32px;
    }

    .benefit-title {
      font-size: 24px;
      font-weight: 700;
      color: white;
      margin-bottom: 16px;
    }

    .benefit-description {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 32px;
      margin-bottom: 60px;
    }

    .testimonial-card {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      padding: 32px;
    }

    .testimonial-text {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.6;
      margin-bottom: 24px;
      font-style: italic;
    }

    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .author-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      overflow: hidden;
    }

    .author-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .author-name {
      font-size: 16px;
      font-weight: 600;
      color: white;
    }

    .author-title {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
    }

    .author-company {
      font-size: 14px;
      color: #4facfe;
    }

    .logos-section {
      text-align: center;
    }

    .logos-title {
      font-size: 20px;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 32px;
    }

    .logos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 24px;
    }

    .logo-item {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60px;
    }

    .logo-placeholder {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      font-weight: 500;
    }

    .faq-list {
      max-width: 800px;
      margin: 0 auto;
    }

    .faq-item {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      margin-bottom: 16px;
      overflow: hidden;
    }

    .faq-question {
      width: 100%;
      padding: 24px;
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      font-weight: 600;
      text-align: left;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s ease;
    }

    .faq-question:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .faq-icon {
      width: 20px;
      height: 20px;
      transition: transform 0.3s ease;
    }

    .faq-icon.rotated {
      transform: rotate(180deg);
    }

    .faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .faq-answer.open {
      max-height: 200px;
    }

    .answer-content {
      padding: 0 24px 24px;
    }

    .answer-content p {
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.6;
    }

    .final-cta-section {
      text-align: center;
    }

    .cta-content {
      max-width: 600px;
      margin: 0 auto;
    }

    .cta-title {
      font-size: 48px;
      font-weight: 700;
      color: white;
      margin-bottom: 24px;
    }

    .cta-description {
      font-size: 20px;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 40px;
      line-height: 1.6;
    }

    .final-cta {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 20px 40px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      color: white;
      font-size: 20px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .final-cta:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }

    @media (max-width: 768px) {
      .hero-content {
        grid-template-columns: 1fr;
        gap: 40px;
        text-align: center;
      }

      .hero-title {
        font-size: 36px;
      }

      .hero-subtitle {
        font-size: 18px;
      }

      .visual-card {
        width: 100%;
        max-width: 350px;
      }

      .section-title {
        font-size: 36px;
      }

      .benefits-grid {
        grid-template-columns: 1fr;
      }

      .testimonials-grid {
        grid-template-columns: 1fr;
      }

      .cta-title {
        font-size: 36px;
      }
    }
  `]
})
export class LandingComponent implements OnInit {
  benefits = [
    {
      title: 'Automated Memo Drafting',
      description: 'Saves associates 70% manual effort with AI-powered analysis and structured memo generation',
      icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z'
    },
    {
      title: 'Comprehensive Data Collection',
      description: 'Automatically gather insights from multiple sources including founder interviews and market research',
      icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5-5 5 5M12 15V3'
    },
    {
      title: 'Risk Analysis & Scoring',
      description: 'AI-powered risk flag detection and confidence scoring for better investment decisions',
      icon: 'M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2z'
    },
    {
      title: 'Customizable Preferences',
      description: 'Adjust section weights and priorities to match your investment criteria and analysis style',
      icon: 'M12 6V4m0 2a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m-6 8a2 2 0 1 0 0-4m0 4a2 2 0 1 1 0-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 1 0 0-4m0 4a2 2 0 1 1 0-4m0 4v2m0-6V4'
    },
    {
      title: 'Real-time Collaboration',
      description: 'Share insights and collaborate with team members on investment decisions',
      icon: 'M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z'
    },
    {
      title: 'Scalable Analysis',
      description: 'Handle multiple startup evaluations simultaneously without compromising quality',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z'
    }
  ];

  testimonials = [
    {
      quote: 'AI Analyst has revolutionized our due diligence process. We can now evaluate 3x more startups with higher accuracy and consistency.',
      name: 'Sarah Chen',
      title: 'Principal',
      company: 'TechVentures Capital',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      quote: 'The AI-powered insights have significantly improved our investment decision quality. The risk analysis is particularly impressive.',
      name: 'Michael Rodriguez',
      title: 'Managing Partner',
      company: 'Innovation Partners',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    }
  ];

  logos = [
    { name: 'Sequoia Capital' },
    { name: 'Andreessen Horowitz' },
    { name: 'Accel Partners' },
    { name: 'Bessemer Ventures' },
    { name: 'General Catalyst' },
    { name: 'Index Ventures' }
  ];

  faqs = [
    {
      question: 'Will AI replace my investment judgment?',
      answer: 'No, AI Analyst enhances your judgment by providing comprehensive data analysis and insights. You maintain full control over investment decisions and can customize preferences to match your investment criteria.',
      isOpen: false
    },
    {
      question: 'How accurate is the AI analysis?',
      answer: 'Our AI provides confidence scores for each analysis section, typically achieving 85-95% accuracy. All insights are validated against multiple data sources and include risk flags for transparency.',
      isOpen: false
    },
    {
      question: 'Is my data secure and private?',
      answer: 'Yes, all data is encrypted at rest and in transit. We follow SOC 2 compliance standards and never share your proprietary analysis with third parties.',
      isOpen: false
    },
    {
      question: 'Can I customize the analysis criteria?',
      answer: 'Absolutely. You can adjust section weights, priorities, and analysis preferences to match your investment thesis and evaluation criteria.',
      isOpen: false
    },
    {
      question: 'How long does it take to generate an investment memo?',
      answer: 'Typically 15-30 minutes for comprehensive analysis, depending on data complexity. The AI works in the background, so you can focus on other tasks.',
      isOpen: false
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check if user is returning
    const isReturningUser = localStorage.getItem('ai-analyst-returning-user');
    if (isReturningUser) {
      // Personalize messaging for returning users
      console.log('Welcome back, ready to analyze another startup?');
    }
  }

  navigateToReports(): void {
    // Mark as returning user
    localStorage.setItem('ai-analyst-returning-user', 'true');
    
    // Create default workspace for first-time users
    const hasWorkspace = localStorage.getItem('ai-analyst-workspace');
    if (!hasWorkspace) {
      localStorage.setItem('ai-analyst-workspace', JSON.stringify({
        id: 'default',
        name: 'My Reports',
        createdAt: new Date().toISOString()
      }));
    }
    
    // Navigate to reports page
    this.router.navigate(['/reports']);
  }

  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}
