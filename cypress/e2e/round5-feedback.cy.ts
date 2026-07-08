describe('Round 5 Client Feedback Changes', () => {
  describe('Daytime form updates', () => {
    beforeEach(() => {
      cy.navigateToSection('daytime');
    });

    it('shows the insomnia anchor and hallucinations questions', () => {
      cy.contains("I've tried, but I cannot fall asleep during the day").should('be.visible');
      cy.contains(
        "I see or hear things that aren't there as I'm falling asleep or waking up"
      ).should('be.visible');
    });

    it('shows napsPerWeek when planned nap days are greater than zero', () => {
      cy.contains('About how many naps do you take in a typical week?').should('be.visible');

      cy.contains('label', /I take planned naps how many days per week/i)
        .closest('[data-slot="form-item"]')
        .find('input')
        .clear()
        .type('0');

      cy.contains('About how many naps do you take in a typical week?').should('not.exist');
    });
  });

  describe('Scheduled sleep wording', () => {
    it('asks whether lights out varies by more than 1 hour', () => {
      cy.navigateToSection('scheduled-sleep');
      cy.contains('Does your lights out time vary by more than 1 hour?').should('be.visible');
    });
  });

  describe('Restless legs section', () => {
    beforeEach(() => {
      cy.navigateToSection('restless-legs');
    });

    it('does not show the always-on RLS intro alert', () => {
      cy.contains('Restless legs syndrome is a relatively common disorder').should('not.exist');
    });

    it('shows the RLS warning only when the full triad is endorsed', () => {
      cy.checkCheckbox('I have trouble lying still while trying to fall asleep at night');
      cy.contains('Your answers suggest that you may have restless legs syndrome').should('not.exist');

      cy.checkCheckbox('I have an urge to move my legs while lying in bed at night');
      cy.contains('Your answers suggest that you may have restless legs syndrome').should('not.exist');

      cy.checkCheckbox('Movement relieves the uncomfortable feelings in my legs');
      cy.contains('Your answers suggest that you may have restless legs syndrome').should(
        'be.visible'
      );
      cy.contains('Restless legs syndrome is a relatively common disorder').should('be.visible');
    });
  });

  describe('Demographics under-25 popup', () => {
    it('shows Danny verbatim copy for ages 12 through 24', () => {
      cy.navigateToSection('demographics');

      cy.contains('What year were you born?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .should('be.visible')
        .click();
      cy.get('input[placeholder="Type a year..."]').type('2005');
      cy.contains('2005').click();

      cy.contains(
        'Between 9 and 25 years of age there is a biological tendency to stay up later and wake'
      ).should('be.visible');
      cy.contains('guidance on next steps to improve your sleep health and quality of life').should(
        'be.visible'
      );
    });
  });

  describe('Insufficient answers guard', () => {
    it('shows the insufficient-answers message when core fields are missing', () => {
      cy.visit('/');

      cy.checkCheckbox('I have read and understand the service that we provide');
      cy.contains('button', 'Continue').click();

      cy.contains('What year were you born?')
        .closest('[data-slot="form-item"]')
        .find('button[role="combobox"]')
        .should('be.visible')
        .click();
      cy.contains('1990').click();
      cy.selectOption('Sex', 'Male');
      cy.get('input[placeholder="e.g., 12345"]').type('12345');
      cy.contains('button', 'Continue').click();

      for (let step = 0; step < 12; step += 1) {
        cy.contains('button', 'Continue').click();
      }

      cy.contains('button', 'Generate Report').click();
      cy.contains(
        'You did not answer a sufficient number of questions for us to generate an accurate report'
      ).should('be.visible');
    });
  });

  describe('Report updates', () => {
    it('shows Sleep Health Recommendations with healthy-sleeper copy', () => {
      cy.visit('/review?scenario=healthy-sleeper');
      cy.contains('Sleep Health Recommendations', { timeout: 15000 }).should('be.visible');
      cy.contains('We are impressed with your general sleep health').should('be.visible');
      cy.contains('Seven Sleep Health Principles').should('be.visible');
    });

    it('shows owl/lark/crow chronotype copy in Sleep Health Recommendations', () => {
      cy.visit('/review?scenario=healthy-sleeper');
      cy.contains('Your Chronotype', { timeout: 15000 }).should('be.visible');
      cy.contains('chronotype').should('be.visible');
    });

    it('shows DSPD-primary insomnia differential copy', () => {
      cy.visit('/review?scenario=dspd-differential-dspd-primary');
      cy.contains('most likely struggling with DSPD', { timeout: 15000 }).should('be.visible');
    });

    it('shows insomnia-primary over DSPD differential copy', () => {
      cy.visit('/review?scenario=dspd-differential-insomnia-primary');
      cy.contains('more likely struggling with insomnia', { timeout: 15000 }).should('be.visible');
    });

    it('shows insufficient sleep signs without syndrome messaging', () => {
      cy.visit('/review?scenario=insufficient-sleep-signs');
      cy.contains('Signs of Insufficient Sleep', { timeout: 15000 }).should('be.visible');
    });
  });
});
