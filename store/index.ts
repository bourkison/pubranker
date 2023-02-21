import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/store/slices/user';
import pubReducer from '@/store/slices/pub';
import pubsNearMeReducer from '@/store/slices/pubsNearMe';

const store = configureStore({
    reducer: {
        user: userReducer,
        pub: pubReducer,
        pubsNearMe: pubsNearMeReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type.
export type AppDispatch = typeof store.dispatch;

export default store;
