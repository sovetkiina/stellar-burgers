import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TOrdersData, TUser } from './types';

const URL = process.env.BURGER_API_URL;

//функция проверки ответа от сервера
const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

//тип для всех ответов от сервера
type TServerResponse<T> = {
  success: boolean;
} & T;

//описывает ответ от сервера при обновлении токенов
type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

// функция для обновления access-токена, если старый истёк
export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      setCookie('accessToken', refreshData.accessToken);
      return refreshData;
    });

// функция для запросов с автоматическим обновлением токена
export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
) => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    if ((err as { message: string }).message === 'jwt expired') {
      const refreshData = await refreshToken();
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          refreshData.accessToken;
      }
      const res = await fetch(url, options);
      return await checkResponse<T>(res);
    } else {
      return Promise.reject(err);
    }
  }
};

type TIngredientsResponse = TServerResponse<{
  data: TIngredient[]; // массив ингредиентов
}>;

type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

type TOrdersResponse = TServerResponse<{
  data: TOrder[];
}>;

// получает список ингредиентов с сервера
export const getIngredientsApi = () =>
  fetch(`${URL}/ingredients`)
    .then((res) => checkResponse<TIngredientsResponse>(res))
    .then((data) => {
      if (data?.success) return data.data;
      return Promise.reject(data);
    });

// получает общую ленту заказов
export const getFeedsApi = () =>
  fetch(`${URL}/orders/all`)
    .then((res) => checkResponse<TFeedsResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

// получает заказы пользователя, возвращает массив заказов TOrder[]
export const getOrdersApi = () =>
  fetchWithRefresh<TFeedsResponse>(`${URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: `Bearer ${getCookie('accessToken')}`
    } as HeadersInit
  }).then((data) => {
    if (data?.success) return data.orders;
    return Promise.reject(data);
  });

type TNewOrderResponse = TServerResponse<{
  order: TOrder; //данные о заказе
  name: string; //название заказа
}>;

// создание нового заказа на сервере, возвращается объект с данными о новом заказе
export const orderBurgerApi = (data: string[]) =>
  fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: `Bearer ${getCookie('accessToken')}`
    } as HeadersInit,
    body: JSON.stringify({
      ingredients: data
    })
  }).then((data) => {
    if (data?.success) return data;
    return Promise.reject(data);
  });

type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

// получает данные о заказе по его номеру
export const getOrderByNumberApi = (number: number) =>
  fetch(`${URL}/orders/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => checkResponse<TOrderResponse>(res));

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

// Функция для регистрации нового пользователя
export const registerUserApi = (data: TRegisterData) =>
  fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export type TLoginData = {
  email: string;
  password: string;
  name?: string;
};

// Функция для авторизации пользователя
export const loginUserApi = (data: TLoginData) =>
  fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

// Функция для отправки запроса на восстановление пароля пользователя
export const forgotPasswordApi = (data: { email: string }) =>
  fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

// Функция для сброса пароля пользователя
export const resetPasswordApi = (data: { password: string; token: string }) =>
  fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

type TUserResponse = TServerResponse<{ user: TUser }>;

// Функция для получения информации о текущем пользователе
export const getUserApi = () =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    headers: {
      authorization: `Bearer ${getCookie('accessToken')}`
    } as HeadersInit
  });

// Функция для обновления данных пользователя
export const updateUserApi = (user: Partial<TRegisterData>) =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify(user)
  });

// Функция для выхода пользователя из системы
export const logoutApi = () =>
  fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then((res) => checkResponse<TServerResponse<{}>>(res));
