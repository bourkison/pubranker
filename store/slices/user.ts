import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const userAdapter = createEntityAdapter();

const initialState = userAdapter.getInitialState({
    loggedIn: false,
    docData: null as { name: string } | null,
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
});

export const {} = userSlice.actions;
export default userSlice.reducer;
