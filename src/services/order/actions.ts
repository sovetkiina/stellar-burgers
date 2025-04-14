import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi
} from '@api';

export const getFeeds = createAsyncThunk('order/getFeeds', async () => {
  console.log('Fetching feeds...');
  const res = await getFeedsApi();
  console.log('API Response:', res);
  return res;
});

export const getOrders = createAsyncThunk('order/getOrders', async () => {
  const res = await getOrdersApi();
  return res;
});

export const getOrderByNum = createAsyncThunk(
  'order/getOrderByNum',
  async (number: number) => {
    const res = await getOrderByNumberApi(number);
    return res;
  }
);

export const postOrder = createAsyncThunk(
  'order/postOrder',
  async (data: string[]) => {
    const res = await orderBurgerApi(data);
    return res;
  }
);
