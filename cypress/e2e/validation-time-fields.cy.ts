describe('Time Field Validation', () => {
  describe('Scheduled Sleep time fields', () => {
    beforeEach(() => {
      cy.navigateToSection('scheduled-sleep');
    });

    it('Time field renders three select dropdowns', () => {
      cy.contains('What time do you turn out the lights and try to fall asleep?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .should('have.length', 3);
    });

    it('Hour select shows all 12 options', () => {
      cy.contains('What time do you turn out the lights and try to fall asleep?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .eq(0)
        .click();
      cy.get('[role="option"]').should('have.length', 12);
    });

    it('Minute select shows 15-minute increment options', () => {
      cy.contains('What time do you turn out the lights and try to fall asleep?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .eq(1)
        .click();
      cy.get('[role="option"]').should('have.length', 4);
    });

    it('AM/PM select shows both period options', () => {
      cy.contains('What time do you turn out the lights and try to fall asleep?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .eq(2)
        .click();
      cy.get('[role="option"]').should('have.length', 2);
    });

    it('Selecting time values updates the displayed field values', () => {
      // Select hour 10
      cy.contains('What time do you turn out the lights and try to fall asleep?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .eq(0)
        .click();
      cy.contains('[role="option"]', '10').click();

      // Select minute 30
      cy.contains('What time do you turn out the lights and try to fall asleep?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .eq(1)
        .click();
      cy.contains('[role="option"]', '30').click();

      // Select period PM
      cy.contains('What time do you turn out the lights and try to fall asleep?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .eq(2)
        .click();
      cy.contains('[role="option"]', 'PM').click();

      // Verify all three selects display the chosen values
      cy.contains('What time do you turn out the lights and try to fall asleep?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .eq(0)
        .should('contain.text', '10');
      cy.contains('What time do you turn out the lights and try to fall asleep?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .eq(1)
        .should('contain.text', '30');
      cy.contains('What time do you turn out the lights and try to fall asleep?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .eq(2)
        .should('contain.text', 'PM');
    });
  });

  describe('Chronotype workSchoolTime field', () => {
    it('Work/school time field renders on chronotype section', () => {
      cy.navigateToSection('chronotype');
      // Mock data has preference: 'late', so the conditional time field is visible
      cy.contains('what time do you have to be at work/school?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .should('have.length', 3);
    });
  });

  describe('Cross-section time field presence', () => {
    it('Unscheduled sleep has time fields for lights out, wake up, and get out of bed', () => {
      cy.navigateToSection('unscheduled-sleep');
      cy.contains('What time do you turn out the lights and try to fall asleep?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .should('have.length', 3);
      cy.contains('What time do you wake up?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .should('have.length', 3);
      cy.contains('What time do you get out of bed?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .should('have.length', 3);
    });

    it('Lifestyle section has time fields for caffeine and exercise', () => {
      cy.navigateToSection('lifestyle');
      // Mock data has caffeinePerDay: 2 and exerciseDaysPerWeek: 3, so both time fields are visible
      cy.contains('What time do you have your final caffeinated food or beverage?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .should('have.length', 3);
      cy.contains('What time does your exercise typically end?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .should('have.length', 3);
    });
  });
});
