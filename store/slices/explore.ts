import { applyFilters } from '@/services';
import { supabase } from '@/services/supabase';
import {
    BoolOrUnset,
    PubSchema,
    PubFilters,
    RejectWithValueType,
} from '@/types';
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

const INITIAL_FILTERS = {
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
} as PubFilters;

const initialState = discoverAdapter.getInitialState({
    pubs: [] as PubSchema[],
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
});

const queryDb = async (
    amount: number,
    filters: PubFilters,
    searchText: string,
    withinRange: number,
    overallRating: number,
    idsToExclude: number[] = [],
): Promise<{ pubs: PubSchema[]; count: number }> => {
    const currentLocation = await Location.getCurrentPositionAsync();

    let query = supabase.rpc(
        'nearby_pubs',
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
    { pubs: PubSchema[]; count: number },
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
    { pubs: PubSchema[] },
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
            action: PayloadAction<{ key: keyof PubFilters; val: BoolOrUnset }>,
        ) {
            state.filters[action.payload.key] = action.payload.val;
        },
        setAllFilters(state, action: PayloadAction<PubFilters>) {
            state.filters = action.payload;
        },
        resetFilters(state) {
            state.filters = INITIAL_FILTERS;
        },
        toggleSave(state, action: PayloadAction<{ id: number }>) {
            const index = state.pubs.findIndex(x => x.id === action.payload.id);

            if (index > -1) {
                state.pubs[index].saved = !state.pubs[index].saved;
            }
        },
        setState(
            state,
            action: PayloadAction<'suggestions' | 'search' | 'map'>,
        ) {
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
    toggleSave,
    setState,
    resetPubs,
    setWithinRange,
    setOverallRating,
    resetFilters,
    setAllFilters,
} = exploreSlice.actions;
export default exploreSlice.reducer;
