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

const mapAdapter = createEntityAdapter();

const initialState = mapAdapter.getInitialState({
    pubs: [] as { id: number; location: Point }[],
    selected: undefined as PubSchema | undefined,
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

const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        selectPub(state, action: PayloadAction<PubSchema | undefined>) {
            state.selected = action.payload;
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
    },
});

export const { selectPub } = mapSlice.actions;
export default mapSlice.reducer;
