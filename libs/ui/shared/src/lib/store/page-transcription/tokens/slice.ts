import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { IToken } from '@frontend/domain';
import ObjectID from 'bson-objectid';

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
    replaceLinesTokens: (
      state,
      action: PayloadAction<{ LineId: string; newTokens: IToken[] }[]>
    ) => {
      for (const { LineId, newTokens } of action.payload) {
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
    },
    clearTokens: tokenAdapter.removeAll,
  },
  // todo add the reducers for discard and save thunks
});

export const { loadTokens, replaceLinesTokens, clearTokens, updateManyTokens } =
  tokenSlice.actions;
