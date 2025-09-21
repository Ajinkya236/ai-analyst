describe('Dashboard', () => {
  beforeEach(() => {
    cy.visit('/dashboard');
  });

  it('should display dashboard title and description', () => {
    cy.contains('Investment Analysis Dashboard').should('be.visible');
    cy.contains('Monitor your AI-powered investment analysis workflow').should('be.visible');
  });

  it('should display overview cards with metrics', () => {
    cy.get('[data-cy=overview-card]').should('have.length', 4);
    cy.contains('Active Analyses').should('be.visible');
    cy.contains('Completed Memos').should('be.visible');
    cy.contains('AI Agents Running').should('be.visible');
    cy.contains('Data Sources').should('be.visible');
  });

  it('should display workflow progress section', () => {
    cy.contains('Current Workflow Progress').should('be.visible');
    cy.get('[data-cy=workflow-step]').should('have.length', 3);
  });

  it('should display recent activity section', () => {
    cy.contains('Recent Activity').should('be.visible');
    cy.get('[data-cy=activity-item]').should('have.length.at.least', 1);
  });

  it('should display quick actions section', () => {
    cy.contains('Quick Actions').should('be.visible');
    cy.get('[data-cy=action-card]').should('have.length', 3);
  });

  it('should navigate to Stage 0 when clicking Start New Analysis', () => {
    cy.get('[data-cy=start-new-analysis]').click();
    cy.url().should('include', '/stage-0');
  });

  it('should be responsive on mobile devices', () => {
    cy.viewport(375, 667);
    cy.get('[data-cy=overview-grid]').should('be.visible');
    cy.get('[data-cy=action-buttons]').should('be.visible');
  });
});
