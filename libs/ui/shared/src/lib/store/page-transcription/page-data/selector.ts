import { RootState } from '../../config';
import { createSelector } from '@reduxjs/toolkit';

const selectPageDataState = (state: RootState) => state.pageData;

export const selectImageUrl = createSelector(
  selectPageDataState,
  (state) => state.pageInfo.FacsimileImageUrl
);

export const selectImageWidth = createSelector(
  selectPageDataState,
  (state) => state.imageInfo.width
);
export const selectImageHeight = createSelector(
  selectPageDataState,
  (state) => state.imageInfo.height
);
