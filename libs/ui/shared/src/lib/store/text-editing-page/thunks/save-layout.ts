import { createAsyncThunk } from '@reduxjs/toolkit';
import { IImageElement, ITextElement } from '@frontend/domain';
import { ThunkApi } from '@frontend/shared-ui';
import {
  deleteLayout,
  postLayout,
  putImages,
  putTextElements,
} from './requests';
import { saveThunk } from './save';

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
        (t: any) => !changes.TextElementIds.includes(t.Id)
      ),
      ...changes.TextElements,
    ] as Omit<ITextElement, 'Lines'>[],
    Images: [
      ...Object.values(state.imageElements.entities).filter(
        (t: any) => !changes.ImageIds.includes(t.Id)
      ),
      ...changes.Images,
    ] as IImageElement[],
  };
});
