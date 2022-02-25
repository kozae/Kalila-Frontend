import { RootState } from '../../config';
import { imageElementsAdapter } from './slice';
import { createSelector } from '@reduxjs/toolkit';

const selectImageElementsState = (state: RootState) => state.imageElements;

export const {
  selectAll: selectAllImageElements,
  selectById: selectImageElementByIdFromAdapter,
} = imageElementsAdapter.getSelectors<RootState>(selectImageElementsState);

export const selectAllImageElementsRegions = createSelector(
  selectAllImageElements,
  (ie) =>
    ie.map((e) => ({
      Id: e._id,
      HighlightColor: e.HighlightColor,
      ...e.FacsimileRegion,
    }))
);

export const selectAllImageElementsIds = createSelector(
  selectAllImageElements,
  (ie) => ie.map((e) => e._id)
);

export const selectImageElementById = (id: string) =>
  createSelector(
    (state: RootState) => state,
    (state) => selectImageElementByIdFromAdapter(state, id)
  );
