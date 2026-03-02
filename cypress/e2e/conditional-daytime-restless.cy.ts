describe('Daytime and Restless Legs Conditionals', () => {
  describe('Planned nap conditionals', () => {
    beforeEach(() => {
      cy.navigateToSection('daytime');
    });

    it('should show nap duration select with default mock data (daysPerWeek=2)', () => {
      cy.contains('How long are my naps typically?').should('be.visible');
    });

    it('should hide nap duration select when daysPerWeek is set to 0', () => {
      cy.contains('label', /I take planned naps how many days per week/i)
        .closest('[data-slot="form-item"]')
        .find('input')
        .clear()
        .type('0');
      cy.contains('How long are my naps typically?').should('not.exist');
    });
  });

  describe('Sleepiness severity chain', () => {
    beforeEach(() => {
      cy.navigateToSection('daytime');
    });

    it('should show severity slider section with default mock data (sleepinessInterferes=true)', () => {
      cy.contains('How severe is the interference?').should('be.visible');
    });

    it('should show tiredButCantSleep radio group with default severity=5 (<=6)', () => {
      cy.contains('I feel tired but cannot fall asleep:').should('be.visible');
    });

    it('should not show Important Safety Warning with default severity=5', () => {
      cy.contains('strong', 'Important Safety Warning').should('not.exist');
    });

    it('should hide severity slider and tiredButCantSleep when sleepinessInterferes is unchecked', () => {
      cy.uncheckCheckbox('My sleepiness interferes with my daily activities');
      cy.contains('How severe is the interference?').should('not.exist');
      cy.contains('I feel tired but cannot fall asleep:').should('not.exist');
    });

    it('should show narcolepsy questions with default data (fallAsleepDuring has items AND sleepinessInterferes=true)', () => {
      cy.contains('When I laugh or feel excited:').should('be.visible');
    });

    it('should hide narcolepsy questions when sleepinessInterferes is unchecked', () => {
      cy.uncheckCheckbox('My sleepiness interferes with my daily activities');
      cy.contains('When I laugh or feel excited:').should('not.exist');
    });
  });

  describe('Pain severity conditional', () => {
    beforeEach(() => {
      cy.navigateToSection('daytime');
    });

    it('should hide pain severity slider with default mock data (painAffectsSleep=false)', () => {
      cy.contains('How severe is my pain on a scale of 1-10?').should('not.exist');
    });

    it('should show pain severity slider when painAffectsSleep is checked', () => {
      cy.checkCheckbox('Pain affects my ability to fall asleep or stay asleep');
      cy.contains('How severe is my pain on a scale of 1-10?').should('exist');
    });

    it('should hide pain severity slider when painAffectsSleep is unchecked', () => {
      cy.checkCheckbox('Pain affects my ability to fall asleep or stay asleep');
      cy.uncheckCheckbox('Pain affects my ability to fall asleep or stay asleep');
      cy.contains('How severe is my pain on a scale of 1-10?').should('not.exist');
    });
  });

  describe('Chronic Fatigue warning', () => {
    beforeEach(() => {
      cy.navigateToSection('daytime');
    });

    it('should not show Chronic Fatigue warning with default data (jointMusclePain=false)', () => {
      cy.contains('strong', 'Potential Chronic Fatigue Symptoms').should('not.exist');
    });

    it('should show Chronic Fatigue warning when jointMusclePain is checked (all 3 conditions met)', () => {
      cy.checkCheckbox('I experience joint and muscle pain during the day');
      cy.contains('strong', 'Potential Chronic Fatigue Symptoms').should('exist');
    });
  });

  describe('Restless legs conditionals', () => {
    beforeEach(() => {
      cy.navigateToSection('restless-legs');
    });

    it('should hide legCrampsPerWeek field with default mock data (legCramps=false)', () => {
      cy.contains('How many nights per week do you experience leg cramps?').should('not.exist');
    });

    it('should show legCrampsPerWeek field when legCramps is checked', () => {
      cy.checkCheckbox('I experience leg cramps at night');
      cy.contains('How many nights per week do you experience leg cramps?').should('exist');
    });

    it('should show Frequent Nocturnal Leg Cramps warning when legCrampsPerWeek is 2', () => {
      cy.checkCheckbox('I experience leg cramps at night');
      cy.contains('label', /how many nights per week do you experience leg cramps/i)
        .closest('[data-slot="form-item"]')
        .find('input')
        .clear()
        .type('2');
      cy.contains('strong', 'Frequent Nocturnal Leg Cramps').should('exist');
    });

    it('should not show Frequent Nocturnal Leg Cramps warning when legCrampsPerWeek is 1', () => {
      cy.checkCheckbox('I experience leg cramps at night');
      cy.contains('label', /how many nights per week do you experience leg cramps/i)
        .closest('[data-slot="form-item"]')
        .find('input')
        .clear()
        .type('1');
      cy.contains('strong', 'Frequent Nocturnal Leg Cramps').should('not.exist');
    });

    it('should hide legCrampsPerWeek field when legCramps is unchecked', () => {
      cy.checkCheckbox('I experience leg cramps at night');
      cy.uncheckCheckbox('I experience leg cramps at night');
      cy.contains('How many nights per week do you experience leg cramps?').should('not.exist');
    });

    it('should show RLS warning when troubleLyingStill is checked', () => {
      cy.checkCheckbox('I have trouble lying still while trying to fall asleep at night');
      cy.contains('Your answers suggest that you may have restless legs syndrome').should('exist');
    });

    it('should show RLS warning when urgeToMoveLegs is checked', () => {
      cy.checkCheckbox('I have an urge to move my legs while lying in bed at night');
      cy.contains('Your answers suggest that you may have restless legs syndrome').should('exist');
    });

    it('should show RLS warning when movementRelieves is checked', () => {
      cy.checkCheckbox('Movement relieves the uncomfortable feelings in my legs');
      cy.contains('Your answers suggest that you may have restless legs syndrome').should('exist');
    });

    it('should hide RLS warning when only checked symptom is unchecked', () => {
      cy.checkCheckbox('I have trouble lying still while trying to fall asleep at night');
      cy.contains('Your answers suggest that you may have restless legs syndrome').should('exist');
      cy.uncheckCheckbox('I have trouble lying still while trying to fall asleep at night');
      cy.contains('Your answers suggest that you may have restless legs syndrome').should('not.exist');
    });
  });
});
