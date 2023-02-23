import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/store/slices/user';
import pubReducer from '@/store/slices/pub';
import discoverReducer from '@/store/slices/discover';
import mapReducer from '@/store/slices/map';

const store = configureStore({
    reducer: {
        user: userReducer,
        pub: pubReducer,
        discover: discoverReducer,
        map: mapReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type.
export type AppDispatch = typeof store.dispatch;

export default store;
