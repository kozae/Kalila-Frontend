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
import { omit } from 'lodash';

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

export const saveLayoutChanges = createAsyncThunk<
  {
    TextElements: Omit<ITextElement, 'Lines'>[];
    Images: IImageElement[];
  },
  any,
  ThunkApi
>(saveThunk.layoutChanges, async ({}, { getState }) => {
  const state = getState();
  const changes = await postLayout(state);
  await deleteLayout(state);
  await putTextElements(state);
  await putImages(state);
  return {
    TextElements: [
      ...Object.values(state.textElements.entities).filter(
        (t: any) => !changes.TextElementIds.includes(t._id)
      ),
      ...changes.TextElements.map(
        (t) => ({ ...omit(t, 'Id'), _id: t.Id } as Omit<ITextElement, 'Lines'>)
      ),
    ] as Omit<ITextElement, 'Lines'>[],
    Images: [
      ...Object.values(state.imageElements.entities).filter(
        (t: any) => !changes.ImageIds.includes(t._id)
      ),
      ...changes.Images.map(
        (t) => ({ ...omit(t, 'Id'), _id: t.Id } as IImageElement)
      ),
    ] as IImageElement[],
  };
});
