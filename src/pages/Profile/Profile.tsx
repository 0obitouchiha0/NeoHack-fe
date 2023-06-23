import React from 'react';
import { EditOutlined } from '@ant-design/icons';

import Layout from '../../components/Layout/Layout';
import { useAppDispatch, useAppSelector } from '../../store/store';
import styles from './styles.module.scss';
import { update, userType } from '../../store/slices/userSlice';
import { Navigate } from 'react-router';
import axios from 'axios';
import { IScore } from '../Test/Test';

const Profile = () => {
    
    const {user, updateErrors, updateSuccessStatus} = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const [isEditing, setIsEditing] = React.useState(false);
    const [userData, setUserData] = React.useState<userType>(user || {} as userType);
    const [userScores, setUserScores] = React.useState<IScore[]>([]);

    React.useEffect(() => {
        axios.get(`/lk/info/${user?.id}`)
            .then((res) => res.data)
            .then((res) => {
                setUserScores(res.scores);
            });
    }, []);

    function handleChangeUser() {
        dispatch(update(userData));
    }

    function handleResetUser() {
        setUserData(user || {} as userType);
    }

    function handleChangeMode() {
        if(isEditing) {
            handleResetUser();
            setIsEditing(false);
        }
        else setIsEditing(true);
    }

    if(user === null) return <Navigate to="/auth"/>;
    return (
        <Layout>
            <div className={styles.profile}>
                <h1 className={styles.profile__title}>Профиль</h1>
                <h3 className={styles.profile__subtitle}>
                    <span>Информация о пользователе</span>
                    <EditOutlined onClick={handleChangeMode}/>
                </h3>
                <ul className={styles.info}>
                    <li className={styles.info__item}>
                        <h6 className={styles['info__item-name']}>Фамилия:</h6>
                        <div className={styles['info__item-input']}>
                            <input value={userData.lastName} className={styles['info__item-value']} disabled={!isEditing} onChange={e => setUserData(prev => ({...prev, lastName: e.target.value}))}/>
                            <span className={styles['info__item-error']}>{updateErrors.lastName}</span>
                        </div>
                    </li>
                    <li className={styles.info__item}>
                        <h6 className={styles['info__item-name']}>Имя:</h6>
                        <div className={styles['info__item-input']}>
                            <input value={userData.firstName} className={styles['info__item-value']} disabled={!isEditing} onChange={e => setUserData(prev => ({...prev, firstName: e.target.value}))}/>
                            <span className={styles['info__item-error']}>{updateErrors.firstName}</span>
                        </div>
                    </li>
                    <li className={styles.info__item}>
                        <h6 className={styles['info__item-name']}>Отчество:</h6>
                        <div className={styles['info__item-input']}>
                            <input value={userData.middleName} className={styles['info__item-value']} disabled={!isEditing} onChange={e => setUserData(prev => ({...prev, middleName: e.target.value}))}/>
                            <span className={styles['info__item-error']}>{updateErrors.middleName}</span>
                        </div>
                    </li>
                    <li className={styles.info__item}>
                        <h6 className={styles['info__item-name']}>E-mail:</h6>
                        <div className={styles['info__item-input']}>
                            <input type="email" value={userData.email} className={styles['info__item-value']} disabled={!isEditing} onChange={e => setUserData(prev => ({...prev, email: e.target.value}))}/>
                            <span className={styles['info__item-error']}>{updateErrors.email}</span>
                        </div>
                    </li>
                    <li className={styles.info__item}>
                        <h6 className={styles['info__item-name']}>Пароль:</h6>
                        <div className={styles['info__item-input']}>
                            <input value={userData.password} className={styles['info__item-value']} disabled={!isEditing} type={isEditing ? 'text' : 'password'} onChange={e => setUserData(prev => ({...prev, password: e.target.value}))}/>
                            <span className={styles['info__item-error']}>{updateErrors.password}</span>
                        </div>
                    </li>
                </ul>
                {isEditing 
                    && <div className={styles.buttons}>
                        <button className={styles.buttons__save} onClick={handleChangeUser}>Сохранить</button>
                        <button className={styles.buttons__reset} onClick={handleResetUser}>Отменить</button>
                    </div>
                }
                <span className={styles.profile__success}>{updateSuccessStatus}</span>

                <div className={styles.scores}>
                    <h3>Результаты тестирований по курсам:</h3>
                    {userScores.filter(score => score.testTitle && score.result).map(score => (
                        <p key={score.id}>{score.testTitle} - {score.result}</p>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Profile;