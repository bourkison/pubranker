import { convertPointStringToObject } from '@/services';
import {
    joinPolygons,
    hasFetchedPreviously,
    convertBoxToCoordinates,
} from '@/services/geo';
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
    isLoading: false,
    isLoadingMore: false,
    previouslyFetched: null as turf.helpers.Feature<
        turf.helpers.MultiPolygon | turf.helpers.Polygon
    > | null,
    currentSelected: null as turf.helpers.Feature<turf.helpers.Polygon> | null,
});

export const fetchMapPubs = createAsyncThunk<
    { pubs: PubType[]; requestedBox: BoundingBox[] },
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

    console.log('data', data, error);

    if (!data) {
        console.error(error);
        return rejectWithValue({ message: error.message, code: error.code });
    }

    let promises: Promise<PubType>[] = [];

    data.forEach((pub: any) => {
        promises.push(
            new Promise(async resolve => {
                const [photos, openingHours] = await Promise.all([
                    supabase.from('pub_photos').select().eq('pub_id', pub.id),
                    supabase
                        .from('opening_hours')
                        .select()
                        .eq('pub_id', pub.id),
                ]);

                console.log('OPENING HOURS:', openingHours, pub.id);

                resolve({
                    id: pub.id,
                    name: pub.name,
                    address: pub.address,
                    location: convertPointStringToObject(pub.location),
                    opening_hours:
                        openingHours.data?.map(oh => ({
                            open: { day: oh.open_day, time: oh.open_hour },
                            close: { day: oh.close_day, time: oh.close_hour },
                        })) || [],
                    phone_number: pub.phone_number,
                    google_id: '', // TODO: fix up google_id
                    google_overview: pub.google_overview,
                    google_rating: pub.google_rating,
                    google_ratings_amount: pub.google_ratings_amount,
                    website: pub.website,
                    dist_meters: pub.dist_meters,
                    photos: photos.data?.map(photo => photo.key) || [],
                    reservable: pub.reservable,
                });
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
