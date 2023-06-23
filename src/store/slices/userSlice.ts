import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export type userType = {
    id: number,
    firstName: string,
    lastName: string,
    middleName: string,
    birthDate: Date,
    email: string,
    password: string,
    gender: 'MALE' | 'FEMALE' | 'NON_BINARY',
};

export type userLoginType = Pick<userType, 'email' | 'password'>

const login = createAsyncThunk(
    'user/login',
    async (data: userLoginType, {rejectWithValue}) => {
        const res = await axios.post('/login', data)
            .then(res => res.data)
            .then(res => {
                return res;
            })
            .catch(e => {
                return rejectWithValue(e.response?.data);
            });
        return res;
    }
);

const registrate = createAsyncThunk(
    'user/registrate',
    async (data: Omit<userType, 'id'>, {rejectWithValue}) => {
        const formattedMonth = data.birthDate.getMonth() + 1 > 9 ? data.birthDate.getMonth() + 1 : `0${data.birthDate.getMonth() + 1}`;
        const formattedDay = data.birthDate.getDate() > 9 ? data.birthDate.getDate() : `0${data.birthDate.getDate()}`;
        const formattedDate = `${data.birthDate.getFullYear()}-${formattedMonth}-${formattedDay}`;
        const res = await axios.post('/registration', {...data, birthDate: formattedDate})
            .then(res => res.data)
            .then(res => {
                return res;
            })
            .catch(e => {
                return rejectWithValue(e.response?.data);
            });
        return res;
    }
);

const update = createAsyncThunk(
    'user/update',
    async (data: userType, {rejectWithValue}) => {
        const res = await axios.put('/user', data)
            .then(res => res.data)
            .then(() => {
                return data;
            })
            .catch((e) => {
                return rejectWithValue(e.response?.data);
            });
        return res;
    }
);

type userSliceType = {
    user: userType | null,
    userId: number | null,
    loginError: string,
    registrationError: string,
    registrationErrors: Partial<Record<keyof userType, string>>
    updateErrors: Partial<Record<keyof userType, string>>,
    updateSuccessStatus: string
}


const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        userId: null,
        loginError: '',
        registrationError: '',
        registrationErrors: {},
        updateErrors: {},
        updateSuccessStatus: ''
    } as userSliceType,
    reducers: {
        logout(state) {
            state.user = null;
            state.userId = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action: PayloadAction<userType>) => {
            state.user = action.payload;
            state.loginError = '';
        });
        builder.addCase(login.rejected, (state, action) => {
            state.user = null;
            state.loginError = String(action.payload);
        });
        builder.addCase(update.fulfilled, (state, action: PayloadAction<userType>) => {
            state.user = action.payload;
            state.updateErrors = {};
            state.updateSuccessStatus = 'Вы успешно обновили данные!';
        });
        builder.addCase(update.rejected, (state, action) => {
            const castedArr = action.payload as {[k: string]: string}[];
            const errorsObj = castedArr.reduce((a, v) => ({...a, [Object.keys(v)[0]]: v[Object.keys(v)[0]]}), {});
            state.updateErrors = errorsObj;
            state.updateSuccessStatus = '';
        });
        builder.addCase(registrate.fulfilled, (state, action: PayloadAction<number>) => {
            state.userId = action.payload;
            state.registrationError = '';
            state.registrationErrors = {};
        });
        builder.addCase(registrate.rejected, (state, action) => {
            if(Array.isArray(action.payload)) {
                const castedArr = action.payload as {[k: string]: string}[];
                const errorsObj = castedArr.reduce((a, v) => ({...a, [Object.keys(v)[0]]: Object.keys(a).includes(Object.keys(v)[0]) ? `${a[Object.keys(v)[0]]}. ${v[Object.keys(v)[0]]}` : v[Object.keys(v)[0]]}), {});
                state.registrationErrors = errorsObj;
            }
            else {
                state.registrationError = 'Ошибка на сервере';
            }
        });
    }
});

export default userSlice.reducer;
export const {logout} = userSlice.actions;
export {login, update, registrate};
