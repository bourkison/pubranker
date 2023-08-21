import { PubSchema } from '@/types';
import {
    PayloadAction,
    createEntityAdapter,
    createSlice,
} from '@reduxjs/toolkit';

const mapAdapter = createEntityAdapter();

const initialState = mapAdapter.getInitialState({
    selected: undefined as PubSchema | undefined,
});

const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        selectPub(state, action: PayloadAction<PubSchema | undefined>) {
            state.selected = action.payload;
        },
    },
    extraReducers: () => {},
});

export const { selectPub } = mapSlice.actions;
export default mapSlice.reducer;
