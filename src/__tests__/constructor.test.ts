import { expect, describe } from '@jest/globals';
import reducer, {
  initialState,
  addIngredients,
  deleteIngredient,
  moveIngredientUp,
  moveIngredientDown
} from '../services/constructor/slice';

const ingredient = {
  _id: '643d69a5c3f7b9001cfa093e',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
  __v: 0,
  id: '1'
};

const sause = {
  _id: '643d69a5c3f7b9001cfa0943',
  name: 'Соус фирменный Space Sauce',
  type: 'sauce',
  proteins: 50,
  fat: 22,
  carbohydrates: 11,
  calories: 14,
  price: 80,
  image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png',
  __v: 0,
  id: '2'
};

const stateWithIngredient = {
  bun: null,
  ingredients: [ingredient]
};

const stateMainThenSauce = {
  bun: null,
  ingredients: [ingredient, sause]
};

const stateSauceThenMain = {
  bun: null,
  ingredients: [sause, ingredient]
};

describe('Редьюсер конструктора: тестирование конструктора', () => {
  it('Добавление ингредиента', () => {
    const newState = reducer({ ...initialState }, addIngredients(ingredient));
    const { ingredients } = newState;

    expect(ingredients).toEqual([ingredient]);
  });
  it('Удаление ингредиента', () => {
    const newState = reducer({ ...stateWithIngredient }, deleteIngredient(0));

    expect(newState).toEqual(initialState);
  });
  it('Перемещение ингридиента вверх', () => {
    const newState = reducer({ ...stateMainThenSauce }, moveIngredientUp(1));

    expect(newState).toEqual(stateSauceThenMain);
  });
  it('Перемещение ингридиента вниз', () => {
    const newState = reducer({ ...stateSauceThenMain }, moveIngredientDown(0));

    expect(newState).toEqual(stateMainThenSauce);
  });
});
