import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUserName } from '../../services/auth/slice';

export const AppHeader: FC = () => {
  const userName = useSelector(selectUserName);

  return <AppHeaderUI userName={userName ? userName : 'Личный кабинет'} />;
};
