import React from 'react';
import { Navigate } from 'react-router';
import * as yup from 'yup';
import { useForm, SubmitHandler, SubmitErrorHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Input from '../../../../components/Input/Input';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import {registrate} from '../../../../store/slices/userSlice';
import styles from './styles.module.scss';
import DatePicker from '../../../../components/DatePicker/DatePicker';
import { genderOptions } from './data';
import Select from '../../../../components/Select/Select';
import Checkbox from '../../../../components/Checkbox/Checkbox';

interface RegistrateValues {
    firstName: string,
    lastName: string,
    middleName: string,
    birthDate: Date,
    email: string,
    password: string,
    gender: 'MALE' | 'FEMALE' | 'NON_BINARY'
}

const schema = yup.object({
    firstName: yup.string().required('Это поле обязательно!'),
    lastName: yup.string().required('Это поле обязательно!'),
    middleName: yup.string(),
    birthDate: yup.date().required('Это поле обязательно!'),
    email: yup.string().email().required('Это поле обязательно!'),
    password: yup.string().required('Это поле обязательно!'),
    gender: yup.string().required('Это поле обязательно!').test(function(value: string | undefined) {
        return value ? ['MALE', 'FEMALE', 'NON_BINARY'].includes(value) : false;
    })
}).required();

const defaultValues: RegistrateValues = {
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: new Date(),
    email: '',
    password: '',
    gender: 'MALE'
};

const Registrate = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    
    const {user, registrationError, registrationErrors} = useAppSelector(state => state.user);
    const { handleSubmit, control, formState: { errors } } = useForm<RegistrateValues>({
        defaultValues,
        resolver: yupResolver(schema)
    });
    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<RegistrateValues> = (data) => {
        dispatch(registrate(data));
    };

    const onError: SubmitErrorHandler<RegistrateValues> = (error) => {
        console.log(error);
    };

    if(user) return <Navigate to="/cabinet" />;
    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit, onError)}>
            <h6 className={styles.form__title}>Регистрация</h6>
            <Controller
                name="firstName"
                control={control}
                render={({ field }) => <Input isRequired={true} labelText="Имя" placeholder="Введите имя" error={errors.firstName?.message || registrationErrors.firstName} {...field} />}
            />
            <Controller
                name="lastName"
                control={control}
                render={({ field }) => <Input isRequired={true} labelText="Фамилия" placeholder="Введите фамилию" error={errors.lastName?.message || registrationErrors.lastName} {...field} />}
            />
            <Controller
                name="middleName"
                control={control}
                render={({ field }) => <Input isRequired={false} labelText="Отчество" placeholder="Введите отчество" error={errors.middleName?.message || registrationErrors.middleName} {...field} />}
            />
            <Controller
                name="birthDate"
                control={control}
                render={({ field }) => <DatePicker isRequired={true} labelText="Дата рождения" error={errors.password?.message || registrationErrors.birthDate} {...field} />}
            />
            <Controller
                name="gender"
                control={control}
                render={({ field}) => <Select {...field} labelText={'Пол'} isRequired={true} options={genderOptions} error={errors.gender?.message || registrationErrors.gender} />}
            />
            <Controller
                name="email"
                control={control}
                render={({ field }) => <Input isRequired={true} labelText="E-mail" placeholder="Введите e-mail" error={errors.email?.message || registrationErrors.email} {...field} />}
            />
            <Controller
                name="password"
                control={control}
                render={({ field }) => <Input isRequired={true} type={showPassword ? 'text' : 'password'} labelText="Пароль" placeholder="Введите пароль" error={errors.password?.message || registrationErrors.password} {...field} />}
            />
            <Checkbox labelText='Показать пароль' checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)}/>
            <button type="submit" className={styles.form__submit}>Зарегистрироваться</button>
            {registrationError && <span className={styles.form__error}>{registrationError}</span>}
        </form>
    );
};

export default Registrate;
