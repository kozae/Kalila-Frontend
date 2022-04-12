import { RootState } from '../../config';
import { unitSummariesAdapter } from './slice';
import { createSelector } from '@reduxjs/toolkit';

const selectUnitSummaryState = (state: RootState) => state.unitSummaries;

export const { selectAll: selectAllUnitSummaries } =
  unitSummariesAdapter.getSelectors<RootState>(selectUnitSummaryState);

export const selectUnitStartingInLine = createSelector(
  [selectAllUnitSummaries, (state, line: number) => line],
  (unitSummaries, line) => {
    return unitSummaries.filter(
      (unitSummary) => unitSummary.StartsInLineNumber === line
    );
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
