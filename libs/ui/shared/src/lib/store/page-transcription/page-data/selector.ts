import { RootState } from '../../config';
import { createSelector } from '@reduxjs/toolkit';

const selectPageDataState = (state: RootState) => state.pageData;

export const selectPageDataLoadingStatus = createSelector(
  selectPageDataState,
  (state) => state.loading
);

export const selectPageEditor = createSelector(
  selectPageDataState,
  (state) => state.pageInfo.Editor
);

export const selectCurrentPageId = createSelector(
  selectPageDataState,
  (state) => state.pageInfo.Id
);

export const selectCurrentPageFacsimileData = createSelector(
  [
    selectPageDataState,
    (
      state,
      windowSize: { height: number; width: number },
      navBarHeight,
      margin,
      widthPercentage
    ) => ({ windowSize, navBarHeight, margin, widthPercentage }),
  ],
  (pageData, { windowSize, navBarHeight, margin, widthPercentage }) => {
    if (pageData.imageSize.Width !== 0 && pageData.imageSize.Height !== 0) {
      const maxHeight = windowSize.height - navBarHeight - 2 * margin;
      const maxWidth =
        (Math.min(windowSize.width, 1600) * widthPercentage) / 100;
      let scaleRatio = 1,
        height = pageData.imageSize.Height,
        width = pageData.imageSize.Width;
      if (
        pageData.imageSize.Height > maxHeight ||
        pageData.imageSize.Width > maxWidth
      ) {
        scaleRatio = maxHeight / pageData.imageSize.Height;
        height = maxHeight;
        width = pageData.imageSize.Width * scaleRatio;
        if (width > maxWidth) {
          scaleRatio = maxWidth / pageData.imageSize.Width;
          width = maxWidth;
          height =
            (pageData.imageSize.Height * width) / pageData.imageSize.Width;
        }
      }
      return {
        imageHeight: pageData.imageSize.Height,
        imageWidth: pageData.imageSize.Width,
        imageUrl: pageData.pageInfo.FacsimileImageUrl,
        pageId: pageData.pageInfo.Id,
        imageDisplayHeight: height,
        imageDisplayWidth: width,
        scaleRatio,
      };
    }
    return {
      imageHeight: pageData.imageSize.Height,
      imageWidth: pageData.imageSize.Width,
      pageId: pageData.pageInfo.Id,
      imageUrl: pageData.pageInfo.FacsimileImageUrl,
      imageDisplayHeight: 1,
      imageDisplayWidth: 1,
      scaleRatio: 1,
    };
  }
);
