import { supabase } from '@/services/supabase';
import { RejectWithValueType, UserType } from '@/types';
import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from '@reduxjs/toolkit';

const userAdapter = createEntityAdapter();

const initialState = userAdapter.getInitialState({
    loggedIn: false,
    docData: null as UserType | null,
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
});

export const fetchUser = createAsyncThunk<
    UserType,
    undefined,
    { rejectValue: RejectWithValueType }
>('user/fetchUser', async (_, { rejectWithValue }) => {
    const session = await supabase.auth.getSession();

    if (!session.data || !session.data.session) {
        return rejectWithValue({
            message: session.error?.message,
            code: session.error?.name,
        });
    }

    const { data, error } = await supabase
        .from('users_public')
        .select()
        .eq('id', session.data.session.user.id)
        .limit(1)
        .single();

    if (error) {
        return rejectWithValue({
            message: error.message,
            code: error.code,
        });
    }

    return data;
});

export const signOut = createAsyncThunk<
    undefined,
    undefined,
    { rejectValue: RejectWithValueType }
>('user/signOut', async (_, { rejectWithValue }) => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        return rejectWithValue({
            message: error.message,
            code: error.status?.toString(),
        });
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout(state) {
            state.loggedIn = false;
            state.docData = null;
            state.status = 'idle';
        },
    },
    extraReducers: builder =>
        builder
            .addCase(fetchUser.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.docData = action.payload;
                state.loggedIn = true;
                state.status = 'succeeded';
            })
            .addCase(fetchUser.rejected, (_, payload) =>
                console.warn(
                    'error fetching user',
                    payload.error.message,
                    payload.error.code,
                ),
            )
            .addCase(signOut.pending, state => {
                state.status = 'loading';
            })
            .addCase(signOut.fulfilled, state => {
                state.loggedIn = false;
                state.docData = null;
                state.status = 'idle';
            })
            .addCase(signOut.rejected, (_, payload) => {
                console.warn(
                    'error signing out',
                    payload.error.message,
                    payload.error.code,
                );
            }),
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
