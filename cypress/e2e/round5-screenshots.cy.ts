function highlightContains(text: string | RegExp) {
  cy.contains(text).first().scrollIntoView();
  cy.contains(text)
    .first()
    .then($el => {
      const element = $el[0];
      element.style.outline = '3px solid red';
      element.style.outlineOffset = '4px';
    });
}

function capture(name: string) {
  cy.screenshot(name, { capture: 'viewport', overwrite: true });
}

describe('Round 5 changelog screenshots', () => {
  it('captures report and form screenshots for the 7/4 changelog', () => {
    cy.visit('/review?scenario=chronic-fatigue');
    cy.contains('Chronic Fatigue', { timeout: 15000 }).should('be.visible');
    highlightContains('Chronic Fatigue');
    capture('b2');

    cy.visit('/review?scenario=dspd-differential-dspd-primary');
    cy.contains('most likely struggling with DSPD', { timeout: 15000 }).should('be.visible');
    highlightContains('most likely struggling with DSPD');
    capture('b5-dspd');

    cy.visit('/review?scenario=dspd-differential-insomnia-primary');
    cy.contains('more likely struggling with insomnia', { timeout: 15000 }).should('be.visible');
    highlightContains('more likely struggling with insomnia');
    capture('b5-insomnia');

    cy.visit('/review?scenario=healthy-sleeper');
    cy.contains('We are impressed with your general sleep health', { timeout: 15000 }).should(
      'be.visible'
    );
    highlightContains('Sleep Health Recommendations');
    capture('part2-healthy');

    cy.visit('/review?scenario=insufficient-sleep-signs');
    cy.contains('Signs of Insufficient Sleep', { timeout: 15000 }).should('be.visible');
    highlightContains('Signs of Insufficient Sleep');
    capture('part3-signs');

    cy.visit('/review?scenario=healthy-sleeper');
    cy.contains('Your Chronotype', { timeout: 15000 }).should('be.visible');
    highlightContains('Your Chronotype');
    capture('part3-chronotype');

    cy.visit('/dev?section=daytime&nav=0');
    cy.contains("I've tried, but I cannot fall asleep during the day", { timeout: 10000 }).should(
      'be.visible'
    );
    highlightContains("I've tried, but I cannot fall asleep during the day");
    capture('form-daytime');

    cy.visit('/dev?section=restless-legs&nav=0');
    cy.checkCheckbox('I have trouble lying still while trying to fall asleep at night');
    cy.checkCheckbox('I have an urge to move my legs while lying in bed at night');
    cy.checkCheckbox('Movement relieves the uncomfortable feelings in my legs');
    cy.contains('Your answers suggest that you may have restless legs syndrome').should(
      'be.visible'
    );
    highlightContains('Your answers suggest that you may have restless legs syndrome');
    capture('form-rls');

    cy.visit('/dev?section=demographics&nav=0');
    cy.contains('What year were you born?')
      .closest('[data-slot="form-item"]')
      .find('button[role="combobox"]')
      .click();
    cy.get('input[placeholder="Type a year..."]').type('2005');
    cy.contains('2005').click();
    cy.contains('Between 9 and 25 years of age').should('be.visible');
    highlightContains('Between 9 and 25 years of age');
    capture('form-under25');

    cy.visit('/');
    cy.checkCheckbox('I have read and understand the service that we provide');
    cy.contains('button', 'Continue').click();
    cy.contains('What year were you born?')
      .closest('[data-slot="form-item"]')
      .find('button[role="combobox"]')
      .click();
    cy.contains('1990').click();
    cy.selectOption('Sex', 'Male');
    cy.get('input[placeholder="e.g., 12345"]').type('12345');
    cy.contains('button', 'Continue').click();
    for (let step = 0; step < 12; step += 1) {
      cy.contains('button', 'Continue').click();
    }
    cy.contains('button', 'Generate Report').click();
    cy.contains('You did not answer a sufficient number of questions', { timeout: 10000 }).should(
      'be.visible'
    );
    highlightContains('You did not answer a sufficient number of questions');
    capture('insufficient-answers');
  });
});
