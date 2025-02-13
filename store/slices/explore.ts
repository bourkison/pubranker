import { applyFilters } from '@/services';
import { supabase } from '@/services/supabase';
import { PubFilters, RejectWithValueType } from '@/types';
import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';
import * as Location from 'expo-location';
import { RootState } from '@/store';
import { MAX_WITHIN_RANGE } from '@/constants';

const discoverAdapter = createEntityAdapter();

export type ExplorePub = {
    id: number;
    name: string;
    address: string;
    phone_number: string;
    website: string;
    primary_photo: string;
    location: string;
    description: string;

    reservable: boolean | null;
    dog_friendly: boolean | null;
    live_sport: boolean | null;
    pool_table: boolean | null;
    dart_board: boolean | null;
    beer_garden: boolean | null;
    kid_friendly: boolean | null;
    free_wifi: boolean | null;
    rooftop: boolean | null;
    foosball_table: boolean | null;
    wheelchair_accessible: boolean | null;

    num_reviews: number;
    saved: boolean;
    dist_meters: number;
    rating: number;
    photos: string[];
};

const INITIAL_FILTERS = {
    reservable: null,
    dogFriendly: null,
    liveSport: null,
    darts: null,
    poolTable: null,
    garden: null,
    kidFriendly: null,
    liveMusic: null,
    boardGames: null,
    freeWifi: null,
    rooftop: null,
    foosball: null,
    wheelchairAccessible: null,
} as PubFilters;

const initialState = discoverAdapter.getInitialState({
    pubs: [] as ExplorePub[],
    resultsAmount: 0,
    isLoading: false,
    moreToLoad: true,
    isLoadingMore: false,
    searchText: '',
    withinRange: MAX_WITHIN_RANGE,
    overallRating: 0,
    sortBy: 'distance' as 'distance' | 'ratings',
    filters: INITIAL_FILTERS as PubFilters,
    exploreState: 'suggestions' as 'suggestions' | 'search' | 'map',
    previousExploreState: 'suggestions' as 'suggestions' | 'search' | 'map',
});

const queryDb = async (
    amount: number,
    filters: PubFilters,
    searchText: string,
    withinRange: number,
    overallRating: number,
    idsToExclude: number[] = [],
): Promise<{ pubs: ExplorePub[]; count: number }> => {
    const currentLocation = await Location.getCurrentPositionAsync();

    let query = supabase.rpc(
        'get_pubs_with_distances',
        {
            order_lat: currentLocation.coords.latitude,
            order_long: currentLocation.coords.longitude,
            dist_lat: currentLocation.coords.latitude,
            dist_long: currentLocation.coords.longitude,
        },
        { count: 'exact' },
    );

    query = applyFilters(query, filters, searchText);

    if (withinRange < MAX_WITHIN_RANGE) {
        query = query.lte('dist_meters', withinRange);
    }

    if (overallRating > 0) {
        query = query.gte('rating', overallRating);
    }

    if (idsToExclude.length) {
        query = query.not('id', 'in', `(${idsToExclude.join(',')})`);
    }

    const { data, count, error } = await query.limit(amount);

    if (!data) {
        throw new Error(error.message);
    }

    return { pubs: data, count: count || 0 };
};

export const fetchExplorePubs = createAsyncThunk<
    { pubs: ExplorePub[]; count: number },
    { amount: number },
    { rejectValue: RejectWithValueType }
>(
    'explore/fetchExplorePubs',
    async ({ amount }, { getState, rejectWithValue }) => {
        const state = getState() as RootState;

        try {
            const { pubs, count } = await queryDb(
                amount,
                state.explore.filters,
                state.explore.searchText,
                state.explore.withinRange,
                state.explore.overallRating,
            );

            return { pubs, count };
        } catch (err: any) {
            return rejectWithValue({
                message: err?.message,
                code: err?.statusCode,
            });
        }
    },
);

export const fetchMoreExplorePubs = createAsyncThunk<
    { pubs: ExplorePub[] },
    { amount: number },
    { rejectValue: RejectWithValueType }
>(
    'discover/fetchMoreExplorePubs',
    async ({ amount }, { getState, rejectWithValue }) => {
        const state = getState() as RootState;

        try {
            const { pubs } = await queryDb(
                amount,
                state.explore.filters,
                state.explore.searchText,
                state.explore.withinRange,
                state.explore.overallRating,
                state.explore.pubs.map(pub => pub.id),
            );

            return { pubs };
        } catch (err: any) {
            return rejectWithValue({
                message: err?.message,
                code: err?.statusCode,
            });
        }
    },
);

const exploreSlice = createSlice({
    name: 'explore',
    initialState,
    reducers: {
        setSearchText(state, action: PayloadAction<string>) {
            state.searchText = action.payload;
        },
        setFilter(
            state,
            action: PayloadAction<{
                key: keyof PubFilters;
                val: boolean | null;
            }>,
        ) {
            state.filters[action.payload.key] = action.payload.val;
        },
        setAllFilters(state, action: PayloadAction<PubFilters>) {
            state.filters = action.payload;
        },
        resetFilters(state) {
            state.filters = INITIAL_FILTERS;
        },
        setPubSave(
            state,
            action: PayloadAction<{ id: number; value: boolean }>,
        ) {
            const index = state.pubs.findIndex(x => x.id === action.payload.id);

            console.log(
                'updating',
                action.payload.id,
                action.payload.value,
                index,
            );

            if (index > -1) {
                state.pubs[index].saved = action.payload.value;
            }
        },
        setState(
            state,
            action: PayloadAction<'suggestions' | 'search' | 'map'>,
        ) {
            state.previousExploreState = state.exploreState;
            state.exploreState = action.payload;
        },
        resetPubs(state) {
            state.pubs = [];
            state.isLoading = false;
            state.isLoadingMore = false;
            state.moreToLoad = true;
        },
        setWithinRange(state, action: PayloadAction<number>) {
            state.withinRange = action.payload;
        },
        setOverallRating(state, action: PayloadAction<number>) {
            state.overallRating = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchExplorePubs.pending, state => {
                state.isLoading = true;
                state.isLoadingMore = false;
                state.moreToLoad = true;
                state.pubs = [];
            })
            .addCase(fetchExplorePubs.fulfilled, (state, action) => {
                state.pubs = action.payload.pubs;
                state.resultsAmount = action.payload.count;
                state.isLoading = false;
                state.isLoadingMore = false;

                if (action.payload.pubs.length < action.meta.arg.amount) {
                    state.moreToLoad = false;
                }
            })
            .addCase(fetchExplorePubs.rejected, (state, { meta, payload }) => {
                // TODO: handle errors.
                console.error('Error fetching pubs', meta, payload);
                state.moreToLoad = false;
                state.isLoadingMore = false;
                state.isLoading = false;
            })
            .addCase(fetchMoreExplorePubs.pending, state => {
                state.isLoadingMore = true;
            })
            .addCase(fetchMoreExplorePubs.fulfilled, (state, action) => {
                state.pubs = [...state.pubs, ...action.payload.pubs];
                state.isLoadingMore = false;
                state.moreToLoad = true;

                if (action.payload.pubs.length < action.meta.arg.amount) {
                    state.moreToLoad = false;
                }
            })
            .addCase(
                fetchMoreExplorePubs.rejected,
                (state, { meta, payload }) => {
                    // TODO: handle errors.
                    console.error('Error fetching pubs', meta, payload);
                    state.moreToLoad = false;
                    state.isLoadingMore = false;
                    state.isLoading = false;
                },
            );
    },
});

export const {
    setSearchText,
    setFilter,
    setPubSave,
    setState,
    resetPubs,
    setWithinRange,
    setOverallRating,
    resetFilters,
    setAllFilters,
} = exploreSlice.actions;
export default exploreSlice.reducer;
