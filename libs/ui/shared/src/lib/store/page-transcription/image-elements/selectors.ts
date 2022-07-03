import { RootState } from '../../config';
import { imageElementsAdapter } from './slice';
import { createSelector } from '@reduxjs/toolkit';

const selectImageElementsState = (state: RootState) => state.imageElements;

export const {
  selectAll: selectAllImageElements,
  selectById: selectImageElementById,
} = imageElementsAdapter.getSelectors<RootState>(selectImageElementsState);

export const selectAllImageElementsRegions = createSelector(
  selectAllImageElements,
  (ie) =>
    ie.map((e) => ({
      Id: e.Id,
      HighlightColor: e.HighlightColor,
      Text: ` ${e.Order + 1} `,
      Region: e.FacsimileRegion,
    }))
);

export const selectAllImageElementsIds = createSelector(
  selectAllImageElements,
  (ie) => ie.map((e) => e.Id)
);
