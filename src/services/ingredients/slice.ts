import { TIngredient } from '@utils-types';
import { createSlice } from '@reduxjs/toolkit';
import { fetchIngredients } from './actions';

export interface IIngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | undefined | null;
}

export const initialState: IIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  }
});

export const ingredientsSelector = (state: {
  ingredients: IIngredientsState;
}) => state.ingredients.ingredients;
export const isLoadingSelector = (state: { ingredients: IIngredientsState }) =>
  state.ingredients.isLoading;

export default ingredientsSlice.reducer;
