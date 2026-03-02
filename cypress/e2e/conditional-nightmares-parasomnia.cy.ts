describe('Nightmare and Parasomnia Conditionals', () => {
  describe('Nightmare conditionals', () => {
    beforeEach(() => {
      cy.navigateToSection('nightmares');
    });

    it('should show dream recall info alert when remembersDreams is true', () => {
      cy.contains('Remembering your dreams can be a function').should('exist');
    });

    it('should hide dream recall info alert when remembersDreams is unchecked', () => {
      cy.uncheckCheckbox('I remember my dreams at least a few nights a week');
      cy.contains('Remembering your dreams can be a function').should('not.exist');
    });

    it('should hide badDreamsPerWeek when hasBadDreams is false', () => {
      cy.contains('How many nights a week do you have bad dreams?').should('not.exist');
    });

    it('should show badDreamsPerWeek when bad dreams checkbox is checked', () => {
      cy.checkCheckbox('I have bad dreams, but not nightmares');
      cy.contains('How many nights a week do you have bad dreams?').should('exist');
    });

    it('should show Frequent Bad Dreams warning when badDreamsPerWeek is 3', () => {
      cy.checkCheckbox('I have bad dreams, but not nightmares');
      cy.contains('label', /how many nights a week do you have bad dreams/i)
        .closest('[data-slot="form-item"]')
        .find('input')
        .clear()
        .type('3');
      cy.contains('strong', 'Frequent Bad Dreams').should('exist');
    });

    it('should not show Frequent Bad Dreams warning when badDreamsPerWeek is 2', () => {
      cy.checkCheckbox('I have bad dreams, but not nightmares');
      cy.contains('label', /how many nights a week do you have bad dreams/i)
        .closest('[data-slot="form-item"]')
        .find('input')
        .clear()
        .type('2');
      cy.contains('strong', 'Frequent Bad Dreams').should('not.exist');
    });

    it('should show nightmaresPerWeek field with default mock data (hasNightmares=true)', () => {
      cy.contains('How many nights a week do you have nightmares?').should('be.visible');
    });

    it('should show associatedWithTrauma checkbox with default mock data', () => {
      cy.contains('My nightmares are associated with exposure to trauma').should('be.visible');
    });

    it('should show less frequent nightmares info with nightmaresPerWeek=1', () => {
      cy.contains('Nightmares can disturb sleep').should('exist');
    });

    it('should not show Possible Nightmare Disorder with nightmaresPerWeek=1', () => {
      cy.contains('strong', 'Possible Nightmare Disorder').should('not.exist');
    });

    it('should show Possible Nightmare Disorder and hide less frequent info when nightmaresPerWeek is 2', () => {
      cy.contains('label', /how many nights a week do you have nightmares/i)
        .closest('[data-slot="form-item"]')
        .find('input')
        .clear()
        .type('2');
      cy.contains('strong', 'Possible Nightmare Disorder').should('exist');
      cy.contains('Nightmares can disturb sleep').should('not.exist');
    });

    it('should hide nightmare fields when hasNightmares is unchecked', () => {
      cy.uncheckCheckbox('I have nightmares');
      cy.contains('How many nights a week do you have nightmares?').should('not.exist');
      cy.contains('My nightmares are associated with exposure to trauma').should('not.exist');
      cy.contains('Nightmares can disturb sleep').should('not.exist');
    });

    it('should not show Trauma-Related Nightmares alert with default mock data (associatedWithTrauma=false)', () => {
      cy.contains('strong', 'Trauma-Related Nightmares').should('not.exist');
    });

    it('should show Trauma-Related Nightmares alert when associatedWithTrauma is checked', () => {
      cy.checkCheckbox(
        'My nightmares are associated with exposure to trauma or a history of post traumatic stress disorder (PTSD)'
      );
      cy.contains('strong', 'Trauma-Related Nightmares').should('exist');
    });
  });

  describe('Parasomnia conditionals', () => {
    beforeEach(() => {
      cy.navigateToSection('parasomnia');
    });

    it('should hide follow-up checkboxes when nightBehaviors is empty', () => {
      cy.contains('I have a clear memory of these events').should('not.exist');
      cy.contains('I act out my dreams').should('not.exist');
      cy.contains('I have injured myself or others').should('not.exist');
    });

    it('should not show Safety Measures warning when nightBehaviors is empty', () => {
      cy.contains('strong', 'Safety Measures Recommended').should('not.exist');
    });

    it('should show follow-up checkboxes when a night behavior is checked', () => {
      cy.checkCheckbox('Walk');
      cy.contains('I have a clear memory of these events').should('exist');
      cy.contains('I act out my dreams').should('exist');
      cy.contains('I have injured myself or others, or I have left my home').should('exist');
    });

    it('should show Safety Measures warning when a night behavior is checked', () => {
      cy.checkCheckbox('Walk');
      cy.contains('strong', 'Safety Measures Recommended').should('exist');
    });

    it('should hide follow-ups and safety warning when night behavior is unchecked again', () => {
      cy.checkCheckbox('Walk');
      cy.contains('I have a clear memory of these events').should('exist');
      cy.uncheckCheckbox('Walk');
      cy.contains('I have a clear memory of these events').should('not.exist');
      cy.contains('strong', 'Safety Measures Recommended').should('not.exist');
    });

    it('should show RBD alert when both remembersEvents and actsOutDreams are checked', () => {
      cy.checkCheckbox('Walk');
      cy.checkCheckbox('I have a clear memory of these events');
      cy.checkCheckbox('I act out my dreams');
      cy.contains('strong', 'Important Safety Notice').should('exist');
    });

    it('should not show RBD alert when only remembersEvents is checked', () => {
      cy.checkCheckbox('Walk');
      cy.checkCheckbox('I have a clear memory of these events');
      cy.contains('strong', 'Important Safety Notice').should('not.exist');
    });

    it('should not show RBD alert when only actsOutDreams is checked', () => {
      cy.checkCheckbox('Walk');
      cy.checkCheckbox('I act out my dreams');
      cy.contains('strong', 'Important Safety Notice').should('not.exist');
    });
  });
});
