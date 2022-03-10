// noinspection ES6PreferShortImport

import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import {
  addImageElement,
  removeImageElement,
  updateImageElement,
} from '../../page-transcription/image-elements';
import {
  addTextElement,
  removeTextElement,
  updateTextElement,
} from '../../page-transcription/text-elements';
import { ITextEditingPageState } from '../models';
import { ILine } from '@frontend/domain';
import { loadGeneratedLines } from '../../page-transcription/lines';

export function addUpdateCollectors(
  builder: ActionReducerMapBuilder<ITextEditingPageState>
) {
  builder.addCase(removeTextElement, (state, action) => {
    state.deleteLayoutTextElements.push(action.payload as string);
  });

  builder.addCase(addTextElement, (state, action) => {
    state.postLayoutTextElements.push(action.payload._id);
  });

  builder.addCase(updateTextElement, (state, action) => {
    const id = action.payload.id as string;
    if (id.length === 24) {
      // mongo object id, i.e. existing item
      if (!state.putTextElements.includes(id)) {
        state.putTextElements.push(id);
      }
    }
  });
  builder.addCase(removeImageElement, (state, action) => {
    state.deleteLayoutImages.push(action.payload as string);
  });

  builder.addCase(addImageElement, (state, action) => {
    state.postLayoutImages.push(action.payload._id);
  });

  builder.addCase(updateImageElement, (state, action) => {
    const id = action.payload.id as string;
    if (id.length === 24) {
      // mongo object id, i.e. existing item
      if (!state.putImages.includes(id)) {
        state.putImages.push(id);
      }
    }
  });

  builder.addCase(loadGeneratedLines, (state, action) => {
    const lines = action.payload as Array<
      Omit<ILine, 'Tokens'> & { ElementId: string }
    >;
    state.postLines.push(...lines.map((l) => l._id));
  });
}
