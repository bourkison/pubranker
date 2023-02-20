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
    bottomBarState: 'hidden' as BottomBarState,
    selectedPub: null as PubType | null,
    isAnimating: false,
});

const pubSlice = createSlice({
    name: 'pub',
    initialState,
    reducers: {
        setPub(state, action: PayloadAction<PubType | null>) {
            state.bottomBarType =
                action.payload !== null ? 'selected' : 'discover';
            state.selectedPub = action.payload;
            state.bottomBarState = 'preview';
        },
        setBottomBarState(state, action: PayloadAction<BottomBarState>) {
            state.bottomBarState = action.payload;
        },
        setAnimating(state, action: PayloadAction<boolean>) {
            state.isAnimating = action.payload;
        },
    },
});

export const { setPub, setBottomBarState, setAnimating } = pubSlice.actions;
export default pubSlice.reducer;
