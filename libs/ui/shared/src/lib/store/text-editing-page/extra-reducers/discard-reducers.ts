// noinspection ES6PreferShortImport

import { discardLayoutChanges, discardLineChanges } from '../thunks';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { ITextEditingPageState } from '../models';
import { cancelCreateTextElement } from '../../page-transcription/text-elements';
import { cancelCreateImageElement } from '../../page-transcription/image-elements';

export function addDiscardReducers(
  builder: ActionReducerMapBuilder<ITextEditingPageState>
) {
  builder.addCase(discardLayoutChanges.fulfilled, (state) => {
    state.postLayoutTextElements = [];
    state.postLayoutImages = [];
    state.putImages = [];
    state.putTextElements = [];
    state.deleteLayoutImages = [];
    state.deleteLayoutTextElements = [];
  });
  builder.addCase(cancelCreateTextElement, (state, action) => {
    const index = state.postLayoutTextElements.findIndex(
      (id) => id === action.payload
    );
    if (index !== -1) state.postLayoutTextElements.splice(index, 1);
  });
  builder.addCase(cancelCreateImageElement, (state, action) => {
    const index = state.postLayoutImages.findIndex(
      (id) => id === action.payload
    );
    if (index !== -1) state.postLayoutImages.splice(index, 1);
  });
  builder.addCase(discardLineChanges.fulfilled, (state) => {
    state.postLines = [];
    state.putLines = [];
    state.deleteLines = [];
  });
}
