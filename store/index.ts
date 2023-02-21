import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/store/slices/user';
import pubReducer from '@/store/slices/pub';
import discoverPubsReducer from '@/store/slices/discoverPubs';

const store = configureStore({
    reducer: {
        user: userReducer,
        pub: pubReducer,
        discoverPubs: discoverPubsReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type.
export type AppDispatch = typeof store.dispatch;

export default store;
