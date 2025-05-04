import '../support/commands';

const TEST_URL = 'http://localhost:4000/';
const BUN_SELECTOR = '[data-testid="bun"]';
const CONSTRUCTOR_SELECTOR = '[data-testid="constructor"]';
const MAIN_SELECTOR = '[data-testid="main"]';
const BUN_IN_CONSTRUCTOR_SELECTOR = '[data-testid="bunInConstructor"]';
const MAIN_LIST_SELECTOR = '[data-testid="mainList"]';
const INGREDIENT_DETAILS_SELECTOR = '[data-testid="Детали ингредиента"]';
const ORDER_MODAL_SELECTOR = '[data-testid="orderModal"]';
const PRICE_SELECTOR = '[data-testid="price"]';

describe('Интеграционные тесты', function () {
  beforeEach(() => {
    cy.visit(TEST_URL);
    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.wait('@getIngredients');
    cy.get(BUN_SELECTOR).as('bun');
    cy.get(CONSTRUCTOR_SELECTOR).as('constructor');
    cy.get(MAIN_SELECTOR).as('main');
  });

  describe('Добавление ингредиентов в конструктор заказа', function () {
    it('Добавление булки в конструктор', function () {
      cy.addIngredientToCart('@bun');
      cy.get('@constructor').within(() => {
        cy.get(BUN_IN_CONSTRUCTOR_SELECTOR).should(
          'have.length.greaterThan',
          0
        );
      });
    });

    it('Добавление начинки в конструктор', function () {
      cy.get('@main').then(($mainIngredients) => {
        const ingredientCount = $mainIngredients.length;
        for (let i = 0; i < ingredientCount; i++) {
          cy.get('@main')
            .eq(i)
            .within(() => {
              cy.get('button').click();
            });
        }
        cy.get('@constructor').within(() => {
          cy.get(MAIN_LIST_SELECTOR)
            .children()
            .should('have.length', ingredientCount);
        });
      });
    });
  });

  describe('Работа модальных окон', function () {
    it('Открытие модального окна с описанием ингридиента и закрытие по кнопке (крестик)', function () {
      cy.get('@bun').first().click();
      cy.get(INGREDIENT_DETAILS_SELECTOR).as('details');
      cy.verifyModalContent('@details', 'Краторная булка N-200i');
      cy.addIngredientToCart('@details');
      cy.get('@details').should('not.exist');
    });

    it('Закрытие модального окна по оверлею', function () {
      cy.get('@bun').first().click();
      cy.get('body').click(0, 0);
      cy.get(INGREDIENT_DETAILS_SELECTOR).should('not.exist');
    });
  });

  describe('Тестрировние создания заказа', function () {
    beforeEach(() => {
      cy.intercept('POST', '/api/auth/login', { fixture: 'userData.json' });
      cy.intercept('GET', '/api/auth/user', { fixture: 'userData.json' });
      cy.intercept('POST', '/api/orders', { fixture: 'order.json' });

      cy.window().then((win) => {
        win.localStorage.setItem('ключ', 'значение');
      });
      cy.setCookie('accessToken', 'accessToken');
      cy.visit(TEST_URL);
    });

    it('Создание нового заказа и очистка корзины после оформления', () => {
      cy.submitOrder();
      cy.verifyModalContent(ORDER_MODAL_SELECTOR, '75887');

      cy.get('[data-testid=""]').within(() => {
        cy.get('button').click();
      });

      cy.get('[data-testid=""]').should('not.exist');
      cy.get('@constructor').contains('Выберите булки');
      cy.get('@constructor').contains('Выберите начинку');

      cy.get('body').then(($body) => {
        if ($body.find(PRICE_SELECTOR).length) {
          cy.get(PRICE_SELECTOR).contains('0');
        }
      });
    });

    afterEach(() => {
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
      });
      cy.clearCookie('accessToken');
    });
  });
});
