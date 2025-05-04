// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    addIngredientToCart(alias: string): Chainable<Element>;
    verifyModalContent(alias: string, expectedText: string): Chainable<Element>;
    submitOrder(): Chainable<Element>;
  }
}

Cypress.Commands.add('addIngredientToCart', (alias: string) => {
  cy.get(alias)
    .first()
    .within(() => {
      cy.get('button').click();
    });
});

Cypress.Commands.add(
  'verifyModalContent',
  (alias: string, expectedText: string) => {
    cy.get(alias).should('be.visible').contains(expectedText);
  }
);

Cypress.Commands.add('submitOrder', () => {
  cy.addIngredientToCart('@bun');
  cy.addIngredientToCart('@main');
  cy.get('@constructor').within(() => {
    cy.contains('Оформить заказ').click();
  });
});
