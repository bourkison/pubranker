import { TReview } from '@/components/Pubs/Review';
import { SelectedPub } from '@/nav/BottomSheetNavigator';
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
    selectedPub: null as SelectedPub | null,
    selectedPubReviews: [] as TReview[],
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
            state.selectedPubReviews = [];
        },
        deselectPub(state) {
            state.selectedPub = null;
            state.selectedPubReference = null;
            state.selectedPubReviews = [];
        },
        setReviews(state, action: PayloadAction<TReview[]>) {
            state.selectedPubReviews = action.payload;
        },
        addReview(state, action: PayloadAction<TReview>) {
            state.selectedPubReviews.unshift(action.payload);
        },
        deleteReview(state, action: PayloadAction<number>) {
            state.selectedPubReviews = state.selectedPubReviews.filter(
                r => r.review.id !== action.payload,
            );
        },
        editReview(state, action: PayloadAction<TReview>) {
            const index = state.selectedPubReviews.findIndex(
                r => r.review.id === action.payload.review.id,
            );

            if (index > -1) {
                state.selectedPubReviews[index] = action.payload;
            }
        },
        toggleSave(state) {
            if (state.selectedPub) {
                state.selectedPub.saved = !state.selectedPub.saved;
            }
        },
    },
});

export const {
    setPub,
    deselectPub,
    toggleSave,
    setReviews,
    addReview,
    editReview,
    deleteReview,
} = pubSlice.actions;
export default pubSlice.reducer;
