import { linesAdapter, LinesState } from './slice';
import { createSelector } from '@reduxjs/toolkit';

const selectLinesState = (state: LinesState) => state.lines;

export const {
  selectEntities: selectLinesDictionary,
  selectAll: selectAllLines,
  selectIds: selectLineIds,
  selectById: selectLineById,
} = linesAdapter.getSelectors<LinesState>(selectLinesState);

export const selectAllLinesRegions = createSelector(selectAllLines, (li) =>
  li.map((l) => ({
    Id: l.Id,
    HighlightColor: l.HighlightColor,
    Text: ` ${l.LineOrder + 1} `,
    Region: l.FacsimileRegion,
  }))
);

export const selectAllLinesIds = createSelector(selectAllLines, (li) =>
  li.map((l) => l.Id)
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
