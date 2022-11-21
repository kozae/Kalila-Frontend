import { unitSummariesAdapter, UnitSummariesState } from './slice';
import { createSelector } from '@reduxjs/toolkit';

const selectUnitSummaryState = (state: UnitSummariesState) =>
  state.unitSummaries;

export const { selectAll: selectAllUnitSummaries, selectById: selectUnitById } =
  unitSummariesAdapter.getSelectors<UnitSummariesState>(selectUnitSummaryState);

export const selectUnitStartingInLine = createSelector(
  [selectAllUnitSummaries, (state, line: number) => line],
  (unitSummaries, line) => {
    return unitSummaries.filter((unitSummary) => unitSummary.Start[1] === line);
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
    return unitSummaries.filter((unitSummary) => unitSummary.End[1] === line);
  }
);
