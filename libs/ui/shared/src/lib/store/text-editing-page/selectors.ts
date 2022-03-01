import { RootState } from '@frontend/shared-ui';
import { createSelector } from '@reduxjs/toolkit';

const selectTextEditingPageState = (state: RootState) =>
  state.textEditingPageState;

export const selectTextEditingAccessMode = createSelector(
  selectTextEditingPageState,
  (state) => state.accessMode
);

export const selectTextEditingActiveWorkspace = createSelector(
  selectTextEditingPageState,
  (state) => state.activeWorkspace
);

export const selectRegionHoveredInToolSpace = createSelector(
  selectTextEditingPageState,
  (state) => state.regionHoveredInToolSpace
);

export const selectRegionHoveredInFacsimileSpace = createSelector(
  selectTextEditingPageState,
  (state) => state.regionHoveredInFacsimileSpace
);

export const selectSelectedElementId = createSelector(
  selectTextEditingPageState,
  (state) => state.selectedElementId
);

export const selectRegionUnderEditUrl = createSelector(
  selectTextEditingPageState,
  (state) => state.regionUnderEditUrl
);

export const selectImageDimensions = createSelector(
  selectTextEditingPageState,
  (state) => ({
    imageDisplayHeight: state.imageDisplayHeight,
    imageDisplayWidth: state.imageDisplayWidth,
    scaleRatio: state.scaleRatio,
  })
);

export const selectScaleRaion = createSelector(
  selectTextEditingPageState,
  (state) => state.scaleRatio
);
