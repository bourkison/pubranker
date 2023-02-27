import { applyFilters, convertPointStringToObject } from '@/services';
import { supabase } from '@/services/supabase';
import { BoolOrUnset, PubFilters, PubType, RejectWithValueType } from '@/types';
import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';
import * as Location from 'expo-location';
import { RootState } from '@/store';

const discoverAdapter = createEntityAdapter();

const initialState = discoverAdapter.getInitialState({
    pubs: [] as PubType[],
    isLoading: false,
    moreToLoad: true,
    isLoadingMore: false,
    searchText: '',
    filters: {
        dogFriendly: 'unset',
        liveSport: 'unset',
        darts: 'unset',
        pool: 'unset',
        sundayRoast: 'unset',
        garden: 'unset',
        kidFriendly: 'unset',
        liveMusic: 'unset',
        boardGames: 'unset',
        freeWifi: 'unset',
        roof: 'unset',
        foosball: 'unset',
        wheelchairAccessible: 'unset',
    } as PubFilters,
});

const queryDb = async (
    amount: number,
    filters: PubFilters,
    searchText: string,
    skip?: number,
): Promise<PubType[]> => {
    const currentLocation = await Location.getCurrentPositionAsync();

    let query = supabase.rpc('nearby_pubs', {
        order_lat: currentLocation.coords.latitude,
        order_long: currentLocation.coords.longitude,
        dist_lat: currentLocation.coords.latitude,
        dist_long: currentLocation.coords.longitude,
    });

    query = applyFilters(query, filters, searchText);

    const from = skip || 0;
    const to = amount + from;

    const response = await query.range(from, to);

    if (response.data && response.data.length) {
        let promises: Promise<PubType>[] = [];

        response.data.forEach(pub => {
            promises.push(
                new Promise(async resolve => {
                    const [photos, openingHours] = await Promise.all([
                        supabase
                            .from('pub_photos')
                            .select()
                            .eq('pub_id', pub.id),
                        supabase
                            .from('opening_hours')
                            .select()
                            .eq('pub_id', pub.id),
                    ]);

                    resolve({
                        id: pub.id,
                        name: pub.name,
                        address: pub.address,
                        location: convertPointStringToObject(pub.location),
                        opening_hours:
                            openingHours.data?.map(oh => ({
                                open: { day: oh.open_day, time: oh.open_hour },
                                close: {
                                    day: oh.close_day,
                                    time: oh.close_hour,
                                },
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

        return await Promise.all(promises);
    } else {
        throw new Error('No response');
    }
};

export const fetchDiscoverPubs = createAsyncThunk<
    PubType[],
    { amount: number },
    { rejectValue: RejectWithValueType }
>(
    'discover/fetchDiscoverPubs',
    async ({ amount }, { getState, rejectWithValue }) => {
        const state = getState() as RootState;

        try {
            const pubs = await queryDb(
                amount,
                state.discover.filters,
                state.discover.searchText,
                0,
            );

            return pubs;
        } catch (err: any) {
            return rejectWithValue({
                message: err?.message,
                code: err?.statusCode,
            });
        }
    },
);

export const fetchMoreDiscoverPubs = createAsyncThunk<
    PubType[],
    { amount: number },
    { rejectValue: RejectWithValueType }
>(
    'discover/fetchMoreDiscoverPubs',
    async ({ amount }, { getState, rejectWithValue }) => {
        const state = getState() as RootState;

        try {
            const pubs = await queryDb(
                amount,
                state.discover.filters,
                state.discover.searchText,
                state.discover.pubs.length,
            );

            return pubs;
        } catch (err: any) {
            return rejectWithValue({
                message: err?.message,
                code: err?.statusCode,
            });
        }
    },
);

const discoverSlice = createSlice({
    name: 'discover',
    initialState,
    reducers: {
        setSearchText(state, action: PayloadAction<string>) {
            state.searchText = action.payload;
        },
        setFilter(
            state,
            action: PayloadAction<{ key: keyof PubFilters; val: BoolOrUnset }>,
        ) {
            state.filters[action.payload.key] = action.payload.val;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchDiscoverPubs.pending, state => {
                state.isLoading = true;
                state.isLoadingMore = false;
                state.moreToLoad = true;
                state.pubs = [];
            })
            .addCase(fetchDiscoverPubs.fulfilled, (state, action) => {
                state.pubs = action.payload;
                state.isLoading = false;
                state.isLoadingMore = false;
            })
            .addCase(fetchDiscoverPubs.rejected, (state, { meta, payload }) => {
                // TODO: handle errors.
                console.error('Error fetching pubs', meta, payload);
                state.moreToLoad = false;
                state.isLoadingMore = false;
                state.isLoading = false;
            })
            .addCase(fetchMoreDiscoverPubs.pending, state => {
                state.isLoadingMore = true;
            })
            .addCase(fetchMoreDiscoverPubs.fulfilled, (state, action) => {
                state.pubs = [...state.pubs, ...action.payload];
                state.isLoadingMore = false;
                state.moreToLoad = true;
            })
            .addCase(fetchMoreDiscoverPubs.rejected, state => {
                state.moreToLoad = false;
                state.isLoadingMore = false;
                state.isLoading = false;
            });
    },
});

export const { setSearchText, setFilter } = discoverSlice.actions;
export default discoverSlice.reducer;
