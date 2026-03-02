describe('Admin Dashboard', () => {
  describe('Login Flow', () => {
    it('should redirect unauthenticated users to login page', () => {
      cy.visit('/admin', { failOnStatusCode: false });
      cy.url().should('include', '/admin/login');
    });

    it('should show login form', () => {
      cy.visit('/admin/login');
      cy.get('input[type="password"]').should('exist');
      cy.contains('button', /log\s*in|sign\s*in|submit/i).should('exist');
    });

    it('should reject incorrect password', () => {
      cy.visit('/admin/login');
      cy.get('input[type="password"]').type('wrongpassword');
      cy.contains('button', /log\s*in|sign\s*in|submit/i).click();
      cy.url().should('include', '/admin/login');
    });

    it('should allow login with correct password', () => {
      cy.visit('/admin/login');
      cy.get('input[type="password"]').type('sleepwell');
      cy.contains('button', /log\s*in|sign\s*in|submit/i).click();
      cy.url({ timeout: 10000 }).should('include', '/admin').and('not.include', '/login');
    });
  });

  describe('Dashboard (authenticated)', () => {
    beforeEach(() => {
      cy.request({
        method: 'POST',
        url: '/api/admin/login',
        body: { password: 'sleepwell' },
      });
      cy.visit('/admin');
    });

    it('should display the admin dashboard', () => {
      cy.url().should('include', '/admin');
      cy.url().should('not.include', '/login');
    });

    it('should show response count or table', () => {
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasDashboard = text.includes('response') ||
          text.includes('questionnaire') ||
          text.includes('total') ||
          text.includes('export');
        expect(hasDashboard).to.be.true;
      });
    });

    it('should have CSV export functionality', () => {
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasExport = text.includes('csv') ||
          text.includes('export') ||
          text.includes('download');
        expect(hasExport).to.be.true;
      });
    });

    it('should have logout functionality', () => {
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasLogout = text.includes('log out') || text.includes('logout') || text.includes('sign out');
        expect(hasLogout).to.be.true;
      });
    });
  });
});
