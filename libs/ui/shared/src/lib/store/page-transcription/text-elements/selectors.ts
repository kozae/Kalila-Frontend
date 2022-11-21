import { textElementsAdapter, TextElementState } from './slice';
import { createSelector } from '@reduxjs/toolkit';
import { selectAllImageElements } from '../image-elements';

const selectTextElementsState = (state: TextElementState) => state.textElements;
export const {
  selectAll: selectAllTextElements,
  selectById: selectTextElementById,
} = textElementsAdapter.getSelectors<TextElementState>(selectTextElementsState);

export const selectAllTextElementsRegions = createSelector(
  selectAllTextElements,
  (te) =>
    te.map((e) => ({
      Id: e.Id,
      HighlightColor: e.HighlightColor,
      Text: ` ${e.Order + 1} `,
      Region: e.FacsimileRegion,
    }))
);

export const selectAllTextElementsIds = createSelector(
  selectAllTextElements,
  (te) => te.map((e) => e.Id)
);

export const selectPageHasText = createSelector(
  selectAllTextElements,
  (te) => te.length !== 0
);

export const selectPageHasImages = createSelector(
  selectAllImageElements,
  (im) => im.length !== 0
);

export const selectFirstTextElement = createSelector(
  selectAllTextElements,
  (te) => {
    const mainBody = te.filter((e) => e.Position.startsWith('main'));
    if (mainBody.length !== 0) {
      return mainBody[0];
    }
    return te[0];
  }
);
