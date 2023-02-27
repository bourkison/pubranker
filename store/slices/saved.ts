import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from '@reduxjs/toolkit';
import { RejectWithValueType, SavedPub } from '@/types';
import * as Location from 'expo-location';
import { supabase } from '@/services/supabase';

const savedAdapter = createEntityAdapter();

const initialState = savedAdapter.getInitialState({
    pubs: [] as SavedPub[],
    isLoading: false,
    moreToLoad: true,
    isLoadingMore: false,
    isRefreshing: false,
});

export const fetchSavedPubs = createAsyncThunk<
    SavedPub[],
    { amount: number; id: string; refreshing: boolean },
    { rejectValue: RejectWithValueType }
>('saved/fetchSavedPubs', async ({ amount, id }, { rejectWithValue }) => {
    const currentLocation = await Location.getCurrentPositionAsync();

    const { data, error } = await supabase
        .rpc('saved_pubs', {
            input_id: id,
            dist_lat: currentLocation.coords.latitude,
            dist_long: currentLocation.coords.longitude,
        })
        .limit(amount);

    if (!data) {
        return rejectWithValue({
            message: error.message,
            code: error.code,
        });
    }

    return data;
});

const savedSlice = createSlice({
    name: 'saved',
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(fetchSavedPubs.pending, (state, action) => {
                if (!action.meta.arg.refreshing) {
                    state.isLoading = true;
                } else {
                    state.isRefreshing = true;
                }
            })
            .addCase(fetchSavedPubs.fulfilled, (state, action) => {
                state.pubs = action.payload;
                state.isLoading = false;
                state.isRefreshing = false;
            }),
});

export const {} = savedSlice.actions;
export default savedSlice.reducer;
