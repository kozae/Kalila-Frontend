import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IToken } from '@frontend/domain';

export const tokenAdapter = createEntityAdapter<IToken & { LineId: string }>({
  selectId: (doc) => doc._id,
});

const initialState = tokenAdapter.getInitialState();

export const tokenSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    loadTokens: tokenAdapter.setAll,
    clearTokens: tokenAdapter.removeAll,
  },
});

export const { loadTokens, clearTokens } = tokenSlice.actions;
