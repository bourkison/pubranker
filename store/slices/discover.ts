import { applyFilters, forcePubType } from '@/services';
import { supabase } from '@/services/supabase';
import { BoolOrUnset, PubFilters, PubType } from '@/types';
import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';
import * as Location from 'expo-location';
import { RootState } from '@/store';

type RejectWithValueType = {
    message?: string;
    code?: number;
};

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
    let l = await Location.getCurrentPositionAsync();

    let query = supabase.rpc('nearby_pubs', {
        order_lat: l.coords.latitude,
        order_long: l.coords.longitude,
        dist_lat: l.coords.latitude,
        dist_long: l.coords.longitude,
    });

    query = applyFilters(query, filters, searchText);

    const from = skip || 0;
    const to = amount + from;

    const response = await query.range(from, to);

    if (response.data && response.data.length) {
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

        return await Promise.all(promises);
    } else {
        throw new Error('No response');
    }
};

export const fetchPubs = createAsyncThunk<
    PubType[],
    { amount: number },
    { rejectValue: RejectWithValueType }
>('discover/fetchPubs', async ({ amount }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
        // TODO: Error.
        throw new Error('No location granted');
    }

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
});

export const fetchMorePubs = createAsyncThunk<
    PubType[],
    { amount: number },
    { rejectValue: RejectWithValueType }
>(
    'discover/fetchMorePubs',
    async ({ amount }, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            // TODO: Error.
            throw new Error('No location granted');
        }

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
            .addCase(fetchPubs.pending, state => {
                state.isLoading = true;
                state.isLoadingMore = false;
                state.moreToLoad = true;
                state.pubs = [];
            })
            .addCase(fetchPubs.fulfilled, (state, action) => {
                state.pubs = action.payload;
                state.isLoading = false;
                state.isLoadingMore = false;
            })
            .addCase(fetchPubs.rejected, (state, { meta, payload }) => {
                // TODO: handle errors.
                console.error('Error fetching pubs', meta, payload);
                state.moreToLoad = false;
                state.isLoadingMore = false;
                state.isLoading = false;
            })
            .addCase(fetchMorePubs.pending, state => {
                state.isLoadingMore = true;
            })
            .addCase(fetchMorePubs.fulfilled, (state, action) => {
                state.pubs = [...state.pubs, ...action.payload];
                state.isLoadingMore = false;
                state.moreToLoad = true;
            })
            .addCase(fetchMorePubs.rejected, state => {
                state.moreToLoad = false;
                state.isLoadingMore = false;
                state.isLoading = false;
            });
    },
});

export const { setSearchText, setFilter } = discoverSlice.actions;
export default discoverSlice.reducer;
