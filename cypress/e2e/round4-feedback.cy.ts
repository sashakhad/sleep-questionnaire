describe('Round 4 Client Feedback Changes', () => {
  it('nests bad dreams and nightmares under dream recall', () => {
    cy.navigateToSection('nightmares');

    cy.uncheckCheckbox('I remember my dreams at least a few nights a week');
    cy.contains('I have bad dreams').should('not.exist');
    cy.contains('I have nightmares').should('not.exist');

    cy.checkCheckbox('I remember my dreams at least a few nights a week');

    cy.contains('I have bad dreams').should('be.visible');
    cy.contains('I have nightmares').should('be.visible');
    cy.contains('but not nightmares').should('not.exist');
  });

  it('shows a breathing warning for mouth breathing plus dry mouth', () => {
    cy.navigateToSection('breathing-disorders');

    cy.checkCheckbox('I mouth breathe');
    cy.checkCheckbox('I frequently wake up with a dry mouth');

    cy.contains('possible sleep-disordered breathing').should('be.visible');
  });

  it('shows excessive caffeine warning above 4 servings per day', () => {
    cy.navigateToSection('lifestyle');

    cy.contains('How many servings of caffeinated food or beverages')
      .closest('[data-slot="form-item"]')
      .find('input')
      .clear()
      .type('5');

    cy.contains('High Caffeine Intake').should('be.visible');
  });

  it('shows sleep-aid frequency and nicotine warnings', () => {
    cy.navigateToSection('sleep-hygiene');

    cy.checkCheckbox('Melatonin');
    cy.contains('How many nights a week do you take these supplements').should('be.visible');

    cy.checkCheckbox('Z-drugs');
    cy.contains('How many nights a week do you take these prescription sleep medications').should(
      'be.visible'
    );

    cy.checkCheckbox('I smoke cigarettes or use nicotine patches');
    cy.contains('Tobacco or Nicotine Use').should('be.visible');
  });

  it('uses the new leg cramps threshold of 3 nights', () => {
    cy.navigateToSection('restless-legs');

    cy.checkCheckbox('I experience leg cramps at night');
    cy.contains('How many nights per week do you experience leg cramps?')
      .closest('[data-slot="form-item"]')
      .find('input')
      .clear()
      .type('2');
    cy.contains('Frequent Nocturnal Leg Cramps').should('not.exist');

    cy.contains('How many nights per week do you experience leg cramps?')
      .closest('[data-slot="form-item"]')
      .find('input')
      .clear()
      .type('3');
    cy.contains('Frequent Nocturnal Leg Cramps').should('be.visible');
  });
});
