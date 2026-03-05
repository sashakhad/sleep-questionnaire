import { SECTION_TITLES } from '../support/test-data';
import { assertSectionVisible } from '../support/assertions';

describe('Scheduled Sleep section', () => {
  beforeEach(() => {
    cy.navigateToSection('scheduled-sleep');
  });

  it('should display the section title', () => {
    assertSectionVisible(SECTION_TITLES['scheduled-sleep']);
  });

  it('should display lights out time field', () => {
    cy.contains('What time do you turn out the lights and try to fall asleep?').should('exist');
  });

  it('should display lights out varies radio', () => {
    cy.contains('Does your lights out time vary more than 2 hours?').should('exist');
  });

  it('should display time to fall asleep selector', () => {
    cy.contains('After you turn out the lights, about how long does it take you to fall asleep?').should('exist');
  });

  it('should display night wakeups field', () => {
    cy.contains('About how many times do you wake up during the night').should('exist');
  });

  it('should not display wakeup reasons with mock data', () => {
    cy.contains('What wakes you?').should('not.exist');
  });

  it('should display minutes awake at night selector', () => {
    cy.contains('About how many minutes total are you awake during the night?').should('exist');
  });

  it('should display wake up and get out of bed time fields', () => {
    cy.contains('What time do you wake up?').should('exist');
    cy.contains('What time do you get out of bed?').should('exist');
  });

  it('should display early wakeup days and alarm clock fields', () => {
    cy.contains('How many days a week do you wake up earlier than planned?').should('exist');
    cy.contains('I use an alarm clock to wake up in the morning').should('exist');
  });

  it('should not show AM/PM warning for valid bedtime', () => {
    cy.contains('Your bedtime appears to be set during daytime hours').should('not.exist');
  });
});

describe('Unscheduled Sleep section', () => {
  beforeEach(() => {
    cy.navigateToSection('unscheduled-sleep');
  });

  it('should display the section title', () => {
    assertSectionVisible(SECTION_TITLES['unscheduled-sleep']);
  });

  it('should display the natural sleep patterns info box', () => {
    cy.contains('This section helps us understand your natural sleep patterns').should('exist');
  });

  it('should display all expected form fields', () => {
    cy.contains('What time do you turn out the lights and try to fall asleep?').should('exist');
    cy.contains('After you turn out the lights, about how long does it take you to fall asleep?').should('exist');
    cy.contains('About how many times do you wake up during the night').should('exist');
    cy.contains('About how many minutes total are you awake during the night?').should('exist');
    cy.contains('What time do you wake up?').should('exist');
    cy.contains('What time do you get out of bed?').should('exist');
    cy.contains('I use an alarm clock to wake up in the morning').should('exist');
  });

  it('should not display wakeup reasons with mock data', () => {
    cy.contains('What wakes you?').should('not.exist');
  });
});

describe('Breathing Disorders section', () => {
  beforeEach(() => {
    cy.navigateToSection('breathing-disorders');
  });

  it('should display the section title', () => {
    assertSectionVisible(SECTION_TITLES['breathing-disorders']);
  });

  it('should display all breathing symptom checkboxes', () => {
    cy.contains('I have been told that I snore').should('exist');
    cy.contains('I have been told that I stop breathing, snort or gasp for air during sleep').should('exist');
    cy.contains('I mouth breathe').should('exist');
  });

  it('should show snoring as checked with mock data', () => {
    cy.contains('I have been told that I snore')
      .closest('[data-slot="form-item"]')
      .find('button[role="checkbox"]')
      .should('have.attr', 'data-state', 'checked');
  });

  it('should show dry mouth checkbox when mouth breathing is checked', () => {
    cy.contains('I frequently wake up with a dry mouth').should('be.visible');
    cy.contains('I frequently wake up with a dry mouth')
      .closest('[data-slot="form-item"]')
      .find('button[role="checkbox"]')
      .should('have.attr', 'data-state', 'checked');
  });

  it('should display breathing disorder warning when snoring is checked', () => {
    cy.contains('provide important information in the report').should('exist');
  });
});

describe('Restless Legs section', () => {
  beforeEach(() => {
    cy.navigateToSection('restless-legs');
  });

  it('should display the section title', () => {
    assertSectionVisible(SECTION_TITLES['restless-legs']);
  });

  it('should display RLS info alert', () => {
    cy.contains('Restless legs syndrome is a relatively common disorder').should('exist');
  });

  it('should display all RLS symptom checkboxes', () => {
    cy.contains('I have trouble lying still while trying to fall asleep').should('exist');
    cy.contains('I have an urge to move my legs while lying in bed').should('exist');
    cy.contains('Movement relieves the uncomfortable feelings in my legs').should('exist');
    cy.contains('I have leg discomfort during the day').should('exist');
    cy.contains('I experience leg cramps at night').should('exist');
  });

  it('should not show RLS warning with mock data', () => {
    cy.contains('Your answers suggest that you may have restless legs syndrome').should('not.exist');
  });

  it('should not show leg cramp frequency field', () => {
    cy.contains('How many nights per week do you experience leg cramps?').should('not.exist');
  });
});

describe('Parasomnia section', () => {
  beforeEach(() => {
    cy.navigateToSection('parasomnia');
  });

  it('should display the section title', () => {
    assertSectionVisible(SECTION_TITLES['parasomnia']);
  });

  it('should display parasomnia info alert', () => {
    cy.contains('unusual behaviors during sleep').should('exist');
  });

  it('should display night behavior checkboxes', () => {
    cy.contains('Walk').should('exist');
    cy.contains('Eating').should('exist');
    cy.contains('Appear confused').should('exist');
    cy.contains('Are very upset and cannot be calmed').should('exist');
  });

  it('should not show follow-up questions with mock data', () => {
    cy.contains('I have a clear memory of these events').should('not.exist');
    cy.contains('I act out my dreams').should('not.exist');
    cy.contains('I have injured myself or others').should('not.exist');
  });

  it('should display bedwetting checkbox', () => {
    cy.contains('I wet the bed more than 1 night per month').should('exist');
  });
});
