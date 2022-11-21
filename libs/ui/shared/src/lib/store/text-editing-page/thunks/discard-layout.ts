import { createAsyncThunk } from '@reduxjs/toolkit';
import { IImageElement, ITextElement } from '@frontend/domain';
import { ThunkApi } from '@frontend/shared-ui';
import { sleeper } from '@frontend/util';
import { discardThunk } from './discard';

export const discardLayoutChanges = createAsyncThunk<
  {
    ImageElements: IImageElement[];
    TextElements: Omit<ITextElement, 'Lines'>[];
  },
  any,
  ThunkApi
>(discardThunk.layoutChanges, async ({}, { getState }) => {
  const state = getState();
  await sleeper(10);
  return {
    ImageElements: state.textEditingPageState.imageElementsBeforeChanges,
    TextElements: state.textEditingPageState.textElementsBeforeChanges,
  };
});
