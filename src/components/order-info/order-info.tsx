import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { ingredientsSelector } from '../../services/ingredients/slice';
import { getOrderByNum } from '../../services/order/actions';
import { orderModalSelector, ordersSelector } from '../../services/order/slice';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const dispatch = useDispatch();
  //получение данных
  const param = useParams();
  const orderNumber = Number(param.number);
  //стейт и данные из стора
  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const ingredients: TIngredient[] = useSelector(ingredientsSelector);
  const modalData = useSelector(orderModalSelector);
  const data = useSelector(ordersSelector);

  useEffect(() => {
    if (orderNumber) {
      const order: TOrder | undefined = data.find(
        (item) => item.number === orderNumber
      );

      if (order) {
        setOrderData(order);
      } else {
        dispatch(getOrderByNum(orderNumber));
      }
    }
  }, [dispatch, orderNumber]);
  useEffect(() => {
    if (modalData && modalData.number === orderNumber) {
      setOrderData(modalData);
    }
  }, [modalData, orderNumber]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find(
            (ingredient) => ingredient._id === item
          );
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
