import React from 'react';
import { Navigate } from 'react-router';
import * as yup from 'yup';
import { useForm, SubmitHandler, SubmitErrorHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Input from '../../../../components/Input/Input';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import {login} from '../../../../store/slices/userSlice';
import styles from './styles.module.scss';
import Checkbox from '../../../../components/Checkbox/Checkbox';

interface LoginValues {
    email: string,
    password: string
}

const schema = yup.object({
    email: yup.string().email().required('Это поле обязательно!'),
    password: yup.string().required('Это поле обязательно!')
}).required();

const defaultValues = {
    email: '',
    password: ''
};

const Login = () => {

    const [showPassword, setShowPassword] = React.useState(false);

    const {user, loginError} = useAppSelector(state => state.user);
    const { handleSubmit, control, formState: { errors } } = useForm<LoginValues>({
        defaultValues,
        resolver: yupResolver(schema)
    });
    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<LoginValues> = (data) => {
        dispatch(login(data));
    };

    const onError: SubmitErrorHandler<LoginValues> = (error) => {
        console.log(error);
    };



    if(user) return <Navigate to="/cabinet" />;
    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit, onError)}>
            <h6 className={styles.form__title}>Вход</h6>
            <Controller
                name="email"
                control={control}
                render={({ field }) => <Input isRequired={true} labelText="E-mail" placeholder="Введите e-mail" error={errors.email?.message} {...field} />}
            />
            <Controller
                name="password"
                control={control}
                render={({ field }) => <Input isRequired={true} type={showPassword ? 'text' : 'password'} labelText="Пароль" placeholder="Введите пароль" error={errors.password?.message} {...field} />}
            />
            <Checkbox labelText='Показать пароль' checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)}/>
            <button type="submit" className={styles.form__submit}>Войти</button>
            {loginError && <span className={styles.form__error}>{loginError}</span>}
        </form>
    );
};

export default Login;
