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
import {
  addLine,
  deleteLine,
  loadGeneratedLines,
  moveLines,
  updateLine,
  updateManyLines,
} from '../../page-transcription/lines';
import {
  replaceLinesTokens,
  updateManyTokens,
} from '../../page-transcription/tokens';
import {
  closeUnit,
  insertUnit,
  moveUnit,
  removeUnit,
  removeUnitEndTag,
  replaceUnit,
  swapUnits,
  updateUnit,
} from '../../page-transcription/units-summary';
import { removeLacuna } from '../../page-transcription/book-units';

export function addUpdateCollectors(
  builder: ActionReducerMapBuilder<ITextEditingPageState>
) {
  builder.addCase(removeTextElement, (state, action) => {
    state.deleteLayoutTextElements.push(action.payload as string);
  });

  builder.addCase(addTextElement, (state, action) => {
    state.postLayoutTextElements.push(action.payload.Id);
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
    state.postLayoutImages.push(action.payload.Id);
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
    state.postLines.push(...lines.map((l) => l.Id));
  });

  builder.addCase(addLine, (state, action) => {
    state.postLines.push(action.payload.Id);
  });
  builder.addCase(deleteLine, (state, action) => {
    state.deleteLines.push(action.payload as string);
  });
  builder.addCase(updateLine, (state, action) => {
    const id = action.payload.id as string;
    if (id.length === 24) {
      if (
        !state.putLines.includes(id) &&
        !Object.keys(state.moveLines).includes(id)
      ) {
        state.putLines.push(id);
      }
    }
  });
  builder.addCase(updateManyLines, (state, action) => {
    action.payload.forEach((update) => {
      const id = update.id as string;
      if (id.length === 24) {
        if (
          !state.putLines.includes(id) &&
          !Object.keys(state.moveLines).includes(id)
        ) {
          state.putLines.push(id);
        }
      }
    });
  });
  builder.addCase(moveLines, (state, action) => {
    action.payload.forEach((update) => {
      const line = state.linesBeforeChanges.find((l) => l.Id === update.LineId);
      if (
        // returning a line to its original container
        line &&
        Object.keys(state.moveLines).includes(update.LineId) &&
        line.ElementId === update.Target
      ) {
        delete state.moveLines[update.LineId];
        state.putLines.push(update.LineId);
      } else {
        state.moveLines[update.LineId] = update.Target;
        state.putLines = state.putLines.filter((id) => id === update.LineId);
      }
    });
  });
  builder.addCase(updateManyTokens, (state, action) => {
    action.payload.forEach((update) => {
      const lineId = update.changes.LineId as string;
      if (!state.postTokens.includes(lineId)) {
        state.postTokens.push(lineId);
      }
    });
  });
  builder.addCase(replaceLinesTokens.fulfilled, (state, action) => {
    for (const { LineId } of action.payload.data) {
      if (!state.postTokens.includes(LineId)) {
        state.postTokens.push(LineId);
        state.textSegmentationTouched = true;
      }
    }
  });
  builder.addCase(insertUnit.fulfilled, (state) => {
    state.textSegmentationTouched = true;
  });
  builder.addCase(updateUnit, (state) => {
    state.textSegmentationTouched = true;
  });
  builder.addCase(removeUnit, (state) => {
    state.textSegmentationTouched = true;
  });
  builder.addCase(replaceUnit, (state) => {
    state.textSegmentationTouched = true;
  });
  builder.addCase(swapUnits, (state) => {
    state.textSegmentationTouched = true;
  });
  builder.addCase(removeLacuna, (state, action) => {
    state.textSegmentationTouched = true;
    if (action.payload.lacuna.length === 24) {
      state.deleteLacunae.push(action.payload.lacuna);
    }
  });
  builder.addCase(removeUnitEndTag.fulfilled, (state) => {
    state.textSegmentationTouched = true;
  });
  builder.addCase(closeUnit.fulfilled, (state) => {
    state.textSegmentationTouched = true;
  });
  builder.addCase(moveUnit.fulfilled, (state) => {
    state.textSegmentationTouched = true;
  });
}
