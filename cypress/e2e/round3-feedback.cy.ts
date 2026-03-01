describe('Round 3 Client Feedback Changes', () => {
  // 1. Birth year cap
  describe('Birth year cap (demographics)', () => {
    beforeEach(() => {
      cy.navigateToSection('demographics');
    });

    it('should not show years after currentYear - 12 in the birth year selector', () => {
      const maxYear = new Date().getFullYear() - 12;
      const tooRecent = maxYear + 1;
      cy.contains('button', '1990').click();
      cy.get('[data-radix-popper-content-wrapper]', { timeout: 5000 }).should('be.visible');
      cy.get('[data-radix-popper-content-wrapper]').should('contain', maxYear.toString());
      cy.get('[data-radix-popper-content-wrapper]').should('not.contain', tooRecent.toString());
    });
  });

  // 2. OSA/RLS redundant questions removed
  describe('OSA/RLS questions removed (sleep-disorder-diagnoses)', () => {
    beforeEach(() => {
      cy.navigateToSection('sleep-disorder-diagnoses');
    });

    it('should not have a standalone "Have you been diagnosed with obstructive sleep apnea?" Yes/No question', () => {
      cy.contains('Have you been diagnosed with obstructive sleep apnea?').should('not.exist');
    });

    it('should not have a standalone "Have you been diagnosed with restless legs syndrome" Yes/No question', () => {
      cy.contains(
        'Have you been diagnosed with restless legs syndrome (RLS) or periodic limb movement disorder?'
      ).should('not.exist');
    });

    it('should not show any treatment follow-up sections', () => {
      cy.contains('Sleep Apnea Treatment Details').should('not.exist');
      cy.contains('Restless Legs Syndrome Treatment Details').should('not.exist');
    });
  });

  // 3. Second planned nap question removed
  describe('Second nap question removed (daytime)', () => {
    beforeEach(() => {
      cy.navigateToSection('daytime');
    });

    it('should not show "I take how many planned naps per week total?" question', () => {
      cy.contains('I take how many planned naps per week total?').should('not.exist');
    });

    it('should still show "I take planned naps how many days per week?"', () => {
      cy.contains('I take planned naps how many days per week?').should('be.visible');
    });
  });

  // 4. 0-minute option exists
  describe('0-minute option (scheduled-sleep)', () => {
    beforeEach(() => {
      cy.navigateToSection('scheduled-sleep');
    });

    it('should include a 0 minutes option in the time-to-fall-asleep select', () => {
      cy.contains('how long does it take you to fall asleep')
        .parent()
        .find('button[role="combobox"]')
        .click();
      cy.get('[role="option"]').contains('0 minutes').should('exist');
    });
  });

  describe('0-minute option (unscheduled-sleep)', () => {
    beforeEach(() => {
      cy.navigateToSection('unscheduled-sleep');
    });

    it('should include a 0 minutes option in the time-to-fall-asleep select', () => {
      cy.contains('how long does it take you to fall asleep')
        .parent()
        .find('button[role="combobox"]')
        .click();
      cy.get('[role="option"]').contains('0 minutes').should('exist');
    });
  });

  // 5. Time picker scrolling - all 12 hours accessible
  describe('Time picker hour scroll (scheduled-sleep)', () => {
    beforeEach(() => {
      cy.navigateToSection('scheduled-sleep');
    });

    it('should show all 12 hour options in the hour dropdown', () => {
      cy.get('button[role="combobox"]').first().click();
      const expectedHours = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
      for (const hour of expectedHours) {
        cy.get('[role="option"]')
          .contains(new RegExp(`^${hour}$`))
          .should('exist');
      }
    });
  });

  // 6. Narcolepsy checkbox removed
  describe('Narcolepsy checkbox removed (daytime)', () => {
    beforeEach(() => {
      cy.navigateToSection('daytime');
    });

    it('should not show "I have been diagnosed with narcolepsy or hypersomnia" checkbox', () => {
      cy.contains('I have been diagnosed with narcolepsy or hypersomnia').should('not.exist');
    });
  });

  // 7. AM/PM defaults
  describe('AM/PM defaults (scheduled-sleep)', () => {
    beforeEach(() => {
      cy.navigateToSection('scheduled-sleep');
    });

    it('should show PM placeholder for bedtime field', () => {
      cy.contains('turn out the lights')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .last()
        .invoke('text')
        .should('match', /PM/);
    });

    it('should show AM placeholder for wake time field', () => {
      cy.contains('What time do you wake up?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .last()
        .invoke('text')
        .should('match', /AM/);
    });
  });

  // 8. Conditional work/school time
  describe('Conditional work/school time (chronotype)', () => {
    beforeEach(() => {
      cy.navigateToSection('chronotype');
    });

    it('should hide work/school time when "flexible" preference is selected', () => {
      cy.get('button[role="radio"][value="flexible"]').click({ force: true });
      cy.get('button[role="radio"][value="flexible"]').should('have.attr', 'data-state', 'checked');
      cy.contains('what time do you have to be at work/school?').should('not.exist');
    });

    it('should show work/school time when "early" preference is selected', () => {
      cy.contains('Go to bed early and wake up early').click();
      cy.contains('what time do you have to be at work/school?').should('be.visible');
    });

    it('should show work/school time when "late" preference is selected', () => {
      cy.contains('Go to bed late and wake up late').click();
      cy.contains('what time do you have to be at work/school?').should('be.visible');
    });
  });

  // 9. Parasomnia diagnosis removed
  describe('Parasomnia diagnosis removed (parasomnia)', () => {
    beforeEach(() => {
      cy.navigateToSection('parasomnia');
    });

    it('should not show "I have been diagnosed with a parasomnia" checkbox', () => {
      cy.contains('I have been diagnosed with a parasomnia').should('not.exist');
    });
  });

  // 10. Nightmare Contributing Factors removed
  describe('Nightmare Contributing Factors removed (nightmares)', () => {
    beforeEach(() => {
      cy.navigateToSection('nightmares');
    });

    it('should not show the Contributing Factors section', () => {
      cy.contains('Contributing Factors').should('not.exist');
    });

    it('should not show TBI, medications, behavioral health, or sleep aversion checkboxes', () => {
      cy.contains('I have a history of traumatic brain injury').should('not.exist');
      cy.contains('I take medications that may cause nightmares').should('not.exist');
      cy.contains('I have been diagnosed with a behavioral health').should('not.exist');
      cy.contains('I avoid going to sleep because I am afraid').should('not.exist');
    });

    it('should still show the nightmare frequency question (mock data has nightmares enabled)', () => {
      cy.contains('How many nights a week do you have nightmares?').should('be.visible');
    });
  });

  // 11. Report text updates
  describe('Report text updates (report)', () => {
    beforeEach(() => {
      cy.navigateToSection('report');
    });

    it('should show "Recommendations" not "Personalized Recommendations" in the header', () => {
      cy.contains('Recommendations').should('exist');
      cy.contains('Personalized Recommendations').should('not.exist');
    });

    it('should show updated SomnaHealth Services text with "sleep education"', () => {
      cy.contains('sleep education that addresses the specific problems').should('exist');
    });

    it('should not say "Personalized Recommendations" in any heading', () => {
      cy.get('h2, h3, span').each($el => {
        cy.wrap($el)
          .invoke('text')
          .should('not.match', /personalized recommendations/i);
      });
    });
  });

  // 12. AM/PM logical zone warnings
  describe('AM/PM logical zone warnings (scheduled-sleep)', () => {
    beforeEach(() => {
      cy.navigateToSection('scheduled-sleep');
    });

    it('should show warning when bedtime is set to AM (daytime hours)', () => {
      cy.contains('turn out the lights')
        .closest('[data-slot="form-item"]')
        .within(() => {
          cy.get('button[role="combobox"]').eq(0).click();
        });
      cy.get('[role="option"]').contains('10').click({ force: true });

      cy.contains('turn out the lights')
        .closest('[data-slot="form-item"]')
        .within(() => {
          cy.get('button[role="combobox"]').eq(2).click();
        });
      cy.get('[role="option"]').contains('AM').click({ force: true });

      cy.contains('Your bedtime appears to be set during daytime hours').should('be.visible');
    });

    it('should not show warning when bedtime is PM (fresh page)', () => {
      cy.navigateToSection('scheduled-sleep');
      cy.contains('Your bedtime appears to be set during daytime hours').should('not.exist');
    });
  });
});
