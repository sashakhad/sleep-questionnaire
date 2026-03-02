describe('Chronotype Conditional Logic', () => {
  describe('Shift work conditionals', () => {
    beforeEach(() => {
      cy.navigateToSection('chronotype');
    });

    it('should hide shift type and days fields when shiftWork is false', () => {
      cy.contains('What type of shift do you work?').should('not.exist');
      cy.contains('How many days a week do you work shifts?').should('not.exist');
    });

    it('should show pastShiftWorkYears field when shiftWork is false', () => {
      cy.contains("If you don't currently do shift work").should('be.visible');
    });

    it('should show shift type and days fields when shift work is checked', () => {
      cy.checkCheckbox('My job requires me to do shift work');
      cy.contains('What type of shift do you work?').should('exist');
      cy.contains('How many days a week do you work shifts?').should('be.visible');
    });

    it('should hide pastShiftWorkYears when shift work is checked', () => {
      cy.checkCheckbox('My job requires me to do shift work');
      cy.contains("If you don't currently do shift work").should('not.exist');
    });

    it('should restore pastShiftWorkYears and hide shift details when unchecked', () => {
      cy.checkCheckbox('My job requires me to do shift work');
      cy.uncheckCheckbox('My job requires me to do shift work');
      cy.contains('What type of shift do you work?').should('not.exist');
      cy.contains("If you don't currently do shift work").should('be.visible');
    });
  });

  describe('Preference conditionals', () => {
    beforeEach(() => {
      cy.navigateToSection('chronotype');
    });

    it('should show night owl preference strength with default late preference', () => {
      cy.contains('How strong is your night owl preference?').should('be.visible');
    });

    it('should hide preference strength when flexible is selected', () => {
      cy.clickRadio('flexible');
      cy.contains(/how strong is your (night owl|morning) preference/i).should('not.exist');
    });

    it('should show morning preference strength when early is selected', () => {
      cy.clickRadio('early');
      cy.contains('How strong is your morning preference?').should('be.visible');
    });

    it('should hide preference strength when switching from early to flexible', () => {
      cy.clickRadio('early');
      cy.clickRadio('flexible');
      cy.contains(/how strong is your (night owl|morning) preference/i).should('not.exist');
    });
  });

  describe('Chronotype warning alerts', () => {
    beforeEach(() => {
      cy.navigateToSection('chronotype');
    });

    it('should show Night Owl alert with default late preference', () => {
      cy.contains('strong', 'Night Owl Chronotype').should('exist');
    });

    it('should not show Morning Person alert with default late preference', () => {
      cy.contains('strong', 'Morning Person Chronotype').should('not.exist');
    });

    it('should show Morning Person alert and hide Night Owl when early is selected', () => {
      cy.clickRadio('early');
      cy.contains('strong', 'Morning Person Chronotype').should('exist');
      cy.contains('strong', 'Night Owl Chronotype').should('not.exist');
    });

    it('should hide both chronotype alerts when flexible is selected', () => {
      cy.clickRadio('flexible');
      cy.contains('strong', 'Night Owl Chronotype').should('not.exist');
      cy.contains('strong', 'Morning Person Chronotype').should('not.exist');
    });

    it('should not show Shift Work Impact warning with default mock data (shiftWork=false, pastShiftWorkYears=0)', () => {
      cy.contains('strong', 'Shift Work Impact').should('not.exist');
    });

    it('should show Shift Work Impact warning when shift work is checked', () => {
      cy.checkCheckbox('My job requires me to do shift work');
      cy.contains('strong', 'Shift Work Impact').should('exist');
    });

    it('should show Shift Work Impact warning when pastShiftWorkYears is non-zero', () => {
      cy.contains('label', /how many years did you do shift work/i)
        .closest('[data-slot="form-item"]')
        .find('input')
        .clear()
        .type('5');
      cy.contains('strong', 'Shift Work Impact').should('exist');
    });
  });
});
