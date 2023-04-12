import { DiscoveredPub, NearbyPub } from '@/types';
import {
    createEntityAdapter,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';

const pubAdapter = createEntityAdapter();

export type BottomBarState = 'hidden' | 'preview' | 'expanded';
type SelectedPubReference = 'map' | 'discover';

const initialState = pubAdapter.getInitialState({
    selectedPubReference: null as SelectedPubReference | null,
    selectedPub: null as DiscoveredPub | NearbyPub | null,
});

const pubSlice = createSlice({
    name: 'pub',
    initialState,
    reducers: {
        setPub(
            state,
            action: PayloadAction<{
                pub: DiscoveredPub | NearbyPub;
                reference: SelectedPubReference;
            }>,
        ) {
            state.selectedPub = action.payload.pub;
            state.selectedPubReference = action.payload.reference;
        },
        deselectPub(state) {
            state.selectedPub = null;
            state.selectedPubReference = null;
        },
        toggleSave(state) {
            if (state.selectedPub) {
                state.selectedPub.saved = !state.selectedPub.saved;
            }
        },
    },
});

export const { setPub, deselectPub, toggleSave } = pubSlice.actions;
export default pubSlice.reducer;
