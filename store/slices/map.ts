import {
    joinPolygons,
    hasFetchedPreviously,
    convertBoxToCoordinates,
} from '@/services/geo';
import { supabase } from '@/services/supabase';
import { BoundingBox, PubSchema, RejectWithValueType } from '@/types';
import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from '@reduxjs/toolkit';
import * as Location from 'expo-location';
import { RootState } from '..';
import * as turf from '@turf/turf';

const mapAdapter = createEntityAdapter();

const initialState = mapAdapter.getInitialState({
    pubs: [] as PubSchema[],
    isLoading: false,
    isLoadingMore: false,
    previouslyFetched: null as turf.helpers.Feature<
        turf.helpers.MultiPolygon | turf.helpers.Polygon
    > | null,
    currentSelected: null as turf.helpers.Feature<turf.helpers.Polygon> | null,
});

export const fetchMapPubs = createAsyncThunk<
    { pubs: PubSchema[]; requestedBox: BoundingBox[] },
    BoundingBox,
    { rejectValue: RejectWithValueType }
>('map/fetchMapPubs', async (boundingBox, { getState, rejectWithValue }) => {
    const state = getState() as RootState;

    let l = await Location.getCurrentPositionAsync();

    let geojson = hasFetchedPreviously(
        state.map.currentSelected,
        state.map.previouslyFetched,
    );

    if (!geojson) {
        return { pubs: [], requestedBox: [] };
    }

    const { data, error } = await supabase.rpc('pubs_in_polygon', {
        geojson: JSON.stringify(geojson.geometry),
        dist_lat: l.coords.latitude,
        dist_long: l.coords.longitude,
    });

    if (!data) {
        return rejectWithValue({ message: error.message, code: error.code });
    }

    return { pubs: data, requestedBox: [boundingBox] };
});

const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchMapPubs.pending, (state, action) => {
            state.isLoading = true;

            if (state.currentSelected) {
                state.previouslyFetched = joinPolygons(
                    state.currentSelected,
                    state.previouslyFetched,
                );
            }

            state.currentSelected = turf.polygon([
                convertBoxToCoordinates(action.meta.arg),
            ]);
        });
        builder.addCase(fetchMapPubs.fulfilled, (state, action) => {
            // Only add unique pubs.
            action.payload.pubs.forEach(pub => {
                if (state.pubs.findIndex(p => p.id === pub.id) === -1) {
                    state.pubs = [...state.pubs, pub];
                }
            });

            state.isLoading = false;
        });
        builder.addCase(fetchMapPubs.rejected, () => {
            console.error('Error fetching the map');
        });
    },
});

export default mapSlice.reducer;
