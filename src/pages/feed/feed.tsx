import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { isLoadingSelector, ordersSelector } from '../../services/order/slice';
import { getFeeds } from '../../services/order/actions';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(ordersSelector);
  const isLoading = useSelector(isLoadingSelector);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getFeeds());
  }, []);

  const handleGetFeeds = useCallback(() => {
    dispatch(getFeeds());
  }, []);

  console.log('Orders:', orders);
  console.log('Loading:', isLoading);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <>
      <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />
    </>
  );
};
