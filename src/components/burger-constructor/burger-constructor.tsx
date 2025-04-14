import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useDispatch, useSelector } from '../../services/store';
import {
  resetConstructorState,
  stateSelector
} from '../../services/constructor/slice';

import {
  isLoadingSelector,
  orderSelector,
  resetOrder
} from '../../services/order/slice';
import { postOrder } from '../../services/order/actions';
import { selectCurrentUser } from '../../services/auth/slice';
import { getFeeds } from '../../services/order/actions';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const constructorItems = useSelector(stateSelector);
  const orderRequest = useSelector(isLoadingSelector);
  const orderModalData = useSelector(orderSelector);
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const data: string[] = [
    ...constructorItems.ingredients.map((ingredient) => ingredient._id),
    constructorItems.bun?._id
  ].filter((id): id is string => id !== undefined);

  const onOrderClick = async () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    const res = await dispatch(postOrder(data));

    if (postOrder.fulfilled.match(res)) {
      dispatch(getFeeds());
    }
  };

  const closeOrderModal = () => {
    dispatch(resetOrder());
    dispatch(resetConstructorState());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients?.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
