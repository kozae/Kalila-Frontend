import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { IToken } from '@frontend/domain';
import ObjectID from 'bson-objectid';
import { discardTokenChanges } from '../../text-editing-page';
import { replaceLinesTokens } from './thunks';

export const tokenAdapter = createEntityAdapter<IToken & { LineId: string }>({
  selectId: (doc) => doc.Id,
});

const initialState = tokenAdapter.getInitialState();

export const tokenSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    loadTokens: tokenAdapter.setAll,
    updateManyTokens: tokenAdapter.updateMany,
    clearTokens: tokenAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder.addCase(replaceLinesTokens.fulfilled, (state, action) => {
      for (const { LineId, newTokens } of action.payload.data) {
        const oldTokenIds = Object.values(state.entities)
          .filter((t) => t && t.LineId === LineId)
          .map((t: any) => t.Id);
        tokenAdapter.removeMany(state, oldTokenIds);
        tokenAdapter.addMany(
          state,
          newTokens.map((t) => ({
            ...t,
            Id: ObjectID().toString(),
            LineId,
          }))
        );
      }
    });
    builder.addCase(discardTokenChanges.fulfilled, (state, action) => {
      tokenAdapter.setAll(state, action.payload.Tokens);
    });
  },
});

export type TokensState = {
  [tokenSlice.name]: EntityState<IToken & { LineId: string }>;
};

export const { loadTokens, clearTokens, updateManyTokens } = tokenSlice.actions;
