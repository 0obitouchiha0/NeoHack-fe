import React from 'react';
import { Navigate } from 'react-router';

import { useAppSelector } from '../../store/store';
import styles from './styles.module.scss';
import Login from './forms/Login/Login';
import Registrate from './forms/Registrate/Registrate';

const Auth = () => {
    const {user, userId} = useAppSelector(state => state.user);
    const [hasAccount, setHasAccount] = React.useState(true);

    const handleHasAccountChange = () => {
        setHasAccount(prev => !prev);
    };

    if(user) return <Navigate to="/profile" />;
    return (
        <div className={styles.auth}>
            {hasAccount
                ? <Login />
                : <Registrate />
            }
            {userId && !hasAccount && <button className={styles.auth__success} onClick={handleHasAccountChange}>Вы успешно зарегистрировались. Нажмите чтобы перейти на страницу входа</button>}
            <button className={styles.auth__change} onClick={handleHasAccountChange}>{hasAccount ? 'Нет аккаунта? Зарегистрируйтесь' : 'Есть аккаунт? Войдите'}</button>
        </div>
    );
};

export default Auth;
