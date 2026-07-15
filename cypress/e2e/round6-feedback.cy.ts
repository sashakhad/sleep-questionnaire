describe('Round 6 Client Feedback Fixes (7/15)', () => {
  it('accepts 0 minutes for sleep onset latency without a validation error', () => {
    cy.navigateToSection('scheduled-sleep');

    cy.contains('label', /how long does it take you to fall asleep/i)
      .closest('[data-slot="form-item"]')
      .find('button[role="combobox"]')
      .should('be.visible')
      .click();
    cy.get('[role="option"]').contains('0 minutes').should('be.visible').click();

    cy.contains('label', /how long does it take you to fall asleep/i)
      .closest('[data-slot="form-item"]')
      .within(() => {
        cy.get('[data-slot="form-message"]').should('not.exist');
      });
  });

  it('accepts 0 minutes for time awake at night without a validation error', () => {
    cy.navigateToSection('scheduled-sleep');

    cy.contains('label', /how many minutes total are you awake during the night/i)
      .closest('[data-slot="form-item"]')
      .find('button[role="combobox"]')
      .should('be.visible')
      .click();
    cy.get('[role="option"]').contains('0 minutes').should('be.visible').click();

    cy.contains('label', /how many minutes total are you awake during the night/i)
      .closest('[data-slot="form-item"]')
      .within(() => {
        cy.get('[data-slot="form-message"]').should('not.exist');
      });
  });
});
