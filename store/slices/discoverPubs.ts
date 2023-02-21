import { convertPointStringToObject } from '@/services';
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
    async (): Promise<PubType[]> => {
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
            .limit(10);

        return response.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            address: p.address,
            location: convertPointStringToObject(p.location),
            opening_hours: p.opening_hours,
            phone_number: p.phone_number,
            google_overview: p.google_overview,
            google_photos: p.google_photos,
            google_rating: p.google_rating,
            google_ratings_amount: p.google_ratings_amount,
            google_id: p.google_id,
            reservable: p.reservable,
            website: p.website,
            photos: [
                '56/star_hd_1.png',
                '56/star_hd_2.png',
                '56/star_hd_3.png',
                '56/star_hd_4.png',
                '56/star_hd_5.png',
                '56/star_hd_6.png',
            ],
        }));
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
