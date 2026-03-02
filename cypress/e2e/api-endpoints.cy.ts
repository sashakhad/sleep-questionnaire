describe('API Endpoints', () => {
  describe('POST /api/responses', () => {
    it('should accept valid questionnaire data', () => {
      cy.fixture('mock-questionnaire').then((data) => {
        cy.request({
          method: 'POST',
          url: '/api/responses',
          body: data,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('success', true);
          expect(response.body).to.have.property('id');
        });
      });
    });

    it('should reject invalid data with 400', () => {
      cy.request({
        method: 'POST',
        url: '/api/responses',
        body: { invalid: 'data' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('error');
      });
    });
  });

  describe('GET /api/responses (protected)', () => {
    it('should return 401 without auth', () => {
      cy.request({
        method: 'GET',
        url: '/api/responses',
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.have.property('error', 'Unauthorized');
      });
    });

    it('should return paginated responses with valid session', () => {
      cy.request({
        method: 'POST',
        url: '/api/admin/login',
        body: { password: 'sleepwell' },
      }).then((loginResponse) => {
        expect(loginResponse.status).to.eq(200);

        cy.request({
          method: 'GET',
          url: '/api/responses?page=1&limit=10',
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('responses');
          expect(response.body).to.have.property('pagination');
          expect(response.body.pagination).to.have.property('page', 1);
          expect(response.body.pagination).to.have.property('limit', 10);
          expect(response.body.pagination).to.have.property('total');
          expect(response.body.pagination).to.have.property('totalPages');
        });
      });
    });
  });

  describe('GET /api/responses/csv (protected)', () => {
    it('should return 401 without auth', () => {
      cy.request({
        method: 'GET',
        url: '/api/responses/csv',
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('should return CSV with correct content-type when authenticated', () => {
      cy.request({
        method: 'POST',
        url: '/api/admin/login',
        body: { password: 'sleepwell' },
      }).then(() => {
        cy.request({
          method: 'GET',
          url: '/api/responses/csv',
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.headers['content-type']).to.include('text/csv');
          expect(response.headers['content-disposition']).to.include('attachment');
          expect(response.headers['content-disposition']).to.include('.csv');
        });
      });
    });

    it('should have proper CSV headers in first row', () => {
      cy.request({
        method: 'POST',
        url: '/api/admin/login',
        body: { password: 'sleepwell' },
      }).then(() => {
        cy.request({
          method: 'GET',
          url: '/api/responses/csv',
        }).then((response) => {
          const firstLine = response.body.split('\n')[0];
          expect(firstLine).to.include('id');
          expect(firstLine).to.include('year_of_birth');
          expect(firstLine).to.include('sex');
          expect(firstLine).to.include('zipcode');
          expect(firstLine).to.include('submitted_date');
        });
      });
    });

    it('should respect limit parameter', () => {
      cy.request({
        method: 'POST',
        url: '/api/admin/login',
        body: { password: 'sleepwell' },
      }).then(() => {
        cy.request({
          method: 'GET',
          url: '/api/responses/csv?limit=1',
        }).then((response) => {
          const lines = response.body.trim().split('\n');
          // Header + at most 1 data row
          expect(lines.length).to.be.at.most(2);
        });
      });
    });
  });

  describe('POST /api/generate-pdf', () => {
    it('should return PDF with correct content-type', () => {
      cy.fixture('mock-questionnaire').then((data) => {
        cy.request({
          method: 'POST',
          url: '/api/generate-pdf',
          body: { data, userName: 'Test Patient' },
          encoding: 'binary',
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.headers['content-type']).to.include('application/pdf');
          expect(response.headers['content-disposition']).to.include('attachment');
          expect(response.headers['content-disposition']).to.include('.pdf');
        });
      });
    });

    it('should reject invalid data', () => {
      cy.request({
        method: 'POST',
        url: '/api/generate-pdf',
        body: { data: { invalid: true }, userName: 'Test' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(500);
      });
    });
  });

  describe('POST /api/admin/login', () => {
    it('should reject wrong password with 401', () => {
      cy.request({
        method: 'POST',
        url: '/api/admin/login',
        body: { password: 'wrongpassword' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.have.property('error', 'Invalid password');
      });
    });

    it('should accept correct password and set session cookie', () => {
      cy.request({
        method: 'POST',
        url: '/api/admin/login',
        body: { password: 'sleepwell' },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
      });
    });

    it('should reject empty password', () => {
      cy.request({
        method: 'POST',
        url: '/api/admin/login',
        body: { password: '' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });
  });
});
