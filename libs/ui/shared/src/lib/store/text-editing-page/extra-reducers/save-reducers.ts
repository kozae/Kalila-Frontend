import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { ITextEditingPageState } from '../models';
import { saveLayoutChanges } from '../thunks';

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
}
