import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from '@reduxjs/toolkit';
import { RejectWithValueType, PubSchema } from '@/types';
import * as Location from 'expo-location';
import { supabase } from '@/services/supabase';
import { RootState } from '..';

const savedAdapter = createEntityAdapter();

const initialState = savedAdapter.getInitialState({
    pubs: [] as PubSchema[],
    isLoading: false,
    moreToLoad: true,
    isLoadingMore: false,
    isRefreshing: false,
});

export const fetchSavedPubs = createAsyncThunk<
    PubSchema[],
    { amount: number; id: string; refreshing: boolean },
    { rejectValue: RejectWithValueType }
>('saved/fetchSavedPubs', async ({ amount, id }, { rejectWithValue }) => {
    const currentLocation = await Location.getCurrentPositionAsync();

    const { data: savedData, error: savedError } = await supabase
        .from('saves')
        .select()
        .eq('user_id', id)
        .order('created_at', { ascending: false })
        .limit(amount);

    if (savedError) {
        return rejectWithValue({
            message: savedError.message,
            code: savedError.code,
        });
    }

    // TODO: Not sure if .in() returns in order. Verify.
    const { data, error } = await supabase
        .rpc('get_pub', {
            dist_lat: currentLocation.coords.latitude,
            dist_long: currentLocation.coords.longitude,
        })
        .in(
            'id',
            savedData.map(d => d.pub_id),
        );

    if (error) {
        return rejectWithValue({
            message: error.message,
            code: error.code,
        });
    }

    return data;
});

export const toggleSave = createAsyncThunk<
    undefined,
    { id: number; saved: boolean },
    { rejectValue: RejectWithValueType }
>('saved/toggleSave', async ({ id, saved }, { rejectWithValue, getState }) => {
    if (!saved) {
        const { error } = await supabase.from('saves').insert({
            pub_id: id,
        });

        if (error) {
            return rejectWithValue({
                message: error.message,
                code: error.code,
            });
        }
    } else {
        const state = getState() as RootState;

        console.log('DELETING');

        const { data, error } = await supabase
            .from('saves')
            .delete()
            .eq('pub_id', id)
            .eq('user_id', state.user.docData?.id);

        console.log('RESPONSE:', data, error);

        if (error) {
            return rejectWithValue({
                message: error.message,
                code: error.code,
            });
        }
    }
});

const savedSlice = createSlice({
    name: 'saved',
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(fetchSavedPubs.pending, (state, action) => {
                if (!action.meta.arg.refreshing) {
                    state.isLoading = true;
                } else {
                    state.isRefreshing = true;
                }
            })
            .addCase(fetchSavedPubs.fulfilled, (state, action) => {
                state.pubs = action.payload;
                state.isLoading = false;
                state.isRefreshing = false;
            }),
});

export const {} = savedSlice.actions;
export default savedSlice.reducer;
