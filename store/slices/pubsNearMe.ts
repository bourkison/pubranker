import { supabase } from '@/services/supabase';
import { PubType } from '@/types';
import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from '@reduxjs/toolkit';
import * as Location from 'expo-location';

const pubsNearMeAdapter = createEntityAdapter();

const initialState = pubsNearMeAdapter.getInitialState({
    pubs: [] as PubType[],
    isLoading: false,
    moreToLoad: true,
    isLoadingMore: false,
});

export const fetchPubs = createAsyncThunk('pubsNearMe/fetchPubs', async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
        // TODO: Error.
        return;
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

    console.log(response.data.length);
});

const pubsNearMeSlice = createSlice({
    name: 'pubsNearMe',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchPubs.pending, state => {
            state.isLoading = true;
        });
    },
});

export const {} = pubsNearMeSlice.actions;
export default pubsNearMeSlice.reducer;
