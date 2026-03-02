import {
  SECTION_TITLES,
  TOTAL_SECTIONS,
  SECTIONS,
} from '../support/test-data';
import {
  assertSectionVisible,
  assertProgressBar,
  assertStepIndicator,
  assertFormExists,
} from '../support/assertions';

describe('Questionnaire Navigation', () => {
  describe('Continue and Previous buttons', () => {
    it('should show Continue button on the first section', () => {
      cy.navigateToSection('intro');
      assertFormExists();
      cy.contains('button', 'Continue').should('exist').and('be.visible');
    });

    it('should not show Previous button on the first section', () => {
      cy.navigateToSection('intro');
      cy.contains('button', 'Previous').should('have.class', 'invisible');
    });

    it('should navigate to next section when Continue is clicked', () => {
      cy.navigateToSection('intro');
      cy.contains('button', 'Continue').click();
      assertSectionVisible(SECTION_TITLES['demographics']);
    });

    it('should navigate back when Previous is clicked', () => {
      cy.navigateToSection('demographics');
      cy.contains('button', 'Previous').first().click();
      assertSectionVisible(SECTION_TITLES['intro']);
    });

    it('should show Generate Report button on second-to-last section', () => {
      cy.navigateToSection('mental-health');
      cy.contains('button', 'Generate Report').should('exist').and('be.visible');
      cy.contains('button', 'Continue').should('not.exist');
    });

    it('should not show Continue on the report section but Previous should be visible', () => {
      cy.navigateToSection('report');
      cy.contains('button', 'Continue').should('not.exist');
      cy.contains('button', 'Previous').should('be.visible');
    });
  });

  describe('Progress bar', () => {
    it('should show 0% progress on intro', () => {
      cy.navigateToSection('intro');
      assertProgressBar(0);
    });

    it('should update progress when navigating to daytime section', () => {
      // daytime is index 3 — progress = (3/15)*100 = 20 (exact)
      cy.navigateToSection('daytime');
      assertProgressBar(20);
    });

    it('should show 100% on report section', () => {
      cy.navigateToSection('report');
      assertProgressBar(100);
    });

    it('should show correct step indicator', () => {
      // daytime is index 3 — Step 4 of 16
      cy.navigateToSection('daytime');
      assertStepIndicator(4, TOTAL_SECTIONS);
    });
  });

  describe('Dev sidebar navigation', () => {
    it('should display all 16 sections in the sidebar', () => {
      cy.visit('/dev');
      cy.get('nav').find('button').should('have.length', SECTIONS.length);
    });

    it('should highlight the active section in the sidebar', () => {
      cy.visit('/dev?section=daytime');
      cy.get('nav')
        .contains('button', SECTION_TITLES['daytime'])
        .should('have.class', 'bg-primary/10');
    });

    it('should navigate to a section when sidebar item is clicked', () => {
      cy.visit('/dev');
      cy.get('nav').contains('button', SECTION_TITLES['parasomnia']).click();
      cy.url().should('include', 'section=parasomnia');
      cy.get('[data-slot="card-title"]', { timeout: 10000 }).should(
        'contain.text',
        SECTION_TITLES['parasomnia']
      );
    });

    it('should update the form content when jumping between sections', () => {
      cy.visit('/dev?section=demographics');
      cy.get('[data-slot="card-title"]').should('contain.text', SECTION_TITLES['demographics']);
      cy.get('nav').contains('button', SECTION_TITLES['breathing-disorders']).click();
      cy.url().should('include', 'section=breathing-disorders');
      cy.get('[data-slot="card-title"]', { timeout: 10000 }).should(
        'contain.text',
        SECTION_TITLES['breathing-disorders']
      );
    });
  });
});
