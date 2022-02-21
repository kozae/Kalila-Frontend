import { RootState } from '../../config';
import { linesAdapter } from './slice';
import { createSelector } from '@reduxjs/toolkit';

const selectLinesState = (state: RootState) => state.lines;

export const { selectAll: selectAllLines } =
  linesAdapter.getSelectors<RootState>(selectLinesState);

export const selectAllLinesRegions = createSelector(selectAllLines, (li) =>
  li.map((l) => ({ Id: l._id, ...l.FacsimileRegion }))
);
