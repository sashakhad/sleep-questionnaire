/// <reference types="cypress" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      navigateToSection(section: string): Chainable<void>;
      selectOption(label: string, value: string): Chainable<void>;
      clickRadio(value: string): Chainable<void>;
      checkCheckbox(label: string): Chainable<void>;
      uncheckCheckbox(label: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('navigateToSection', (section: string) => {
  cy.visit(`/dev?section=${section}`);
  cy.get('form', { timeout: 10000 }).should('exist');
  cy.get('[data-slot="card-title"]', { timeout: 10000 }).should('be.visible');
});

Cypress.Commands.add('selectOption', (label: string, value: string) => {
  cy.contains('[data-slot="form-item"]', label)
    .find('button[role="combobox"]')
    .click();
  cy.get('[role="option"]').contains(value).click();
});

Cypress.Commands.add('clickRadio', (value: string) => {
  cy.get(`button[role="radio"][value="${value}"]`).click({ force: true });
});

Cypress.Commands.add('checkCheckbox', (label: string) => {
  cy.contains('label', label).then(($label) => {
    const forAttr = $label.attr('for');
    if (forAttr) {
      cy.get(`#${forAttr}`).then(($checkbox) => {
        if (!$checkbox.prop('checked')) {
          cy.wrap($checkbox).click({ force: true });
        }
      });
    } else {
      cy.wrap($label).siblings('button[role="checkbox"]').then(($btn) => {
        if ($btn.attr('aria-checked') !== 'true') {
          cy.wrap($btn).click({ force: true });
        }
      });
    }
  });
});

Cypress.Commands.add('uncheckCheckbox', (label: string) => {
  cy.contains('label', label).then(($label) => {
    const forAttr = $label.attr('for');
    if (forAttr) {
      cy.get(`#${forAttr}`).then(($checkbox) => {
        if ($checkbox.prop('checked')) {
          cy.wrap($checkbox).click({ force: true });
        }
      });
    } else {
      cy.wrap($label).siblings('button[role="checkbox"]').then(($btn) => {
        if ($btn.attr('aria-checked') === 'true') {
          cy.wrap($btn).click({ force: true });
        }
      });
    }
  });
});

export {};
