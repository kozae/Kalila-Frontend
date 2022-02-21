import { RootState } from '../../config';
import { imageElementsAdapter } from './slice';
import { createSelector } from '@reduxjs/toolkit';

const selectImageElementsState = (state: RootState) => state.imageElements;

export const { selectAll: selectAllImageElements } =
  imageElementsAdapter.getSelectors<RootState>(selectImageElementsState);

export const selectAllImageElementsRegions = createSelector(
  selectAllImageElements,
  (ie) => ie.map((e) => ({ Id: e._id, ...e.FacsimileRegion }))
);
