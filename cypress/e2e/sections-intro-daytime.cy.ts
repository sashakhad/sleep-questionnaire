import { SECTION_TITLES } from '../support/test-data';
import { assertSectionVisible } from '../support/assertions';

describe('Intro section', () => {
  beforeEach(() => {
    cy.navigateToSection('intro');
  });

  it('should display the welcome heading', () => {
    cy.get('h1', { timeout: 10000 }).should('contain.text', 'Welcome to Your Sleep Assessment');
  });

  it('should display the disclaimer checkbox', () => {
    cy.contains('I have read and understand the service that we provide').should('exist');
  });

  it('should show disclaimer checkbox as checked with mock data', () => {
    cy.contains('I have read and understand the service that we provide')
      .closest('[data-slot="form-item"]')
      .find('button[role="checkbox"]')
      .should('have.attr', 'data-state', 'checked');
  });

  it('should display all four feature cards', () => {
    cy.contains('15-20 Minutes').should('exist');
    cy.contains('Nighttime & Daytime').should('exist');
    cy.contains('Free & Anonymous Report').should('exist');
    cy.contains('Expert Guidance').should('exist');
  });

  it('should display privacy and before-you-begin alerts', () => {
    cy.contains('Your Privacy is Protected').should('exist');
    cy.contains('Before You Begin').should('exist');
  });
});

describe('Demographics section', () => {
  beforeEach(() => {
    cy.navigateToSection('demographics');
  });

  it('should display the section title', () => {
    assertSectionVisible(SECTION_TITLES['demographics']);
  });

  it('should display year of birth field', () => {
    cy.contains('What year were you born?').should('exist');
  });

  it('should display sex selector', () => {
    cy.contains('label', 'Sex').should('exist');
  });

  it('should display weight and height fields', () => {
    cy.contains('Weight (lbs)').should('exist');
    cy.contains('Height').should('exist');
  });

  it('should display zipcode field', () => {
    cy.contains('Zipcode').should('exist');
  });

  it('should display BMI section with mock data', () => {
    cy.contains('Body Mass Index (BMI)', { timeout: 10000 }).should('be.visible');
    cy.contains('23.7').should('be.visible');
  });

  it('should not show age-related alert for mock data birth year', () => {
    cy.contains('Age-Related Sleep Changes').should('not.exist');
  });
});

describe('Sleep Disorder Diagnoses section', () => {
  beforeEach(() => {
    cy.navigateToSection('sleep-disorder-diagnoses');
  });

  it('should display the section title', () => {
    assertSectionVisible(SECTION_TITLES['sleep-disorder-diagnoses']);
  });

  it('should display all 11 disorder checkboxes', () => {
    cy.contains('Narcolepsy').should('exist');
    cy.contains('Hypersomnia').should('exist');
    cy.contains('Insomnia').should('exist');
    cy.contains('Parasomnia (sleepwalking or sleep terrors)').should('exist');
    cy.contains('Nocturnal enuresis').should('exist');
    cy.contains('Circadian Rhythm Disorder').should('exist');
    cy.contains('Restless Legs Syndrome').should('exist');
    cy.contains('Obstructive Sleep Apnea Syndrome').should('exist');
    cy.contains('Central Sleep Apnea Syndrome').should('exist');
    cy.contains('Insufficient Sleep').should('exist');
    cy.contains('REM Behavior Disorder').should('exist');
  });

  it('should display other diagnosis text input', () => {
    cy.contains('Other diagnosis (please describe)').should('exist');
    cy.get('input[placeholder="Enter any other diagnoses..."]').should('exist');
  });

  it('should have no disorders checked with mock data', () => {
    cy.get('button[role="checkbox"][data-state="checked"]').should('not.exist');
  });
});

describe('Daytime section', () => {
  beforeEach(() => {
    cy.navigateToSection('daytime');
  });

  it('should display the section title', () => {
    assertSectionVisible(SECTION_TITLES['daytime']);
  });

  it('should display planned naps fields', () => {
    cy.contains('Planned Naps').should('exist');
    cy.contains('I take planned naps how many days per week?').should('exist');
    cy.contains('How long are my naps typically?').should('exist');
  });

  it('should display fall asleep during activities checklist', () => {
    cy.contains('During a typical week do you fall asleep').should('exist');
    cy.contains('Stopped at a stop light').should('exist');
    cy.contains('During lectures or work meetings').should('exist');
    cy.contains('While working or studying').should('exist');
    cy.contains('During a conversation').should('exist');
    cy.contains('While engaged in a quiet activity during the evening').should('exist');
    cy.contains('While eating a meal').should('exist');
  });

  it('should show sleepiness interference checkbox as checked', () => {
    cy.contains('My sleepiness interferes with my daily activities')
      .closest('[data-slot="form-item"]')
      .find('button[role="checkbox"]')
      .should('have.attr', 'data-state', 'checked');
  });

  it('should display sleepiness severity slider when interference is checked', () => {
    cy.contains('How severe is the interference?').should('be.visible');
  });

  it('should display tired but cannot fall asleep radio group', () => {
    cy.contains('I feel tired but cannot fall asleep').should('be.visible');
  });

  it('should display sleep quality section', () => {
    cy.contains('Sleep Quality').should('exist');
    cy.contains("My sleep does not feel restorative").should('exist');
    cy.contains('Pain affects my ability').should('exist');
  });

  it('should display tiredness and fatigue rating sliders', () => {
    cy.contains('Rate Your Daytime Experience').should('exist');
    cy.contains('I rate my tiredness').should('exist');
    cy.contains('I rate my fatigue').should('exist');
  });
});
