import { TReview } from '@/components/Pubs/Review';
import { supabase } from '@/services/supabase';
import { RejectWithValueType } from '@/types';
import { Database } from '@/types/schema';
import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';
import * as Location from 'expo-location';

const pubAdapter = createEntityAdapter();

export type BottomBarState = 'hidden' | 'preview' | 'expanded';
export type SelectedPub =
    Database['public']['Functions']['get_pub']['Returns'][number];

const initialState = pubAdapter.getInitialState({
    isLoading: 0, // Set to ID of pub we're loading.
    selectedPub: null as SelectedPub | null,
    selectedPubReviews: [] as TReview[],
});

export const setPub = createAsyncThunk<
    SelectedPub,
    { id: number },
    { rejectValue: RejectWithValueType }
>('pub/loadPub', async ({ id }, { rejectWithValue }) => {
    const currentLocation = await Location.getCurrentPositionAsync();

    const { data, error } = await supabase
        .rpc('get_pub', {
            input_id: id,
            dist_lat: currentLocation.coords.latitude,
            dist_long: currentLocation.coords.longitude,
        })
        .limit(1)
        .single();

    if (error || !data) {
        // TODO: Handle error
        console.error(error);
        return rejectWithValue({
            message: error.message,
            code: error.code,
        });
    }

    return data;
});

const pubSlice = createSlice({
    name: 'pub',
    initialState,
    reducers: {
        deselectPub(state) {
            state.selectedPub = null;
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
    extraReducers: builder => {
        builder
            .addCase(setPub.pending, (state, action) => {
                state.isLoading = action.meta.arg.id;
                state.selectedPubReviews = [];
                state.selectedPub = null;
            })
            .addCase(setPub.fulfilled, (state, action) => {
                state.isLoading = 0;
                state.selectedPub = action.payload;
            });
    },
});

export const {
    deselectPub,
    toggleSave,
    setReviews,
    addReview,
    editReview,
    deleteReview,
} = pubSlice.actions;
export default pubSlice.reducer;
