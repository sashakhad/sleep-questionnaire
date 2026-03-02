export function assertSectionVisible(sectionTitle: string): void {
  cy.get('[data-slot="card-title"]').should('contain.text', sectionTitle);
}

export function assertProgressBar(expectedPercent: number): void {
  cy.get('[role="progressbar"]').should('have.attr', 'aria-valuenow', String(expectedPercent));
}

export function assertStepIndicator(currentStep: number, totalSteps: number): void {
  cy.contains(`Step ${currentStep} of ${totalSteps}`).should('exist');
}

export function assertContinueEnabled(): void {
  cy.contains('button', 'Continue').should('not.be.disabled');
}

export function assertContinueDisabled(): void {
  cy.contains('button', 'Continue').should('be.disabled');
}

export function assertPreviousVisible(): void {
  cy.contains('button', 'Previous').should('be.visible');
}

export function assertPreviousNotVisible(): void {
  cy.contains('button', 'Previous').should('have.class', 'invisible');
}

export function assertFormExists(): void {
  cy.get('form').should('exist');
}
