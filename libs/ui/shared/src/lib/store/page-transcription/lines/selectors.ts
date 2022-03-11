import { RootState } from '../../config';
import { linesAdapter } from './slice';
import { createSelector } from '@reduxjs/toolkit';

const selectLinesState = (state: RootState) => state.lines;

export const {
  selectAll: selectAllLines,
  selectIds: selectLineIds,
  selectById: selectLineById,
} = linesAdapter.getSelectors<RootState>(selectLinesState);

export const selectAllLinesRegions = createSelector(selectAllLines, (li) =>
  li.map((l) => ({
    Id: l._id,
    HighlightColor: l.HighlightColor,
    Text: ` ${l.LineOrder} `,
    ...l.FacsimileRegion,
  }))
);

export const selectAllLinesIds = createSelector(selectAllLines, (li) =>
  li.map((l) => l._id)
);

export const selectNumberOfLines = createSelector(
  selectLineIds,
  (li) => li.length
);

export const selectPageHasLines = createSelector(
  selectAllLines,
  (li) => li.length !== 0
);

export const selectTextElementHasLines = createSelector(
  [selectAllLines, (state, id: string) => id],
  (lines, id) => lines.find((l) => l.ElementId === id) !== undefined
);

export const selectNumberOfLinesInElements = createSelector(
  [selectAllLines, (state, ids: string[]) => ids],
  (lines, ids) => lines.filter((l) => ids.includes(l.ElementId)).length
);
