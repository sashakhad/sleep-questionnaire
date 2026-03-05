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
      cy.get('[role="option"]').contains('PM').click({ force: true });

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
      cy.get('[role="option"]').contains('PM').click({ force: true });
      cy.contains('Your wake time appears to be set during evening/nighttime hours').should(
        'be.visible'
      );

      cy.contains('What time do you wake up?')
        .closest('[data-slot="form-item"]')
        .within(() => {
          cy.get('button[role="combobox"]').eq(2).click();
        });
      cy.get('[role="option"]').contains('AM').click({ force: true });

      cy.contains('Your wake time appears to be set during evening/nighttime hours').should(
        'not.exist'
      );
    });
  });

  describe('Unscheduled-sleep bedtime AM warning', () => {
    beforeEach(() => {
      cy.navigateToSection('unscheduled-sleep');
    });

    // Mock lightsOutTime='00:30' = 12:30 AM (hour24=0 — NOT in unusual range [4,18))
    // Switching AM/PM to PM → 12:30 PM (hour24=12 — IS in [4,18)) → warning triggers
    it('should show bedtime warning when AM/PM changed to PM (12:30 PM is noon, unusual bedtime)', () => {
      cy.contains('Your bedtime appears to be set during daytime hours').should('not.exist');

      cy.contains('turn out the lights')
        .closest('[data-slot="form-item"]')
        .within(() => {
          cy.get('button[role="combobox"]').eq(2).click();
        });
      cy.get('[role="option"]').contains('PM').click({ force: true });

      cy.contains('Your bedtime appears to be set during daytime hours').should('be.visible');
    });

    it('should clear bedtime warning when AM/PM changed back to AM (00:30 → hour 0 is safe)', () => {
      // Trigger warning first (AM/PM → PM makes it 12:30 PM)
      cy.contains('turn out the lights')
        .closest('[data-slot="form-item"]')
        .within(() => {
          cy.get('button[role="combobox"]').eq(2).click();
        });
      cy.get('[role="option"]').contains('PM').click({ force: true });
      cy.contains('Your bedtime appears to be set during daytime hours').should('be.visible');

      // Change back to AM (12:30 AM = 00:30 → hour 0 not in [4,18) → no warning)
      cy.contains('turn out the lights')
        .closest('[data-slot="form-item"]')
        .within(() => {
          cy.get('button[role="combobox"]').eq(2).click();
        });
      cy.get('[role="option"]').contains('AM').click({ force: true });

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
      cy.get('[role="option"]').contains('PM').click({ force: true });

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
      cy.get('[role="option"]').contains('PM').click({ force: true });
      cy.contains('Your wake time appears to be set during evening/nighttime hours').should(
        'be.visible'
      );

      cy.contains('What time do you wake up?')
        .closest('[data-slot="form-item"]')
        .within(() => {
          cy.get('button[role="combobox"]').eq(2).click();
        });
      cy.get('[role="option"]').contains('AM').click({ force: true });

      cy.contains('Your wake time appears to be set during evening/nighttime hours').should(
        'not.exist'
      );
    });
  });

  // ─── Unscheduled-sleep Hour Picker ────────────────────────────────────────

  describe('Unscheduled-sleep hour picker (supplements item 5)', () => {
    it('should show all 12 hour options in the lights-out hour dropdown', () => {
      cy.navigateToSection('unscheduled-sleep');
      cy.get('button[role="combobox"]').first().click();
      const expectedHours = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
      for (const hour of expectedHours) {
        cy.get('[role="option"]')
          .contains(new RegExp(`^${hour}$`))
          .should('exist');
      }
    });
  });
});
