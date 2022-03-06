import { RootState } from '../../config';
import { linesAdapter } from './slice';
import { createSelector } from '@reduxjs/toolkit';

const selectLinesState = (state: RootState) => state.lines;
const selectId = (state: RootState, id: string) => id;

export const { selectAll: selectAllLines } =
  linesAdapter.getSelectors<RootState>(selectLinesState);

export const selectAllLinesRegions = createSelector(selectAllLines, (li) =>
  li.map((l) => ({
    Id: l._id,
    HighlightColor: l.HighlightColor,
    ...l.FacsimileRegion,
  }))
);

export const selectAllLinesIds = createSelector(selectAllLines, (li) =>
  li.map((l) => l._id)
);

export const selectTextElementHasLines = createSelector(
  [selectAllLines, (state, id: string) => id],
  (lines, id) => lines.find((l) => l.ElementId === id) !== undefined
);
