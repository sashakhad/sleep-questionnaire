import { SECTION_TITLES } from '../support/test-data';
import { assertSectionVisible } from '../support/assertions';

describe('Nightmares section', () => {
  beforeEach(() => {
    cy.navigateToSection('nightmares');
  });

  it('should display the section title', () => {
    assertSectionVisible(SECTION_TITLES['nightmares']);
  });

  it('should display dream recall checkbox as checked', () => {
    cy.contains('label', 'I remember my dreams at least a few nights a week')
      .siblings('button[role="checkbox"]')
      .should('have.attr', 'data-state', 'checked');
  });

  it('should show dream recall info alert when remembersDreams is checked', () => {
    cy.contains('Remembering your dreams can be a function of many factors').should('exist');
  });

  it('should display dreams vs nightmares definitions', () => {
    cy.contains('Understanding Dreams vs Nightmares').should('exist');
    cy.contains('Bad dreams').should('exist');
    cy.contains('Nightmares').should('exist');
  });

  it('should display nightmare frequency and trauma fields', () => {
    cy.contains('How many nights a week do you have nightmares?').should('be.visible');
    cy.contains('My nightmares are associated with exposure to trauma').should('be.visible');
  });

  it('should show less-frequent nightmares info for 1 per week', () => {
    cy.contains('Nightmares can disturb sleep').should('exist');
    cy.contains('Possible Nightmare Disorder').should('not.exist');
  });
});

describe('Chronotype section', () => {
  beforeEach(() => {
    cy.navigateToSection('chronotype');
  });

  it('should display the section title', () => {
    assertSectionVisible(SECTION_TITLES['chronotype']);
  });

  it('should display chronotype preference radio group', () => {
    cy.contains('What is your natural sleep preference?').should('exist');
    cy.contains('morning person').should('exist');
    cy.contains('night owl').should('exist');
    cy.contains('flexible').should('exist');
  });

  it('should show preference strength for late chronotype', () => {
    cy.contains('How strong is your night owl preference?').should('be.visible');
  });

  it('should display shift work checkbox as unchecked', () => {
    cy.contains('label', 'My job requires me to do shift work')
      .siblings('button[role="checkbox"]')
      .should('have.attr', 'data-state', 'unchecked');
  });

  it('should show past shift work years field when not doing shift work', () => {
    cy.contains("If you don't currently do shift work").should('be.visible');
  });

  it('should display time zone travel checkbox', () => {
    cy.contains('I travel across time zones more than 1 time a month').should('exist');
  });

  it('should show work/school time field for late preference', () => {
    cy.contains('On scheduled/work/school days, what time do you have to be at work/school?').should('be.visible');
  });

  it('should display night owl warning', () => {
    cy.contains('Night Owl Chronotype').should('exist');
  });
});

describe('Sleep Hygiene section', () => {
  beforeEach(() => {
    cy.navigateToSection('sleep-hygiene');
  });

  it('should display the section title', () => {
    assertSectionVisible(SECTION_TITLES['sleep-hygiene']);
  });

  it('should display supplement checklist', () => {
    cy.contains('What supplements or over-the-counter medications do you take for sleep?').should('exist');
    cy.contains('Melatonin').should('exist');
    cy.contains('Benadryl').should('exist');
    cy.contains('Magnesium').should('exist');
  });

  it('should display prescription medication checklist', () => {
    cy.contains('What prescription medications do you take for sleep?').should('exist');
    cy.contains('Benzodiazepines').should('exist');
    cy.contains('Z-drugs').should('exist');
    cy.contains('Orexin blockers').should('exist');
  });

  it('should display stimulants and nicotine fields', () => {
    cy.contains('Are you prescribed stimulants?').should('exist');
    cy.contains('I smoke cigarettes or use nicotine patches').should('exist');
  });

  it('should not show prescription medication warning with mock data', () => {
    cy.contains('Prescription Sleep Medications').should('not.exist');
  });
});

describe('Bedroom section', () => {
  beforeEach(() => {
    cy.navigateToSection('bedroom');
  });

  it('should display the section title', () => {
    assertSectionVisible(SECTION_TITLES['bedroom']);
  });

  it('should display all four rating sliders', () => {
    cy.contains('How relaxing and comfortable is your bedroom environment?').should('exist');
    cy.contains('How comfortable is your bed and bedding?').should('exist');
    cy.contains("How dark is your bedroom when you're trying to sleep?").should('exist');
    cy.contains('How quiet is your bedroom?').should('exist');
  });

  it('should display overall bedroom score', () => {
    cy.contains('Overall Bedroom Score').should('exist');
    cy.contains('7.0').should('be.visible');
    cy.contains('Good, but room for improvement').should('be.visible');
  });

  it('should not show poor environment warning', () => {
    cy.contains('Room for Improvement').should('not.exist');
  });

  it('should not show light or noise specific warnings', () => {
    cy.contains('Light Exposure Issue').should('not.exist');
    cy.contains('Noise Disturbance').should('not.exist');
  });
});

describe('Lifestyle section', () => {
  beforeEach(() => {
    cy.navigateToSection('lifestyle');
  });

  it('should display the section title', () => {
    assertSectionVisible(SECTION_TITLES['lifestyle']);
  });

  it('should display caffeine section with servings and last time', () => {
    cy.contains('Caffeine Consumption').should('exist');
    cy.contains('How many servings of caffeinated food or beverages').should('exist');
    cy.contains('What time do you have your final caffeinated food or beverage?').should('be.visible');
  });

  it('should display alcohol section', () => {
    cy.contains('Alcohol Consumption').should('exist');
    cy.contains('How many alcoholic drinks do you have per week?').should('exist');
  });

  it('should display exercise section with duration and end time', () => {
    cy.contains('Exercise Habits').should('exist');
    cy.contains('How many days do you exercise during a typical week?').should('exist');
    cy.contains('How long do you typically exercise?').should('be.visible');
    cy.contains('What time does your exercise typically end?').should('be.visible');
  });

  it('should show late caffeine warning', () => {
    cy.contains('Late Caffeine Consumption').should('be.visible');
  });

  it('should not show high caffeine or high alcohol warnings', () => {
    cy.contains('High Caffeine Intake').should('not.exist');
    cy.contains('High Alcohol Consumption').should('not.exist');
  });
});

describe('Mental Health section', () => {
  beforeEach(() => {
    cy.navigateToSection('mental-health');
  });

  it('should display the section title', () => {
    assertSectionVisible(SECTION_TITLES['mental-health']);
  });

  it('should display worry and anxiety checkboxes', () => {
    cy.contains('Worries about the next day often contribute').should('exist');
    cy.contains('anxiety or persistent rumination').should('exist');
    cy.contains('I spend time in bed trying to sleep').should('exist');
  });

  it('should display cancel activities radio group', () => {
    cy.contains('How often do you cancel activities following a night of poor sleep?').should('exist');
    cy.contains('Never').should('exist');
    cy.contains('1-2 times a week').should('exist');
    cy.contains('3 or more times a week').should('exist');
  });

  it('should display medical conditions checklist', () => {
    cy.contains('Medical History').should('exist');
    cy.contains('High blood pressure').should('exist');
    cy.contains('Diabetes').should('exist');
    cy.contains('Heart disease').should('exist');
  });

  it('should display mental health conditions checklist', () => {
    cy.contains('Mental Health History').should('exist');
    cy.contains('Depression').should('exist');
    cy.contains('Anxiety disorder').should('exist');
    cy.contains('PTSD').should('exist');
  });

  it('should show sleep-related anxiety warning with mock data', () => {
    cy.contains('Sleep-Related Anxiety Detected').should('be.visible');
  });

  it('should show significant sleep impact warning', () => {
    cy.contains('Significant Sleep Impact on Daily Life').should('be.visible');
  });

  it('should show sleep effort paradox alert', () => {
    cy.contains('Sleep Effort Paradox').should('be.visible');
  });
});

describe('Report section', () => {
  beforeEach(() => {
    cy.navigateToSection('report');
  });

  it('should display the section title', () => {
    assertSectionVisible(SECTION_TITLES['report']);
  });

  it('should display the report content area', () => {
    cy.contains('Sleep Report', { timeout: 15000 }).should('be.visible');
  });

  it('should not show Continue button on report section', () => {
    cy.contains('button', 'Continue').should('not.exist');
  });
});
