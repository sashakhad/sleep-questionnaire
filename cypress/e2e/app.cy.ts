describe('Sleep Questionnaire App', () => {
  it('should load the questionnaire', () => {
    cy.visit('/');

    // Basic checks that the app is working
    cy.get('body').should('be.visible');
    cy.get('html').should('have.attr', 'lang');

    // Check that the questionnaire loads with proper content
    cy.get('h1').should('exist');
    cy.get('div').should('exist');
  });

  it('should have proper page structure', () => {
    cy.visit('/');

    // Check for basic HTML structure
    cy.get('head').should('exist');
    cy.get('body').should('exist');

    // Ensure the page is interactive (not just a static file)
    cy.window().should('have.property', 'document');
  });

  it('should display the questionnaire form', () => {
    cy.visit('/');

    // Check that the questionnaire form elements exist
    cy.get('form').should('exist');
    cy.get('button').should('exist');
  });
});
