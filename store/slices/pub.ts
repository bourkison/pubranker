import { PubType } from '@/types';
import {
    createEntityAdapter,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';

const pubAdapter = createEntityAdapter();

export type BottomBarState = 'hidden' | 'preview' | 'expanded';

const initialState = pubAdapter.getInitialState({
    bottomBarType: 'discover' as 'selected' | 'discover' | 'search',
    selectedPub: null as PubType | null,
});

const pubSlice = createSlice({
    name: 'pub',
    initialState,
    reducers: {
        setPub(state, action: PayloadAction<PubType>) {
            state.bottomBarType = 'selected';
            state.selectedPub = action.payload;
        },
        deselectPub(state) {
            state.bottomBarType = 'discover';
            state.selectedPub = null;
        },
    },
});

export const { setPub, deselectPub } = pubSlice.actions;
export default pubSlice.reducer;
