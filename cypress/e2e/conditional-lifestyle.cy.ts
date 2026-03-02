describe('Work/School Time and Lifestyle Conditionals', () => {
  describe('Work/school time visibility', () => {
    beforeEach(() => {
      cy.navigateToSection('chronotype');
    });

    it('should show work/school time field with default mock data (preference=late, shiftWork=false)', () => {
      cy.contains(/what time do you have to be at work\/school/i).should('exist');
    });

    it('should hide work/school time when flexible preference is selected', () => {
      cy.clickRadio('flexible');
      cy.contains(/what time do you have to be at work\/school/i).should('not.exist');
    });

    it('should show work/school time when flexible + shift work is checked', () => {
      cy.clickRadio('flexible');
      cy.checkCheckbox('My job requires me to do shift work');
      cy.contains(/what time do you have to be at work\/school/i).should('exist');
    });

    it('should keep work/school time visible when switching from late to early', () => {
      cy.clickRadio('early');
      cy.contains(/what time do you have to be at work\/school/i).should('exist');
    });
  });

  describe('Caffeine conditionals', () => {
    beforeEach(() => {
      cy.navigateToSection('lifestyle');
    });

    it('should show lastCaffeineTime field with default mock data (caffeinePerDay=2)', () => {
      cy.contains('What time do you have your final caffeinated food or beverage?').should('be.visible');
    });

    it('should hide lastCaffeineTime when caffeinePerDay is set to 0', () => {
      cy.contains('label', /how many servings of caffeinated food/i)
        .closest('[data-slot="form-item"]')
        .find('input')
        .clear()
        .type('0');
      cy.contains('What time do you have your final caffeinated food or beverage?').should('not.exist');
    });

    it('should show lastCaffeineTime when caffeinePerDay is changed from 0 to 1', () => {
      cy.contains('label', /how many servings of caffeinated food/i)
        .closest('[data-slot="form-item"]')
        .find('input')
        .clear()
        .type('0');
      cy.contains('What time do you have your final caffeinated food or beverage?').should('not.exist');
      cy.contains('label', /how many servings of caffeinated food/i)
        .closest('[data-slot="form-item"]')
        .find('input')
        .clear()
        .type('1');
      cy.contains('What time do you have your final caffeinated food or beverage?').should('exist');
    });

    it('should show High Caffeine warning when caffeinePerDay exceeds 4', () => {
      cy.contains('strong', 'High Caffeine Intake').should('not.exist');
      cy.contains('label', /how many servings of caffeinated food/i)
        .closest('[data-slot="form-item"]')
        .find('input')
        .clear()
        .type('5');
      cy.contains('strong', 'High Caffeine Intake').should('exist');
    });
  });

  describe('Exercise conditionals', () => {
    beforeEach(() => {
      cy.navigateToSection('lifestyle');
    });

    it('should show exercise duration and end time with default mock data (exerciseDaysPerWeek=3)', () => {
      cy.contains('How long do you typically exercise?').should('be.visible');
      cy.contains('What time does your exercise typically end?').should('be.visible');
    });

    it('should hide exercise fields and show No Regular Exercise warning when days is 0', () => {
      cy.contains('label', /how many days do you exercise/i)
        .closest('[data-slot="form-item"]')
        .find('input')
        .clear()
        .type('0');
      cy.contains('How long do you typically exercise?').should('not.exist');
      cy.contains('What time does your exercise typically end?').should('not.exist');
      cy.contains('strong', 'No Regular Exercise').should('exist');
    });

    it('should show Great Exercise Habits alert when exerciseDaysPerWeek is 5 or more', () => {
      cy.contains('label', /how many days do you exercise/i)
        .closest('[data-slot="form-item"]')
        .find('input')
        .clear()
        .type('5');
      cy.contains('strong', 'Great Exercise Habits!').should('exist');
    });

    it('should restore exercise fields and hide no-exercise warning when days go from 0 to 2', () => {
      cy.contains('label', /how many days do you exercise/i)
        .closest('[data-slot="form-item"]')
        .find('input')
        .clear()
        .type('0');
      cy.contains('strong', 'No Regular Exercise').should('exist');
      cy.contains('label', /how many days do you exercise/i)
        .closest('[data-slot="form-item"]')
        .find('input')
        .clear()
        .type('2');
      cy.contains('How long do you typically exercise?').should('be.visible');
      cy.contains('strong', 'No Regular Exercise').should('not.exist');
    });
  });
});
