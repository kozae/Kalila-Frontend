import { RootState } from '@frontend/shared-ui';
import { tokenAdapter } from './slice';
import { createSelector } from '@reduxjs/toolkit';

const selectTokensState = (state: RootState) => state.tokens;

export const {
  selectAll: selectAllTokens,
  selectEntities: selectTokensDictionary,
} = tokenAdapter.getSelectors<RootState>(selectTokensState);

export const selectPageHasTranscription = createSelector(
  selectAllTokens,
  (tokens) => tokens.length !== 0
);

export const selectLineHasTokens = createSelector(
  [selectAllTokens, (state, id: string) => id],
  (tokens, lineId) => tokens.filter((t) => t.LineId === lineId).length !== 0
);

export const selectTokensOfLine = createSelector(
  [selectAllTokens, (state, id: string) => id],
  (tokens, lineId) => tokens.filter((t) => t.LineId === lineId)
);

export const selectTokenCountsOfLinesAsMapOfOrder = createSelector(
  [selectAllTokens, (state, lines: [string, number][]) => lines],
  (tokens, lines) =>
    lines.reduce(
      (acc: Record<number, { count: number; id: string }>, [id, order]) => {
        acc[order] = {
          count: tokens.filter((t) => t.LineId === id).length,
          id,
        };
        return acc;
      },
      {}
    )
);
