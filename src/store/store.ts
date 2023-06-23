import { combineReducers, configureStore, PreloadedState } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userSlice from './slices/userSlice';

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['user']
};

const userConfig = {
    key: 'tracking',
    storage,
    blacklist: ['loginError', 'registrationError', 'registrationErrors', 'updateErrors', 'updateSuccessStatus']
};

const rootReducer = combineReducers({
    user: persistReducer(userConfig, userSlice)
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        })
});
const persistor = persistStore(store);

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState,
    });
};
export type AppStore = ReturnType<typeof setupStore>;

export type RootState = ReturnType<typeof rootReducer>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type appDispatch = typeof store.dispatch
export const useAppDispatch: () => appDispatch = useDispatch;

export {store, persistor};