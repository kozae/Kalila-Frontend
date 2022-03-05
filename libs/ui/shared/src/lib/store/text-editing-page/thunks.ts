import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkApi } from '@frontend/shared-ui';
import { IImageElement, ITextElement } from '@frontend/domain';
import { sleeper } from '@frontend/util';

export const discardLayoutChanges = createAsyncThunk<
  {
    ImageElements: IImageElement[];
    TextElements: Omit<ITextElement, 'Lines'>[];
  },
  any,
  ThunkApi
>('textEditingPageState/discardLayoutChanges', async ({}, { getState }) => {
  const state = getState();
  await sleeper(100);
  return {
    ImageElements: state.textEditingPageState.imageElementsBeforeChanges,
    TextElements: state.textEditingPageState.textElementsBeforeChanges,
  };
});
