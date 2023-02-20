import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { userSelector } from '../../app/selectors/userSelector';
import styles from './AdminPage.module.scss';

const AdminPage = () => {
  const {isAuth, isAdmin} = useSelector(userSelector)

  return (
    <div className={styles.container}>
      {isAdmin ?
        <>

        </>
      : <span className={styles.only_admin}>{isAuth ? 'Эта страница доступна только админам' : 'Сначала авторизуйтесь'}</span>
      }
    </div>
  );
};

export default AdminPage;