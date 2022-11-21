import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { ITextEditingPageState } from '../models';
import {
  saveLayoutChanges,
  saveLineChanges,
  saveSegmentation,
  saveTokenChanges,
} from '../thunks';

export function addSaveReducers(
  builder: ActionReducerMapBuilder<ITextEditingPageState>
) {
  builder.addCase(saveLayoutChanges.fulfilled, (state, action) => {
    state.postLayoutTextElements = [];
    state.postLayoutImages = [];
    state.putImages = [];
    state.putTextElements = [];
    state.deleteLayoutImages = [];
    state.deleteLayoutTextElements = [];
    state.textElementsBeforeChanges = action.payload.TextElements;
    state.imageElementsBeforeChanges = action.payload.Images;
  });
  builder.addCase(saveLineChanges.fulfilled, (state, action) => {
    state.postLines = [];
    state.putLines = [];
    state.deleteLines = [];
    state.moveLines = {};
    state.linesBeforeChanges = action.payload.Lines;
    if (action.payload.withTokens) {
      state.postTokens = [];
      state.tokensBeforeChanges = action.payload.Tokens;
    }
  });
  builder.addCase(saveTokenChanges.fulfilled, (state, action) => {
    state.textSegmentationTouched = false;
    state.postTokens = [];
    state.tokensBeforeChanges = action.payload.Tokens;
    state.unitSummariesBeforeChanges = action.payload.Units;
    state.nearestOpenUnitBeforeChanges =
      action.payload.openedUnitFromPreviousPage ?? null;
  });
  builder.addCase(saveSegmentation.fulfilled, (state, action) => {
    state.textSegmentationTouched = false;
    state.deleteLacunae = [];
    state.unitSummariesBeforeChanges = action.payload.units;
    state.nearestOpenUnitBeforeChanges =
      action.payload.openedUnitFromPreviousPage ?? null;
  });
}
