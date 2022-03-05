import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IImageElement } from '@frontend/domain';
import { discardLayoutChanges } from '../../text-editing-page/thunks';

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
    updateImageElement: imageElementsAdapter.updateOne,
    clearImageElements: imageElementsAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder.addCase(discardLayoutChanges.fulfilled, (state, action) => {
      imageElementsAdapter.setAll(state, action.payload.ImageElements);
    });
  },
});

export const {
  loadImageElements,
  updateImageElement,
  clearImageElements,
  addImageElement,
} = imageElementsSlice.actions;
