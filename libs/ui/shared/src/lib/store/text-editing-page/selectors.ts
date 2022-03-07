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

export const selectTextEditingToolMode = createSelector(
  selectTextEditingPageState,
  (state) => state.toolMode
);

export const selectRegionHoveredInToolSpace = createSelector(
  selectTextEditingPageState,
  (state) => state.regionHoveredInToolSpace
);

export const selectRegionHoveredInFacsimileSpace = createSelector(
  selectTextEditingPageState,
  (state) => state.regionHoveredInFacsimileSpace
);

export const selectSelectedElement = createSelector(
  selectTextEditingPageState,
  (state) => ({
    id: state.selectedElementId,
    region: state.regionUnderEditPolygon,
  })
);

export const selectRegionUnderEditUrl = createSelector(
  selectTextEditingPageState,
  (state) => state.regionUnderEditUrl
);

export const selectLayoutHasChanges = createSelector(
  selectTextEditingPageState,
  (state) =>
    state.postLayoutImages.length !== 0 ||
    state.postLayoutTextElements.length !== 0 ||
    state.putImages.length !== 0 ||
    state.putTextElements.length !== 0 ||
    state.deleteLayoutImages.length !== 0 ||
    state.deleteLayoutTextElements.length !== 0
);

export const selectLinesHaveChanges = createSelector(
  selectTextEditingPageState,
  (state) =>
    state.postLines.length !== 0 ||
    state.putLines.length !== 0 ||
    state.deleteLines.length !== 0
);

export const selectTranscriptionHaveChanges = createSelector(
  selectTextEditingPageState,
  (state) => state.postTokens.length !== 0
);

export const selectWorkspaceHasChanges = createSelector(
  [
    selectLayoutHasChanges,
    selectLinesHaveChanges,
    selectTranscriptionHaveChanges,
  ],
  (layoutHasChanges, linesHaveChanges, transcriptionHasChanges) =>
    layoutHasChanges || linesHaveChanges || transcriptionHasChanges
);
