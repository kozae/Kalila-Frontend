// noinspection ES6PreferShortImport

import {
  discardLayoutChanges,
  discardLineChanges,
  discardTokenChanges,
} from '../thunks';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { ITextEditingPageState } from '../models';
import { cancelCreateTextElement } from '../../page-transcription/text-elements';
import { cancelCreateImageElement } from '../../page-transcription/image-elements';
import { discardSegmentationChanges } from '../thunks/discard-segmentation';

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
    state.moveLines = {};
  });
  builder.addCase(discardTokenChanges.pending, (state) => {
    state.toolMode = 'default';
  });
  builder.addCase(discardTokenChanges.fulfilled, (state) => {
    state.toolMode = 'default';
    state.postTokens = [];
  });
  builder.addCase(discardSegmentationChanges.fulfilled, (state) => {
    state.textSegmentationTouched = false;
  });
}
