describe('Client Feedback: AM/PM Defaults & Warnings', () => {
  // ─── AM/PM Default Values ────────────────────────────────────────────────

  describe('Scheduled-sleep AM/PM defaults', () => {
    beforeEach(() => {
      cy.navigateToSection('scheduled-sleep');
    });

    it('should display PM for bedtime AM/PM combobox (mock 23:00)', () => {
      cy.contains('turn out the lights')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .last()
        .should('contain.text', 'PM');
    });

    it('should display AM for wake time AM/PM combobox (mock 07:00)', () => {
      cy.contains('What time do you wake up?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .last()
        .should('contain.text', 'AM');
    });

    it('should display AM for get-out-of-bed AM/PM combobox (mock 07:15)', () => {
      cy.contains('What time do you get out of bed?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .last()
        .should('contain.text', 'AM');
    });
  });

  describe('Unscheduled-sleep AM/PM defaults', () => {
    beforeEach(() => {
      cy.navigateToSection('unscheduled-sleep');
    });

    it('should display AM for bedtime AM/PM combobox (mock 00:30 = 12:30 AM)', () => {
      cy.contains('turn out the lights')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .last()
        .should('contain.text', 'AM');
    });

    it('should display AM for wake time AM/PM combobox (mock 09:00)', () => {
      cy.contains('What time do you wake up?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .last()
        .should('contain.text', 'AM');
    });

    it('should display AM for get-out-of-bed AM/PM combobox (mock 09:30)', () => {
      cy.contains('What time do you get out of bed?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .last()
        .should('contain.text', 'AM');
    });
  });

  describe('Chronotype work/school time AM default', () => {
    it('should display AM for work/school time AM/PM combobox (mock preference=late)', () => {
      cy.navigateToSection('chronotype');
      cy.contains('what time do you have to be at work/school?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .last()
        .should('contain.text', 'AM');
    });
  });

  // ─── AM/PM Warning Scenarios ──────────────────────────────────────────────

  describe('Scheduled-sleep wake-time PM warning', () => {
    beforeEach(() => {
      cy.navigateToSection('scheduled-sleep');
    });

    it('should show wake-time warning when AM/PM is changed to PM', () => {
      cy.contains('What time do you wake up?')
        .closest('[data-slot="form-item"]')
        .within(() => {
          cy.get('button[role="combobox"]').eq(2).click();
        });
      cy.get('[role="option"]').contains('PM').should('be.visible').click();

      // Confirm the period change registered before asserting the warning
      cy.contains('What time do you wake up?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .last()
        .should('contain.text', 'PM');

      cy.contains('Your wake time appears to be set during evening/nighttime hours').should(
        'be.visible'
      );
    });

    it('should clear wake-time warning when AM/PM is changed back to AM', () => {
      cy.contains('What time do you wake up?')
        .closest('[data-slot="form-item"]')
        .within(() => {
          cy.get('button[role="combobox"]').eq(2).click();
        });
      cy.get('[role="option"]').contains('PM').should('be.visible').click();
      cy.contains('Your wake time appears to be set during evening/nighttime hours').should(
        'be.visible'
      );

      cy.contains('What time do you wake up?')
        .closest('[data-slot="form-item"]')
        .within(() => {
          cy.get('button[role="combobox"]').eq(2).click();
        });
      cy.get('[role="option"]').contains('AM').should('be.visible').click();

      cy.contains('Your wake time appears to be set during evening/nighttime hours').should(
        'not.exist'
      );
    });
  });

  describe('Unscheduled-sleep bedtime AM warning', () => {
    beforeEach(() => {
      cy.navigateToSection('unscheduled-sleep');
    });

    // Mock lightsOutTime='00:30' = 12:30 AM. Round 4 feedback intentionally forces
    // 12-6 bedtime entries back to AM, preventing accidental 12:30 PM bedtimes.
    it('should keep 12:30 bedtime as AM when PM is selected', () => {
      cy.contains('Your bedtime appears to be set during daytime hours').should('not.exist');

      cy.contains('turn out the lights')
        .closest('[data-slot="form-item"]')
        .within(() => {
          cy.get('button[role="combobox"]').eq(2).click();
        });
      cy.get('[role="option"]').contains('PM').should('be.visible').click();

      cy.contains('turn out the lights')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .last()
        .should('contain.text', 'AM');
      cy.contains('Your bedtime appears to be set during daytime hours').should('not.exist');
    });

    it('should continue to avoid the daytime bedtime warning for 12:30 AM', () => {
      cy.contains('turn out the lights')
        .closest('[data-slot="form-item"]')
        .within(() => {
          cy.get('button[role="combobox"]').eq(2).click();
        });
      cy.get('[role="option"]').contains('PM').should('be.visible').click();

      cy.contains('Your bedtime appears to be set during daytime hours').should('not.exist');
    });
  });

  describe('Unscheduled-sleep wake-time PM warning', () => {
    beforeEach(() => {
      cy.navigateToSection('unscheduled-sleep');
    });

    it('should show wake-time warning when AM/PM changed to PM (mock 09:00 AM → 21:00)', () => {
      cy.contains('What time do you wake up?')
        .closest('[data-slot="form-item"]')
        .within(() => {
          cy.get('button[role="combobox"]').eq(2).click();
        });
      cy.get('[role="option"]').contains('PM').should('be.visible').click();

      cy.contains('Your wake time appears to be set during evening/nighttime hours').should(
        'be.visible'
      );
    });

    it('should clear wake-time warning when AM/PM changed back to AM', () => {
      cy.contains('What time do you wake up?')
        .closest('[data-slot="form-item"]')
        .within(() => {
          cy.get('button[role="combobox"]').eq(2).click();
        });
      cy.get('[role="option"]').contains('PM').should('be.visible').click();
      cy.contains('Your wake time appears to be set during evening/nighttime hours').should(
        'be.visible'
      );

      cy.contains('What time do you wake up?')
        .closest('[data-slot="form-item"]')
        .within(() => {
          cy.get('button[role="combobox"]').eq(2).click();
        });
      cy.get('[role="option"]').contains('AM').should('be.visible').click();

      cy.contains('Your wake time appears to be set during evening/nighttime hours').should(
        'not.exist'
      );
    });
  });

  // ─── Unscheduled-sleep Hour Picker ────────────────────────────────────────

  describe('Unscheduled-sleep hour picker (supplements item 5)', () => {
    it('should show all 12 hour options in the lights-out hour dropdown', () => {
      cy.navigateToSection('unscheduled-sleep');
      cy.contains('turn out the lights')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .first()
        .should('contain.text', '12')
        .click();
      const expectedHours = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
      for (const hour of expectedHours) {
        cy.contains('[role="option"]', new RegExp(`^${hour}$`)).should('exist');
      }
    });
  });
});
