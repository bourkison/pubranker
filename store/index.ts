import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/store/slices/user';
import pubReducer from '@/store/slices/pub';

const store = configureStore({
    reducer: {
        user: userReducer,
        pub: pubReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type.
export type AppDispatch = typeof store.dispatch;

export default store;
