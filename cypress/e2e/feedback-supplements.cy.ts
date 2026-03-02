describe('Client Feedback: Supplemental Verification', () => {
  // ─── 0-minute First Position (item 4) ────────────────────────────────────

  describe('0-minute option is first in fall-asleep dropdown', () => {
    it('should have "0 minutes" as the first option on scheduled-sleep (not just present)', () => {
      cy.navigateToSection('scheduled-sleep');
      cy.contains('how long does it take you to fall asleep')
        .parent()
        .find('button[role="combobox"]')
        .click();
      cy.get('[role="option"]').first().should('contain.text', '0 minutes');
    });

    it('should have "0 minutes" as the first option on unscheduled-sleep (not just present)', () => {
      cy.navigateToSection('unscheduled-sleep');
      cy.contains('how long does it take you to fall asleep')
        .parent()
        .find('button[role="combobox"]')
        .click();
      cy.get('[role="option"]').first().should('contain.text', '0 minutes');
    });
  });

  // ─── Birth Year Lower Bound (item 1) ─────────────────────────────────────

  describe('Birth year lower bound (demographics)', () => {
    it('should include 1920 but not 1919 in the birth year picker', () => {
      cy.navigateToSection('demographics');

      // Open the year combobox (mock year is 1990)
      cy.contains('button', '1990').click();
      cy.get('[data-radix-popper-content-wrapper]', { timeout: 5000 }).should('be.visible');

      // Search for the oldest allowed year (1920) — should exist
      cy.get('input[placeholder="Type a year..."]').type('1920');
      cy.contains('1920').should('exist');

      // Clear and search for 1919 — below minYear, should show "No year found."
      cy.get('input[placeholder="Type a year..."]').clear().type('1919');
      cy.contains('No year found.').should('exist');
    });
  });

  // ─── Work/School Time AM Default (item 8) ────────────────────────────────

  describe('Work/school time AM/PM default (chronotype)', () => {
    it('should show AM in the work/school time AM/PM combobox when preference is late', () => {
      cy.navigateToSection('chronotype');
      // Mock data has preference='late' so the work/school time field is visible
      cy.contains('what time do you have to be at work/school?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .last()
        .should('contain.text', 'AM');
    });
  });

  // ─── Narcolepsy Removal: Related Questions Still Intact (item 6) ─────────

  describe('Structural integrity after narcolepsy removal (daytime)', () => {
    beforeEach(() => {
      cy.navigateToSection('daytime');
    });

    it('should not show narcolepsy checkbox but should show cataplexy/weakness questions', () => {
      cy.contains('I have been diagnosed with narcolepsy or hypersomnia').should('not.exist');
      // Mock has fallAsleepDuring=['lectures','evening'] and sleepinessInterferes=true
      // → showNarcolepsyQuestions=true → "When I laugh or feel excited:" section is visible
      cy.contains('When I laugh or feel excited').should('be.visible');
    });

    it('should still show planned naps days-per-week but not the removed total-naps question', () => {
      cy.contains('I take planned naps how many days per week?').should('be.visible');
      cy.contains('I take how many planned naps per week total?').should('not.exist');
    });
  });

  // ─── Parasomnia Diagnosis Removal: Behaviors Still Intact (item 9) ───────

  describe('Structural integrity after parasomnia diagnosis removal (parasomnia)', () => {
    beforeEach(() => {
      cy.navigateToSection('parasomnia');
    });

    it('should not show diagnosed-parasomnia checkbox but should show night behavior checkboxes', () => {
      cy.contains('I have been diagnosed with a parasomnia').should('not.exist');
      // Night behaviors: Walk, Eating, Appear confused, Are very upset
      cy.contains('Walk').should('exist');
      cy.contains('Eating').should('exist');
    });

    it('should still show the bedwetting checkbox', () => {
      cy.contains('wet the bed').should('be.visible');
    });
  });

  // ─── Nightmare Factors Removal: Only Frequency + Trauma Remain (item 10) ─

  describe('Structural integrity after nightmare contributing factors removal (nightmares)', () => {
    beforeEach(() => {
      cy.navigateToSection('nightmares');
    });

    it('should not show Contributing Factors but should show frequency and trauma questions', () => {
      cy.contains('Contributing Factors').should('not.exist');
      // Mock has hasNightmares=true + nightmaresPerWeek=1 → frequency question visible
      cy.contains('How many nights a week do you have nightmares?').should('be.visible');
      // Trauma checkbox should still exist
      cy.contains('associated with exposure to trauma').should('exist');
    });

    it('should not show any orphaned contributing-factor checkboxes', () => {
      cy.contains('history of traumatic brain injury').should('not.exist');
      cy.contains('medications that may cause nightmares').should('not.exist');
      cy.contains('behavioral health').should('not.exist');
      cy.contains('I avoid going to sleep because I am afraid').should('not.exist');
    });
  });
});
