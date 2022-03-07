import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IImageElement } from '@frontend/domain';
import {
  discardLayoutChanges,
  saveLayoutChanges,
} from '../../text-editing-page/thunks';
import { reorderLayoutElements } from '../actions';
import { action } from '@storybook/addon-actions';

export const imageElementsAdapter = createEntityAdapter<IImageElement>({
  selectId: (doc) => doc._id,
});

const initialState = imageElementsAdapter.getInitialState();

export const imageElementsSlice = createSlice({
  name: 'imageElements',
  initialState,
  reducers: {
    loadImageElements: imageElementsAdapter.setAll,
    addImageElement: imageElementsAdapter.addOne,
    removeImageElement: imageElementsAdapter.removeOne,
    updateImageElement: imageElementsAdapter.updateOne,
    cancelCreateImageElement: imageElementsAdapter.removeOne,
    clearImageElements: imageElementsAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder.addCase(discardLayoutChanges.fulfilled, (state, action) => {
      imageElementsAdapter.setAll(state, action.payload.ImageElements);
    });
    builder.addCase(saveLayoutChanges.fulfilled, (state, action) => {
      imageElementsAdapter.setAll(state, action.payload.Images);
    });
  },
});

export const {
  loadImageElements,
  updateImageElement,
  clearImageElements,
  cancelCreateImageElement,
  addImageElement,
  removeImageElement,
} = imageElementsSlice.actions;
