import { RootState } from '../../config';
import { unitSummariesAdapter } from './slice';
import { createSelector } from '@reduxjs/toolkit';

const selectUnitSummaryState = (state: RootState) => state.unitSummaries;

export const { selectAll: selectAllUnitSummaries, selectById: selectUnitById } =
  unitSummariesAdapter.getSelectors<RootState>(selectUnitSummaryState);

export const selectUnitStartingInLine = createSelector(
  [selectAllUnitSummaries, (state, line: number) => line],
  (unitSummaries, line) => {
    return unitSummaries.filter(
      (unitSummary) => unitSummary.StartsInLineNumber === line
    );
  }
);

export const selectUnitByBuId = createSelector(
  [selectAllUnitSummaries, (state, buId: string) => buId],
  (unitSummaries, buId) => {
    return unitSummaries.find((unitSummary) => unitSummary.BookUnitId === buId);
  }
);

export const selectUnitEndingInLine = createSelector(
  [selectAllUnitSummaries, (state, line: number) => line],
  (unitSummaries, line) => {
    return unitSummaries.filter(
      (unitSummary) => unitSummary.EndsInLineNumber === line
    );
  }
);
