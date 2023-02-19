import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const userAdapter = createEntityAdapter();

const initialState = userAdapter.getInitialState({
    isGuest: false,
    loggedIn: false,
    docData: null as { name: string } | null,
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        continueAsGuest(state) {
            state.isGuest = true;
            state.loggedIn = true;
            state.status = 'succeeded';
        },
    },
});

export const { continueAsGuest } = userSlice.actions;
export default userSlice.reducer;
