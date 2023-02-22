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

const discoverPubsAdapter = createEntityAdapter();

const initialState = discoverPubsAdapter.getInitialState({
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

export const fetchPubs = createAsyncThunk<
    PubType[],
    { amount: number },
    { rejectValue: RejectWithValueType }
>(
    'discoverPubs/fetchPubs',
    async ({ amount }, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            // TODO: Error.
            throw new Error('No location granted');
        }

        let l = await Location.getCurrentPositionAsync();

        let query = supabase.rpc('nearby_pubs', {
            order_lat: l.coords.latitude,
            order_long: l.coords.longitude,
            dist_lat: l.coords.latitude,
            dist_long: l.coords.longitude,
        });

        query = applyFilters(
            query,
            state.discoverPubs.filters,
            state.discoverPubs.searchText,
        );

        const response = await query.limit(amount);

        if (response.data && response.data.length) {
            let promises: Promise<PubType>[] = [];

            response.data.forEach((pub: any) => {
                promises.push(
                    new Promise(async resolve => {
                        const photo = await supabase
                            .from('pub_photos')
                            .select()
                            .eq('pub_id', pub.id);

                        console.log('PHOTO:', photo, pub.id);

                        resolve(forcePubType(pub, photo.data));
                    }),
                );
            });

            return await Promise.all(promises);
        } else {
            console.log('HERE');
            return rejectWithValue({});
        }
    },
);

const discoverPubsSlice = createSlice({
    name: 'discoverPubs',
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
            })
            .addCase(fetchPubs.fulfilled, (state, action) => {
                state.pubs = action.payload;
                state.isLoading = false;
                state.isLoadingMore = false;

                console.log('fetch pubs fulfilled');
            })
            .addCase(fetchPubs.rejected, (state, { meta, payload }) => {
                // TODO: handle errors.
                console.error('Error fetching pubs', meta, payload);
            });
    },
});

export const { setSearchText, setFilter } = discoverPubsSlice.actions;
export default discoverPubsSlice.reducer;
