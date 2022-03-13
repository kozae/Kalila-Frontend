import { tokenAdapter } from './slice';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../config';

const selectTokensState = (state: RootState) => state.tokens;

const { selectAll } = tokenAdapter.getSelectors<RootState>(selectTokensState);

export const selectPageHasTranscription = createSelector(
  selectAll,
  (tokens) => tokens.length !== 0
);

export const selectLineHasTokens = createSelector(
  [selectAll, (state, id: string) => id],
  (tokens, lineId) => tokens.filter((t) => t.LineId === lineId).length !== 0
);

export const selectTokensOfLine = createSelector(
  [selectAll, (state, id: string) => id],
  (tokens, lineId) => tokens.filter((t) => t.LineId === lineId)
);
