import { expect, describe } from '@jest/globals';
import reducer, {
  initialState,
  setUser,
  setIsAuthChecked
} from '../services/auth/slice';
import {
  signInUser,
  logoutUser,
  signUpUser,
  updateUser
} from '../services/auth/actions';

describe('Тест редьюсера authSlice', () => {
  const testUser = {
    email: 'testEmail',
    name: 'testName'
  };
  const mockError = 'error';
  const mockResult = {
    user: testUser,
    isAuthChecked: false,
    error: mockError
  };

  it('Обновляется isAuthChecked', () => {
    const newState = reducer({ ...initialState }, setIsAuthChecked(true));
    const { isAuthChecked } = newState;

    expect(isAuthChecked).toEqual(true);
  });

  it('Обновляется информация о пользователе', () => {
    const newState = reducer({ ...initialState }, setUser(testUser));
    const { user } = newState;

    expect(user).toEqual(testUser);
  });

  describe('Проверка обработки action registerUser', () => {
    it('registerUser.pending', () => {
      const action = { type: signInUser.pending.type };
      const state = reducer(initialState, action);

      expect(state.isAuthChecked).toBe(false);
      expect(state.error).toBe(null);
    });

    it('registerUser.fulfilled', () => {
      const action = {
        type: signInUser.fulfilled.type,
        payload: mockResult
      };
      const state = reducer(initialState, action);

      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toEqual(mockResult.user);
    });

    it('registerUser.rejected', () => {
      const action = {
        type: signInUser.rejected.type,
        error: { message: mockError }
      };
      const state = reducer(initialState, action);

      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBe(mockError);
    });
  });

  describe('Проверка обработки action loginUser', () => {
    it('loginUser.pending', () => {
      const action = { type: signUpUser.pending.type };
      const state = reducer(initialState, action);

      expect(state.isAuthChecked).toBe(false);
      expect(state.error).toBe(null);
    });

    it('loginUser.fulfilled', () => {
      const action = {
        type: signUpUser.fulfilled.type,
        payload: mockResult
      };
      const state = reducer(initialState, action);

      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toEqual(mockResult.user);
    });

    it('loginUser.rejected', () => {
      const action = {
        type: signUpUser.rejected.type,
        error: { message: mockError }
      };
      const state = reducer(initialState, action);

      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBe(mockError);
    });
  });

  describe('Проверка обработки action updateUser', () => {
    it('updateUser.fulfilled', () => {
      const action = {
        type: updateUser.fulfilled.type,
        payload: mockResult
      };
      const state = reducer(initialState, action);

      expect(state.user).toEqual(mockResult.user);
    });
  });

  describe('Проверка обработки action logoutUser', () => {
    it('logoutUser.pending', () => {
      const action = { type: logoutUser.pending.type };
      const state = reducer(initialState, action);

      expect(state.isAuthChecked).toBe(false);
      expect(state.error).toBe(null);
    });

    it('logoutUser.fulfilled', () => {
      const action = {
        type: logoutUser.fulfilled.type,
        payload: mockResult
      };
      const state = reducer(initialState, action);
      expect(state.user).toEqual(null);
    });

    it('logoutUser.rejected', () => {
      const action = {
        type: logoutUser.rejected.type,
        error: { message: mockError }
      };
      const state = reducer(initialState, action);
      expect(state.error).toBe(mockError);
    });
  });
});
