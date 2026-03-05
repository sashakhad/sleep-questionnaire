describe('Client Feedback: Updated Report & Alert Text', () => {
  // ─── Mental Health Page: Updated Inline Alerts ───────────────────────────
  // Mock data: worriesAffectSleep=true, anxietyInBed=true, timeInBedTrying=true,
  // cancelsAfterPoorSleep='1-2week' → all 4 alerts trigger.

  describe('Mental health page updated inline alert text', () => {
    beforeEach(() => {
      cy.navigateToSection('mental-health');
    });

    it('should show Sleep-Related Anxiety Detected with exact updated body text', () => {
      cy.contains('Sleep-Related Anxiety Detected')
        .closest('[role="alert"]')
        .should(
          'contain.text',
          'anxiety and worry are interfering with your ability to surrender to sleep at night'
        );
    });

    it('should show Significant Sleep Impact with exact updated body text', () => {
      cy.contains('Significant Sleep Impact on Daily Life')
        .closest('[role="alert"]')
        .should(
          'contain.text',
          'your sleep difficulties are significantly impacting your daily functioning'
        )
        .and(
          'contain.text',
          'personalized sleep report we will provide you with a probable diagnosis'
        );
    });

    it('should show Sleep Effort Paradox with exact updated body text', () => {
      cy.contains('Sleep Effort Paradox')
        .closest('[role="alert"]')
        .should('contain.text', 'Sleep is a passive process that cannot be forced')
        .and(
          'contain.text',
          'We will provide you with some free tips to fall asleep with ease'
        );
    });

    it('should show Mental Health Resources with specific wording added in feedback item 11', () => {
      cy.contains('Mental Health Resources')
        .closest('[role="alert"]')
        .should(
          'contain.text',
          'We will provide link to more information in your personalized report'
        );
    });
  });

  // ─── Bedroom Page: Room for Improvement Alert ────────────────────────────
  // Mock: relaxing=7, comfortable=8, dark=6, quiet=7 → avg=7.0 (≥6 → no alert)

  describe('Bedroom page Room for Improvement alert', () => {
    it('should NOT show Room for Improvement with mock data (avg 7.0 ≥ 6)', () => {
      cy.navigateToSection('bedroom');
      cy.contains('Room for Improvement').should('not.exist');
    });

    it('should show Room for Improvement with exact updated text after lowering relaxing slider', () => {
      cy.navigateToSection('bedroom');

      // Lower "relaxing" slider from 7 to 1 (6 left-arrows) → avg = (1+8+6+7)/4 = 5.5 < 6
      // Must pass bubbles:true so the event propagates to React's root event listener
      cy.contains('How relaxing and comfortable is your bedroom')
        .closest('[data-slot="form-item"]')
        .find('[role="slider"]')
        .focus()
        .trigger('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true })
        .trigger('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true })
        .trigger('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true })
        .trigger('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true })
        .trigger('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true })
        .trigger('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true });

      cy.contains('Room for Improvement')
        .closest('[role="alert"]')
        .should(
          'contain.text',
          'We provide several recommendations to improve your sleep by improving the comfort of your bedroom'
        );
    });
  });

  // ─── Report Page: Text with Default Mock Data ────────────────────────────

  describe('Report page text with mock data', () => {
    beforeEach(() => {
      cy.navigateToSection('report');
    });

    it('should show SomnaHealth Services text with specific wording from feedback item 11', () => {
      cy.contains(
        'sleep coaches and board certified sleep doctor who can support you with evidence based treatments including CBT-I'
      ).should('exist');
    });

    it('should have a Resources card heading', () => {
      cy.get('[data-slot="card-title"]').contains('Resources').should('be.visible');
    });

    it('should show "Recommendations" card title (not "Personalized Recommendations")', () => {
      cy.get('[data-slot="card-title"]').contains('Recommendations').should('be.visible');
      cy.get('[data-slot="card-title"]')
        .contains(/Personalized Recommendations/i)
        .should('not.exist');
    });
  });

  // ─── Report: Mental Health Support Available with Trauma Data ────────────
  // Must navigate forward from nightmares (with trauma checked) to preserve form state.

  describe('Mental Health Support Available next steps (trauma-enabled flow)', () => {
    it('should check trauma checkbox on nightmares section', () => {
      cy.navigateToSection('nightmares');

      // Mock has hasNightmares=true + nightmaresPerWeek=1, so associatedWithTrauma checkbox is visible
      cy.contains('associated with exposure to trauma')
        .closest('[data-slot="form-item"]')
        .find('button[role="checkbox"]')
        .click({ force: true });

      // Verify checkbox is now checked
      cy.contains('associated with exposure to trauma')
        .closest('[data-slot="form-item"]')
        .find('button[role="checkbox"]')
        .should('have.attr', 'data-state', 'checked');
    });

    it('should reach report page after navigating forward from nightmares with trauma checked', () => {
      cy.navigateToSection('nightmares');

      cy.contains('associated with exposure to trauma')
        .closest('[data-slot="form-item"]')
        .find('button[role="checkbox"]')
        .click({ force: true });

      // Navigate forward: nightmares → chronotype → sleep-hygiene → bedroom → lifestyle
      //                   → mental-health → report (6 button clicks)
      for (let i = 0; i < 5; i++) {
        cy.contains('button', 'Continue').click();
        cy.get('[data-slot="card-title"]', { timeout: 10000 }).should('be.visible');
      }
      // mental-health → report uses "Generate Report"
      cy.contains('button', 'Generate Report').click();
      cy.get('[data-slot="card-title"]', { timeout: 10000 }).should('be.visible');

      // Confirm we landed on the report
      cy.contains('Your Sleep Health Report').should('be.visible');
    });

    it('should show Mental Health Support Available with exact updated text on report page', () => {
      cy.navigateToSection('nightmares');

      cy.contains('associated with exposure to trauma')
        .closest('[data-slot="form-item"]')
        .find('button[role="checkbox"]')
        .click({ force: true });

      for (let i = 0; i < 5; i++) {
        cy.contains('button', 'Continue').click();
        cy.get('[data-slot="card-title"]', { timeout: 10000 }).should('be.visible');
      }
      cy.contains('button', 'Generate Report').click();
      cy.get('[data-slot="card-title"]', { timeout: 10000 }).should('be.visible');

      cy.contains('Mental Health Support Available')
        .closest('[role="alert"]')
        .should('contain.text', 'nightmares may be related to trauma')
        .and('contain.text', 'Trauma-related nightmares improve with specialized therapy');
    });
  });
});
