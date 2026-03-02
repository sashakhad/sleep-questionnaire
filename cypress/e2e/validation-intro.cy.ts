import { assertContinueDisabled, assertContinueEnabled } from '../support/assertions';

describe('Intro Section Validation', () => {
  it('Continue is disabled when disclaimer is unchecked', () => {
    cy.visit('/');
    cy.get('form', { timeout: 10000 }).should('exist');
    assertContinueDisabled();
  });

  it('Continue becomes enabled after checking the disclaimer', () => {
    cy.visit('/');
    cy.get('form', { timeout: 10000 }).should('exist');
    cy.contains('I have read and understand the service that we provide')
      .closest('[data-slot="form-item"]')
      .find('button[role="checkbox"]')
      .click();
    assertContinueEnabled();
  });

  it('Continue becomes disabled again after unchecking the disclaimer', () => {
    cy.visit('/');
    cy.get('form', { timeout: 10000 }).should('exist');
    const checkbox = () =>
      cy
        .contains('I have read and understand the service that we provide')
        .closest('[data-slot="form-item"]')
        .find('button[role="checkbox"]');
    // Check
    checkbox().click();
    assertContinueEnabled();
    // Uncheck
    checkbox().click();
    assertContinueDisabled();
  });

  it('Disclaimer starts checked on dev route (pre-filled)', () => {
    cy.navigateToSection('intro');
    cy.contains('I have read and understand the service that we provide')
      .closest('[data-slot="form-item"]')
      .find('button[role="checkbox"]')
      .should('have.attr', 'data-state', 'checked');
    assertContinueEnabled();
  });
});
