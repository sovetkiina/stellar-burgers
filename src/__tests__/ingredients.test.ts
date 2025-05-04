import reducer, { initialState } from '../services/ingredients/slice';
import { fetchIngredients } from '../services/ingredients/actions';
import { expect, describe } from '@jest/globals';

describe('Тест редьюсера слайса ingredients', () => {
  const mockResult = [
    {
      _id: '1',
      name: 'Тестовый ингредиент',
      type: 'main',
      proteins: 0,
      fat: 0,
      carbohydrates: 0,
      calories: 0,
      price: 1,
      image: 'image.jpg',
      image_mobile: 'image_mobile.jpg',
      image_large: 'image_large.jpg',
      __v: 0
    }
  ];

  const mockError = 'error';

  it('Обрабатывает fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Обрабатывает fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockResult // Список ингредиентов в отвте на запрос замоканные
    };
    const state = reducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockResult);
    expect(state.error).toBeNull();
  });

  it('Обрабатывает fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: mockError }
    };
    const state = reducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(mockError);
  });
});
