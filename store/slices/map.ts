import {
    convertBoxToCoordinates,
    forcePubType,
    hasFetchedPreviously,
    joinPolygons,
} from '@/services';
import { supabase } from '@/services/supabase';
import { BoundingBox, PubType, RejectWithValueType } from '@/types';
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
    pubs: [] as PubType[],
    previouslyFetched: [] as BoundingBox[],
    isLoading: false,
    isLoadingMore: false,
    previouslyFetchedPolygon: null as turf.helpers.Feature<
        turf.helpers.MultiPolygon | turf.helpers.Polygon
    > | null,
    currentSelectedPolygon:
        null as turf.helpers.Feature<turf.helpers.Polygon> | null,
});

export const fetchMapPubs = createAsyncThunk<
    { pubs: PubType[]; requestedBox: BoundingBox[] },
    BoundingBox,
    { rejectValue: RejectWithValueType }
>('map/fetchMapPubs', async (boundingBox, { getState }) => {
    const state = getState() as RootState;

    if (hasFetchedPreviously(boundingBox, state.map.previouslyFetched)) {
        return { pubs: [], requestedBox: [] };
    }

    const { minLat, minLong, maxLat, maxLong } = boundingBox;

    let l = await Location.getCurrentPositionAsync();

    const response = await supabase.rpc('pubs_in_range', {
        min_lat: minLat,
        min_long: minLong,
        max_lat: maxLat,
        max_long: maxLong,
        dist_lat: l.coords.latitude,
        dist_long: l.coords.longitude,
    });

    let promises: Promise<PubType>[] = [];

    response.data.forEach((pub: any) => {
        promises.push(
            new Promise(async resolve => {
                const photo = await supabase
                    .from('pub_photos')
                    .select()
                    .eq('pub_id', pub.id);

                resolve(forcePubType(pub, photo.data));
            }),
        );
    });

    return { pubs: await Promise.all(promises), requestedBox: [boundingBox] };
});

const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchMapPubs.pending, state => {
            state.isLoading = true;
        });
        builder.addCase(fetchMapPubs.fulfilled, (state, action) => {
            // Only add unique pubs.
            action.payload.pubs.forEach(pub => {
                if (state.pubs.findIndex(p => p.id === pub.id) === -1) {
                    state.pubs = [...state.pubs, pub];
                }
            });

            state.previouslyFetched = [
                ...state.previouslyFetched,
                ...action.payload.requestedBox,
            ];

            if (state.currentSelectedPolygon) {
                state.previouslyFetchedPolygon = joinPolygons(
                    state.currentSelectedPolygon,
                    state.previouslyFetchedPolygon,
                );
            }

            state.currentSelectedPolygon = turf.polygon([
                convertBoxToCoordinates(action.meta.arg),
            ]);

            state.isLoading = false;
        });
        builder.addCase(fetchMapPubs.rejected, () => {
            console.error('Error fetching the map');
        });
    },
});

export default mapSlice.reducer;
