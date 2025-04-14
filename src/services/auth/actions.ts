import {
  loginUserApi,
  logoutApi,
  getUserApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi,
  resetPasswordApi
} from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import { setIsAuthChecked, setUser } from './slice';

export const signUpUser = createAsyncThunk(
  'auth/signUpUser',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    // Сохраняем токены:
    // accessToken — в cookie для отправки с запросами
    // refreshToken — в localStorage для последующего обновления accessToken
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);

    return res;
  }
);

export const signInUser = createAsyncThunk(
  'auth/signInUser',
  async (data: TLoginData) => {
    const res = await loginUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);

    return res;
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: Partial<TRegisterData>) => {
    await updateUserApi(data);

    return getUserApi();
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

export const checkUserAuth = createAsyncThunk(
  'auth/checkUserAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      getUserApi()
        .then((res) => dispatch(setUser(res.user)))
        .catch(() => {
          localStorage.removeItem('refreshToken');
          deleteCookie('accessToken');
        })
        .finally(() => dispatch(setIsAuthChecked(true)));
    } else {
      dispatch(setIsAuthChecked(true));
    }
  }
);
