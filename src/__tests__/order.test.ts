import { expect, describe } from '@jest/globals';
import reducer, { initialState } from '../services/order/slice';
import {
  getFeeds,
  getOrderByNum,
  getOrders,
  postOrder
} from '../services/order/actions';

describe('Тест редьюсера orderSlice', () => {
  const testOrder = {
    _id: 'id',
    status: 'status',
    name: 'name',
    createdAt: 'test',
    updatedAt: 'test',
    number: 1,
    ingredients: ['test']
  };

  const mockError = 'error';

  const mockResult = {
    order: testOrder,
    name: 'name',
    error: mockError,
    isLoading: false,
    orders: [testOrder],
    orderModal: [testOrder],
    profileOrders: [testOrder],
    total: 1,
    totalToday: 1
  };

  describe('Тест обработки результатов action getFeeds', () => {
    it('getFeeds.fulfilled', () => {
      const action = {
        type: getFeeds.fulfilled.type,
        payload: mockResult
      };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(mockResult.orders);
      expect(state.total).toEqual(mockResult.total);
      expect(state.totalToday).toEqual(mockResult.totalToday);
    });

    it('getFeeds.rejected', () => {
      const action = {
        type: getFeeds.rejected.type,
        error: { message: mockError }
      };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual([]);
      expect(state.total).toEqual(0);
      expect(state.totalToday).toEqual(0);
      expect(state.error).toBe(mockError);
    });
  });

  describe('Тест обработки результатов getOrders', () => {
    it('getOrders.pending', () => {
      const action = { type: getOrders.pending.type };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('getOrders.fulfilled', () => {
      const action = {
        type: getOrders.fulfilled.type,
        payload: mockResult
      };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.profileOrders).toEqual(mockResult);
    });

    it('getOrders.rejected', () => {
      const action = {
        type: getOrders.rejected.type,
        error: { message: mockError }
      };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(mockError);
    });
  });

  describe('Тест обработки результатов action postOrder', () => {
    it('postOrder.pending', () => {
      const action = { type: postOrder.pending.type };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('postOrder.fulfilled', () => {
      const action = {
        type: postOrder.fulfilled.type,
        payload: mockResult
      };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.name).toEqual(mockResult.name);
      expect(state.order).toEqual(mockResult.order);
    });

    it('postOrder.rejected', () => {
      const action = {
        type: postOrder.rejected.type,
        error: { message: mockError }
      };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(mockError);
    });
  });

  describe('Тест обработки результатов action getOrderByNum', () => {
    it('getOrderByNum.pending', () => {
      const action = { type: getOrderByNum.pending.type };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('getOrderByNum.fulfilled', () => {
      const action = {
        type: getOrderByNum.fulfilled.type,
        payload: mockResult
      };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.orderModal).toEqual(mockResult.orderModal);
    });

    it('getOrderByNum.rejected', () => {
      const action = {
        type: getOrderByNum.rejected.type,
        error: { message: mockError }
      };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(mockError);
    });
  });
});