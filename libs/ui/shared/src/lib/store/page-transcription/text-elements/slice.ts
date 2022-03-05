import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { ITextElement } from '@frontend/domain';

export const textElementsAdapter = createEntityAdapter<
  Omit<ITextElement, 'Lines'>
>({
  selectId: (doc) => doc._id,
});

const initialState = textElementsAdapter.getInitialState();

export const textElementsSlice = createSlice({
  name: 'textElements',
  initialState,
  reducers: {
    loadTextElements: textElementsAdapter.setAll,
    addTextElement: textElementsAdapter.addOne,
    updateTextElement: textElementsAdapter.updateOne,
    clearTextElements: textElementsAdapter.removeAll,
  },
});

export const {
  loadTextElements,
  updateTextElement,
  clearTextElements,
  addTextElement,
} = textElementsSlice.actions;
