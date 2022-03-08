import { RootState } from '@frontend/shared-ui';
import { tokenAdapter } from './slice';
import { createSelector } from '@reduxjs/toolkit';

const selectTokensState = (state: RootState) => state.tokens;

const { selectAll } = tokenAdapter.getSelectors<RootState>(selectTokensState);

export const selectPageHasTranscription = createSelector(
  selectAll,
  (tokens) => tokens.length !== 0
);
