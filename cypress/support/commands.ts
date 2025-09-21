/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>;
      
      /**
       * Custom command to login with test credentials
       * @example cy.login('test@example.com', 'password')
       */
      login(email: string, password: string): Chainable<void>;
      
      /**
       * Custom command to wait for AI agent to complete
       * @example cy.waitForAIAgent('founder-voice')
       */
      waitForAIAgent(agentType: string): Chainable<void>;
      
      /**
       * Custom command to upload test file
       * @example cy.uploadFile('test.pdf')
       */
      uploadFile(filename: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('dataCy', (value: string) => {
  return cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-cy=email-input]').type(email);
  cy.get('[data-cy=password-input]').type(password);
  cy.get('[data-cy=login-button]').click();
  cy.url().should('include', '/dashboard');
});

Cypress.Commands.add('waitForAIAgent', (agentType: string) => {
  cy.get(`[data-cy=${agentType}-agent]`).should('contain', 'Completed');
});

Cypress.Commands.add('uploadFile', (filename: string) => {
  const filePath = `cypress/fixtures/${filename}`;
  cy.get('[data-cy=file-upload]').selectFile(filePath);
});
