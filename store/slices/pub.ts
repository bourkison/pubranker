import { PubType } from '@/types';
import {
    createEntityAdapter,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';

const pubAdapter = createEntityAdapter();

const initialState = pubAdapter.getInitialState({
    bottomBarType: 'discover' as 'selected' | 'discover' | 'search',
    selectedPub: null as PubType | null,
});

const pubSlice = createSlice({
    name: 'pub',
    initialState,
    reducers: {
        selectPub(state, action: PayloadAction<PubType | null>) {
            state.bottomBarType =
                action.payload !== null ? 'selected' : 'discover';
            state.selectedPub = action.payload;
        },
    },
});

export const { selectPub } = pubSlice.actions;
export default pubSlice.reducer;
