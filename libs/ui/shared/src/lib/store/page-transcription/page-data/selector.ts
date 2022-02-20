import { RootState } from '../../config';
import { createSelector } from '@reduxjs/toolkit';

const selectPageDataState = (state: RootState) => state.pageData;

export const selectImageUrl = createSelector(
  selectPageDataState,
  (state) => state.pageInfo.FacsimileImageUrl
);

export const selectImageWidth = createSelector(
  selectPageDataState,
  (state) => state.imageSize.Width
);
export const selectImageHeight = createSelector(
  selectPageDataState,
  (state) => state.imageSize.Height
);
