import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkApi } from '@frontend/shared-ui';
import { IImageElement, ITextElement } from '@frontend/domain';
import { sleeper } from '@frontend/util';
import {
  deleteLayout,
  postLayout,
  putTextElements,
  putImages,
} from './commands';

export const discardThunk = {
  prefix: 'discard/textEditingPageState',
  layoutChanges: 'discard/textEditingPageState/layoutChanges',
};

export const saveThunk = {
  prefix: 'save/textEditingPageState',
  layoutChanges: 'save/textEditingPageState/layoutChanges',
};

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

export const saveLayoutChanges = createAsyncThunk<{}, any, ThunkApi>(
  saveThunk.layoutChanges,
  async ({}, { getState }) => {
    const state = getState();
    await postLayout(state);
    await deleteLayout(state);
    await putTextElements(state);
    await putImages(state);
  }
);
