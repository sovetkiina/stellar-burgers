import { TConstructorIngredient } from '@utils-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IConstructorState {
  bun: null | TConstructorIngredient;
  ingredients: TConstructorIngredient[];
}

export const initialState: IConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredients: (state, action: PayloadAction<TConstructorIngredient>) => {
      if (action.payload.type === 'bun') {
        state.bun = action.payload;
      } else {
        state.ingredients.push(action.payload);
      }
    },
    removeAllIngredients: (
      state,
      action: PayloadAction<TConstructorIngredient[]>
    ) => {
      state.ingredients = action.payload;
    },
    resetConstructorState: (state) => (state = initialState),
    moveIngredientUp(state, action) {
      const index = action.payload;
      if (index > 0) {
        state.ingredients[index] = state.ingredients.splice(
          index - 1,
          1,
          state.ingredients[index]
        )[0];
      }
    },
    moveIngredientDown(state, action) {
      const index = action.payload;
      if (index < state.ingredients.length - 1) {
        state.ingredients[index] = state.ingredients.splice(
          index + 1,
          1,
          state.ingredients[index]
        )[0];
      }
    },
    deleteIngredient(state, action) {
      const index = action.payload;
      state.ingredients.splice(index, 1);
    }
  },
  selectors: {
    stateSelector: (state) => state,
    ingredientsSelector: (state) => state.ingredients
  }
});

export const { stateSelector, ingredientsSelector } =
  constructorSlice.selectors;

export const {
  addIngredients,
  removeAllIngredients,
  resetConstructorState,
  moveIngredientUp,
  moveIngredientDown,
  deleteIngredient
} = constructorSlice.actions;

export default constructorSlice.reducer;
