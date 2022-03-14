// noinspection ES6PreferShortImport

import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import {
  IImageElement,
  ILine,
  ITextElement,
  IToken,
  IUnitSummary,
} from '@frontend/domain';
import { ITextEditingPageState } from '../models';
import { loadPageData } from '../../page-transcription/page-data';
import { loadImageElements } from '../../page-transcription/image-elements';
import { loadTextElements } from '../../page-transcription/text-elements';
import { loadLines } from '../../page-transcription/lines';
import { loadTokens } from '../../page-transcription/tokens';
import { loadUnitSummaries } from '../../page-transcription/units-summary';

export function addDataBeforeChangeSetters(
  builder: ActionReducerMapBuilder<ITextEditingPageState>
) {
  builder.addCase(loadPageData, (state, action) => {
    state.pageInfoBeforeChange = action.payload.pageInfo;
  });
  builder.addCase(loadUnitSummaries, (state, action) => {
    state.unitSummariesBeforeChanges = action.payload as IUnitSummary[];
  });
  builder.addCase(loadImageElements, (state, action) => {
    state.imageElementsBeforeChanges = action.payload as IImageElement[];
  });
  builder.addCase(loadTextElements, (state, action) => {
    state.textElementsBeforeChanges = action.payload as Omit<
      ITextElement,
      'Lines'
    >[];
  });
  builder.addCase(loadLines, (state, action) => {
    state.linesBeforeChanges = action.payload as (Omit<ILine, 'Tokens'> & {
      ElementId: string;
    })[];
  });
  builder.addCase(loadTokens, (state, action) => {
    state.tokensBeforeChanges = action.payload as (IToken & {
      LineId: string;
    })[];
  });
}
