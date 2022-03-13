import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { ITextEditingPageState } from '../models';
import { saveLayoutChanges, saveLineChanges } from '../thunks';

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
  });
}
