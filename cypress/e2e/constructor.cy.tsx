import * as userData from '../fixtures/userData.json';
import * as authTokens from '../fixtures/authTokens.json';
import * as orderData from '../fixtures/order.json';

describe('Тестирование конструктора с добавлением булки', () => {
  before(() => {
    // Мокаем запрос на получение ингредиентов
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('http://localhost:4000/');
  });

  it('Добавление верхней и нижней булки в заказ', () => {
    const bun = cy.get(':nth-child(2) > :nth-child(1) > .common_button');
    bun.click();

    cy.get(
      '.constructor-element_pos_top > .constructor-element__row > .constructor-element__text'
    ).contains('Краторная булка N-200i (верх)');

    cy.get(
      '.constructor-element_pos_bottom > .constructor-element__row > .constructor-element__text'
    ).contains('Краторная булка N-200i (низ)');
  });
});

describe('Проверка работы модальных окон с подробной информацией об ингредиенте', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('http://localhost:4000/');
  });

  it('Проверка открытия модального окна с описанием ингредиента', () => {
    const ingredient = cy.get(':nth-child(4) > :nth-child(5)');

    ingredient.click();

    const modal = cy.get('#modals > div:first-child');
    const header = modal.get('div:first-child > h3');

    header.contains('Хрустящие минеральные кольца');
  });

  it('Проверка функциональности кнопки (крестик) закрытия модального окна', () => {
    const ingredient = cy.get(':nth-child(4) > :nth-child(5)');

    ingredient.click();

    const modal = cy.get('#modals > div:first-child').as('modal');
    const button = modal.get('div:first-child > button > svg');

    button.click();

    cy.get('modal').should('not.exist');
  });

  it('Проверка закрытия модального окна по клику на оверлей', () => {
    const ingredient = cy.get(':nth-child(4) > :nth-child(5)');

    ingredient.click();

    const modal = cy.get('#modals > div:first-child').as('modal');
    const overlay = modal.get('#modals > div:nth-child(2)');

    overlay.click({ force: true });

    cy.get('modal').should('not.exist');
  });
});

describe('Проверка создания заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'userData.json' });
    cy.setCookie('accessToken', authTokens.accessToken);
    localStorage.setItem('refreshToken', authTokens.refreshToken);
    cy.intercept('GET', 'api/auth/tokens', {
      fixture: 'authTokens.json'
    });
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' });
    cy.visit('http://localhost:4000/');
  });

  it('', () => {
    const bun = cy.get(':nth-child(2) > :nth-child(1) > .common_button');
    const main = cy.get(':nth-child(4) > :nth-child(3) > .common_button');
    const sauce = cy.get(':nth-child(6) > .common_button');

    bun.click();
    main.click();
    sauce.click();

    const orderButton = cy.get(
      '#root > div > main > div > section:nth-child(2) > div > button'
    );

    orderButton.click();

    const orderModal = cy.get('#modals > div:first-child');
    const orderNumber = orderModal.get('div:nth-child(2) > h2');

    orderNumber.contains(orderData.order.number);

    const button = orderModal.get(
      'div:first-child > div:first-child > button > svg'
    );

    button.click();

    cy.get('modal').should('not.exist');

    const burgerCunstructor = {
      constructorBunTop: cy.get('div > section:nth-child(2) > div'),
      constructoMainIngredient: cy.get('div > section:nth-child(2) > ul > div'),
      constructorBunBottom: cy.get(
        'div > section:nth-child(2) > div:nth-child(3)'
      )
    };

    burgerCunstructor.constructorBunTop.contains('Выберите булки');
    burgerCunstructor.constructoMainIngredient.contains('Выберите начинку');
    burgerCunstructor.constructorBunBottom.contains('Выберите булки');
  });

  afterEach(() => {
    cy.clearAllCookies();
    localStorage.removeItem('refreshToken');
  });
});