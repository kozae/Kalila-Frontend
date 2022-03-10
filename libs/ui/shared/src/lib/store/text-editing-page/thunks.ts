import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkApi } from '@frontend/shared-ui';
import { IImageElement, ILine, ITextElement } from '@frontend/domain';
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
  lineChanges: 'discard/textEditingPageState/lineChanges',
};

export const saveThunk = {
  prefix: 'save/textEditingPageState',
  layoutChanges: 'save/textEditingPageState/layoutChanges',
  lineChanges: 'save/textEditingPageState/lineChanges',
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

export const discardLineChanges = createAsyncThunk<
  {
    Lines: (Omit<ILine, 'Tokens'> & { ElementId: string })[];
  },
  any,
  ThunkApi
>(discardThunk.lineChanges, async ({}, { getState }) => {
  const state = getState();
  await sleeper(10);
  return {
    Lines: state.textEditingPageState.linesBeforeChanges,
  };
});

export const saveLayoutChanges = createAsyncThunk<
  {
    TextElements: Omit<ITextElement, 'Lines'>[];
    Images: IImageElement[];
    dataUrls: {
      id: string;
      data: string;
    }[];
  },
  any,
  ThunkApi
>(saveThunk.layoutChanges, async ({}, { getState }) => {
  const state = getState();
  const changes = await postLayout(state);
  await deleteLayout(state);
  await putTextElements(state);
  await putImages(state);
  const dataUrls: {
    id: string;
    data: string;
  }[] = [];
  Object.values(state.regionDataUrls.entities).forEach((item) => {
    if (item) {
      const textElIndex = changes.TextElementIds.indexOf(item.id);
      if (textElIndex !== -1) {
        dataUrls.push({
          id: changes.TextElements[textElIndex].Id,
          data: item.data,
        });
        return;
      }
      const imageElIndex = changes.ImageIds.indexOf(item.id);
      if (imageElIndex !== -1) {
        dataUrls.push({
          id: changes.Images[imageElIndex].Id,
          data: item.data,
        });
        return;
      }
      dataUrls.push(item);
    }
  });
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
    dataUrls,
  };
});

export const saveLineChanges = createAsyncThunk<
  {
    Lines: (Omit<ILine, 'Tokens'> & { ElementId: string })[];
    dataUrls: {
      id: string;
      data: string;
    }[];
  },
  any,
  ThunkApi
>(saveThunk.lineChanges, async ({}, { getState }) => {
  const state = getState();
  return {
    Lines: [],
    dataUrls: [],
  };
});
