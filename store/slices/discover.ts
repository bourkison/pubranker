import { applyFilters } from '@/services';
import { supabase } from '@/services/supabase';
import {
    BoolOrUnset,
    DiscoveredPub,
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

const discoverAdapter = createEntityAdapter();

const initialState = discoverAdapter.getInitialState({
    pubs: [] as DiscoveredPub[],
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
): Promise<DiscoveredPub[]> => {
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

    const { data, error } = await query.range(from, to);

    if (!data) {
        throw new Error(error.message);
    }

    return data;
};

export const fetchDiscoverPubs = createAsyncThunk<
    DiscoveredPub[],
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
    DiscoveredPub[],
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
        toggleSave(state, action: PayloadAction<{ id: number }>) {
            const index = state.pubs.findIndex(x => x.id === action.payload.id);

            if (index > -1) {
                state.pubs[index].saved = !state.pubs[index].saved;
            }
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

export const { setSearchText, setFilter, toggleSave } = discoverSlice.actions;
export default discoverSlice.reducer;
