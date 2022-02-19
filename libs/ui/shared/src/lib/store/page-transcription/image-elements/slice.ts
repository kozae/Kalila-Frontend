import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IImageElement } from '@frontend/domain';

export const imageElementsAdapter = createEntityAdapter<IImageElement>({
  selectId: (doc) => doc._id,
});

const initialState = imageElementsAdapter.getInitialState();

export const imageElementsSlice = createSlice({
  name: 'imageElements',
  initialState,
  reducers: {
    loadImageElements: imageElementsAdapter.setAll,
    clearImageElements: imageElementsAdapter.removeAll,
  },
});

export const { loadImageElements, clearImageElements } =
  imageElementsSlice.actions;
