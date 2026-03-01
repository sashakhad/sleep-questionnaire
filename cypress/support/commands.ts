/// <reference types="cypress" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      navigateToSection(section: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('navigateToSection', (section: string) => {
  cy.visit(`/dev?section=${section}`);
  cy.get('form', { timeout: 10000 }).should('exist');
  cy.wait(500);
});

export {};
