import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/store/slices/user';
import pubReducer from '@/store/slices/pub';
import discoverReducer from '@/store/slices/discover';
import savedReducer from '@/store/slices/saved';
import mapReducer from '@/store/slices/map';
import exploreReducer from '@/store/slices/explore';

const store = configureStore({
    reducer: {
        user: userReducer,
        pub: pubReducer,
        discover: discoverReducer,
        saved: savedReducer,
        map: mapReducer,
        explore: exploreReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type.
export type AppDispatch = typeof store.dispatch;

export default store;
