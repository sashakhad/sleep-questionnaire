import { assertContinueDisabled, assertContinueEnabled } from '../support/assertions';

function goToDemographics(): void {
  cy.visit('/');
  cy.get('form', { timeout: 10000 }).should('exist');
  cy.contains('I have read and understand the service that we provide')
    .closest('[data-slot="form-item"]')
    .find('button[role="checkbox"]')
    .click();
  cy.contains('button', 'Continue').click();
  cy.get('[data-slot="card-title"]', { timeout: 10000 }).should('contain.text', 'About You');
}

describe('Demographics Section Validation', () => {
  it('All fields empty — Continue is disabled', () => {
    goToDemographics();
    assertContinueDisabled();
  });

  it('Only yearOfBirth filled — Continue still disabled', () => {
    goToDemographics();
    cy.contains('What year were you born?')
      .closest('[data-slot="form-item"]')
      .find('button[role="combobox"]')
      .click();
    cy.contains('1990').click();
    assertContinueDisabled();
  });

  it('yearOfBirth and sex filled — Continue still disabled', () => {
    goToDemographics();
    cy.contains('What year were you born?')
      .closest('[data-slot="form-item"]')
      .find('button[role="combobox"]')
      .click();
    cy.contains('1990').click();
    cy.selectOption('Sex', 'Male');
    assertContinueDisabled();
  });

  it('Short zipcode (< 5 chars) — Continue still disabled', () => {
    goToDemographics();
    cy.contains('What year were you born?')
      .closest('[data-slot="form-item"]')
      .find('button[role="combobox"]')
      .click();
    cy.contains('1990').click();
    cy.selectOption('Sex', 'Male');
    cy.get('input[placeholder="e.g., 12345"]').type('1234');
    assertContinueDisabled();
  });

  it('All required fields filled — Continue is enabled', () => {
    goToDemographics();
    cy.contains('What year were you born?')
      .closest('[data-slot="form-item"]')
      .find('button[role="combobox"]')
      .click();
    cy.contains('1990').click();
    cy.selectOption('Sex', 'Male');
    cy.get('input[placeholder="e.g., 12345"]').type('12345');
    assertContinueEnabled();
  });

  it('Birth year combobox does not offer years making respondent younger than 12', () => {
    goToDemographics();
    const currentYear = new Date().getFullYear();
    const tooYoungYear = currentYear - 11;
    const maxAllowedYear = currentYear - 12;

    cy.contains('What year were you born?')
      .closest('[data-slot="form-item"]')
      .find('button[role="combobox"]')
      .click();

    // Search for a year that would make the respondent younger than 12 — expect no results
    cy.get('input[placeholder="Type a year..."]').type(tooYoungYear.toString());
    cy.contains('No year found.').should('be.visible');

    // Close and reopen to verify the max allowed year is present
    cy.get('body').type('{esc}');
    cy.contains('What year were you born?')
      .closest('[data-slot="form-item"]')
      .find('button[role="combobox"]')
      .click();
    cy.get('input[placeholder="Type a year..."]').type(maxAllowedYear.toString());
    cy.contains(maxAllowedYear.toString()).should('be.visible');
  });

  it('Pre-filled demographics on dev route — Continue is enabled', () => {
    cy.navigateToSection('demographics');
    assertContinueEnabled();
  });
});
