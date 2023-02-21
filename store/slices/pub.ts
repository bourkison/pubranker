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
        setPub(state, action: PayloadAction<PubType>) {
            if (
                action.payload &&
                state.selectedPub?.id === action.payload.id &&
                state.bottomBarState === 'preview'
            ) {
                state.bottomBarState = 'expanded';
                return;
            }

            state.bottomBarType = 'selected';
            state.selectedPub = action.payload;
            state.bottomBarState = 'preview';
        },
        deselectPub(state) {
            state.bottomBarType = 'discover';
            state.selectedPub = null;
            state.bottomBarState = 'hidden';
        },
        setBottomBarState(state, action: PayloadAction<BottomBarState>) {
            state.bottomBarState = action.payload;
        },
        setAnimating(state, action: PayloadAction<boolean>) {
            state.isAnimating = action.payload;
        },
    },
});

export const { setPub, setBottomBarState, setAnimating, deselectPub } =
    pubSlice.actions;
export default pubSlice.reducer;
