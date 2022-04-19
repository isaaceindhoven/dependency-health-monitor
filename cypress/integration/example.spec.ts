// https://docs.cypress.io/api/introduction/api.html

describe('My First Test', () => {
  it('visits the app root url', () => {
    cy.visit('/');
    cy.get('div div span:first').should('have.text', 'One Product, ');
  });
});
