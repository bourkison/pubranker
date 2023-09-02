import { BoundingBox, PubSchema, RejectWithValueType } from '@/types';
import {
    PayloadAction,
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from '@reduxjs/toolkit';
import {
    Point,
    Feature,
    Polygon,
    MultiPolygon,
    point,
    polygon,
} from '@turf/helpers';
import { RootState } from '..';
import {
    convertBoxToCoordinates,
    hasFetchedPreviously,
    joinPolygons,
} from '@/services/geo';
import { supabase } from '@/services/supabase';
import * as Location from 'expo-location';

const mapAdapter = createEntityAdapter();

const initialState = mapAdapter.getInitialState({
    pubs: [] as { id: number; location: Point }[],
    selected: undefined as PubSchema | undefined,
    isLoadingSelected: false,
    previouslyFetched: null as Feature<MultiPolygon | Polygon> | null,
    currentSelected: null as Feature<Polygon> | null,
});

export const fetchMapPubs = createAsyncThunk<
    { pubs: { id: number; location: Point }[]; requestedBox: BoundingBox[] },
    BoundingBox,
    { rejectValue: RejectWithValueType }
>('map/fetchMapPubs', async (boundingBox, { getState, rejectWithValue }) => {
    const state = getState() as RootState;

    const geojson = hasFetchedPreviously(
        state.map.currentSelected,
        state.map.previouslyFetched,
    );

    if (!geojson) {
        return { pubs: [], requestedBox: [] };
    }

    const { data, error } = await supabase
        .rpc('pubs_in_polygon', {
            geojson: JSON.stringify(geojson.geometry),
        })
        .select('id, location');

    if (error) {
        return rejectWithValue({ message: error.message, code: error.code });
    }

    const filteredData = data
        .filter(d => d.location !== null)
        .map(d => ({
            ...d,
            location: point(JSON.parse(d.location || '')).geometry,
        }));

    return {
        pubs: filteredData,
        requestedBox: [boundingBox],
    };
});

export const selectPub = createAsyncThunk<
    PubSchema,
    number,
    { rejectValue: RejectWithValueType }
>('map/selectPub', async (pubId, { getState, rejectWithValue }) => {
    const state = getState() as RootState;

    const exploreIndex = state.explore.pubs.findIndex(pub => pub.id === pubId);

    if (exploreIndex > -1) {
        return state.explore.pubs[exploreIndex];
    }

    const l = await Location.getCurrentPositionAsync();

    const { data, error } = await supabase
        .rpc('get_pub', {
            dist_lat: l.coords.latitude,
            dist_long: l.coords.longitude,
        })
        .eq('id', pubId)
        .limit(1)
        .single();

    if (error) {
        return rejectWithValue({
            message: error.message,
            code: error.code,
        });
    }

    return data;
});

const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        deselectPub(state) {
            state.selected = undefined;
            state.isLoadingSelected = false;
        },
        addPubsToMap(
            state,
            action: PayloadAction<{ id: number; location: Point }[]>,
        ) {
            console.log('ADDING PUBS TO MAP', action.payload.length);

            action.payload.forEach(pub => {
                // Only add unique pubs.
                if (state.pubs.findIndex(p => p.id === pub.id) === -1) {
                    state.pubs = [...state.pubs, pub];
                }
            });
        },
    },
    extraReducers: builder => {
        builder.addCase(fetchMapPubs.pending, (state, action) => {
            if (state.currentSelected) {
                state.previouslyFetched = joinPolygons(
                    state.currentSelected,
                    state.previouslyFetched,
                );
            }

            state.currentSelected = polygon([
                convertBoxToCoordinates(action.meta.arg),
            ]);
        });

        builder.addCase(fetchMapPubs.fulfilled, (state, action) => {
            action.payload.pubs.forEach(pub => {
                // Only add unique pubs.
                if (state.pubs.findIndex(p => p.id === pub.id) === -1) {
                    state.pubs = [...state.pubs, pub];
                }
            });
        });

        builder.addCase(selectPub.pending, state => {
            state.isLoadingSelected = true;
        });

        builder.addCase(selectPub.fulfilled, (state, action) => {
            state.isLoadingSelected = false;
            state.selected = action.payload;
        });

        builder.addCase(selectPub.rejected, state => {
            state.isLoadingSelected = false;
        });
    },
});

export const { deselectPub, addPubsToMap } = mapSlice.actions;
export default mapSlice.reducer;
