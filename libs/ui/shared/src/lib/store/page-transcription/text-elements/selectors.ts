import { RootState } from '../../config';
import { textElementsAdapter } from './slice';
import { createSelector } from '@reduxjs/toolkit';

const selectTextElementsState = (state: RootState) => state.textElements;
export const {
  selectAll: selectAllTextElements,
  selectById: selectTextElementById,
} = textElementsAdapter.getSelectors<RootState>(selectTextElementsState);

export const selectAllTextElementsRegions = createSelector(
  selectAllTextElements,
  (te) =>
    te.map((e) => ({
      Id: e._id,
      HighlightColor: e.HighlightColor,
      ...e.FacsimileRegion,
    }))
);

export const selectAllTextElementsIds = createSelector(
  selectAllTextElements,
  (te) => te.map((e) => e._id)
);
