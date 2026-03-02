describe('Report & Diagnosis Verification', () => {
  beforeEach(() => {
    cy.navigateToSection('report');
  });

  describe('Report Structure', () => {
    it('should display the report section title', () => {
      cy.get('[data-slot="card-title"]').should('contain', 'Your Sleep Report');
    });

    it('should show Sleep Metrics section', () => {
      cy.contains('Sleep Metrics').should('be.visible');
    });

    it('should display sleep duration values', () => {
      cy.contains('Average Sleep Duration').should('exist');
      cy.contains('Sleep Efficiency').should('exist');
    });

    it('should show Recommendations section (not "Personalized Recommendations")', () => {
      cy.contains('Recommendations').should('exist');
      cy.get('body').then(($body) => {
        const text = $body.text();
        expect(text).to.not.match(/Personalized Recommendations/i);
      });
    });

    it('should show Download PDF button', () => {
      cy.contains('button', 'Download PDF').should('exist');
    });
  });

  describe('Diagnosis Results (with mock data)', () => {
    it('should display a findings/diagnosis section', () => {
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasFindings = text.includes('findings') ||
          text.includes('symptoms') ||
          text.includes('assessment') ||
          text.includes('results');
        expect(hasFindings).to.be.true;
      });
    });

    it('should display sleep breathing assessment for snoring + mouth breathing user', () => {
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasBreathing = text.includes('respiratory') ||
          text.includes('snoring') ||
          text.includes('breathing') ||
          text.includes('apnea') ||
          text.includes('mouth');
        expect(hasBreathing).to.be.true;
      });
    });

    it('should show chronotype or sleep timing assessment', () => {
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasChronotype = text.includes('chronotype') ||
          text.includes('night owl') ||
          text.includes('evening') ||
          text.includes('morning') ||
          text.includes('circadian');
        expect(hasChronotype).to.be.true;
      });
    });

    it('should show next steps or resources section', () => {
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasNextSteps = text.includes('next steps') ||
          text.includes('resources') ||
          text.includes('recommendations') ||
          text.includes('website');
        expect(hasNextSteps).to.be.true;
      });
    });

    it('should include SomnaHealth services information', () => {
      cy.contains('sleep education that addresses the specific problems').should('exist');
    });
  });

  describe('Updated Report Text (Round 3 Feedback)', () => {
    it('should show updated SomnaHealth Services text', () => {
      cy.contains('sleep education that addresses the specific problems').should('exist');
    });

    it('should mention evidence-based treatments', () => {
      cy.get('body').then(($body) => {
        const text = $body.text();
        const hasCBTI = text.includes('CBT-I') || text.includes('evidence based treatments');
        expect(hasCBTI).to.be.true;
      });
    });

    it('should show anxiety-related messaging when anxiety is present', () => {
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasAnxietyMsg = text.includes('anxiety') ||
          text.includes('worry') ||
          text.includes('mental health') ||
          text.includes('surrender to sleep');
        expect(hasAnxietyMsg).to.be.true;
      });
    });
  });

  describe('Sleep Metrics Calculations', () => {
    it('should show work/school night metrics', () => {
      cy.contains(/work|school|scheduled/i).should('exist');
    });

    it('should show weekend/free day metrics', () => {
      cy.contains(/weekend|free|unscheduled/i).should('exist');
    });

    it('should display sleep efficiency percentages', () => {
      cy.get('body').then(($body) => {
        const text = $body.text();
        const hasPercentage = /%/.test(text);
        expect(hasPercentage).to.be.true;
      });
    });
  });
});
