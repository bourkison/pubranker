import { convertPointStringToObject } from '@/services';
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
    const response = await supabase.rpc('nearby_pubs', {
        lat: l.coords.latitude,
        long: l.coords.longitude,
    });

    console.log(convertPointStringToObject(response.data[0].location));
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
