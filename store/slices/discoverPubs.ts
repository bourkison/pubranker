import { mapArrResponseToPubType } from '@/services';
import { supabase } from '@/services/supabase';
import { PubType } from '@/types';
import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from '@reduxjs/toolkit';
import * as Location from 'expo-location';

const discoverPubsAdapter = createEntityAdapter();

const initialState = discoverPubsAdapter.getInitialState({
    pubs: [] as PubType[],
    isLoading: false,
    moreToLoad: true,
    isLoadingMore: false,
});

export const fetchPubs = createAsyncThunk(
    'discoverPubs/fetchPubs',
    async ({ amount }: { amount: number }): Promise<PubType[]> => {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            // TODO: Error.
            throw new Error('No location granted');
        }

        let l = await Location.getCurrentPositionAsync();
        const response = await supabase
            .rpc('nearby_pubs', {
                order_lat: l.coords.latitude,
                order_long: l.coords.longitude,
                dist_lat: l.coords.latitude,
                dist_long: l.coords.longitude,
            })
            .limit(amount);

        console.log(response.data[0]);

        return mapArrResponseToPubType(response.data);
    },
);

const discoverPubsSlice = createSlice({
    name: 'discoverPubs',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchPubs.pending, state => {
                state.isLoading = true;
            })
            .addCase(fetchPubs.fulfilled, (state, action) => {
                state.pubs = action.payload;
            });
    },
});

export const {} = discoverPubsSlice.actions;
export default discoverPubsSlice.reducer;
