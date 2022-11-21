import { createSelector } from '@reduxjs/toolkit';
import { PageDescription } from '@frontend/domain';
import { PageDataState } from './slice';

const selectPageDataState = (state: PageDataState) => state.pageData;

export const selectPageDataLoadingStatus = createSelector(
  selectPageDataState,
  (state) => state.loading
);

export const selectPageEditor = createSelector(
  selectPageDataState,
  (state) => state.pageInfo.Editor
);

export const selectPageFacsimileUrl = createSelector(
  selectPageDataState,
  (state) => state.pageInfo.FacsimileImageUrl
);

export const selectNearestOpenUnit = createSelector(
  selectPageDataState,
  (state) => state.pageInfo.NearestOpenUnit
);

export const selectPageFacsimileImageSize = createSelector(
  selectPageDataState,
  (state) => state.imageSize
);

export const selectPageDescription = createSelector(
  selectPageDataState,
  (state) =>
    PageDescription.create(state.pageInfo.Id, state.pageInfo.ManuscriptId)
      .withPagination({
        PresentPageNumbering: state.pageInfo.PresentPageNumbering ?? [],
        Pagination: state.pageInfo.Pagination ?? '',
        Foliation: state.pageInfo.Foliation ?? '',
      })
      .withFacsimileUrl(state.pageInfo.FacsimileImageUrl)
      .withTags(state.pageInfo.Tags)
      .withEditor(state.pageInfo.Editor)
      .withEditionProgress(state.pageInfo.EditionProgress)
      .withCommentary(state.pageInfo.AdditionalCommentary)
);

export const selectCurrentPageId = createSelector(
  selectPageDataState,
  (state) => state.pageInfo.Id
);

export const selectCurrentPageManuscriptId = createSelector(
  selectPageDataState,
  (state) => state.pageInfo.ManuscriptId
);

export const selectCurrentPageNumber = createSelector(
  selectPageDataState,
  (state) => state.pageInfo.Number
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
