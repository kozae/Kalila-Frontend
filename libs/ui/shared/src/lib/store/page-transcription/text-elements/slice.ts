import {
  createEntityAdapter,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';
import { ITextElement } from '@frontend/domain';
import {
  discardLayoutChanges,
  saveLayoutChanges,
} from '../../text-editing-page/thunks';

export const textElementsAdapter = createEntityAdapter<
  Omit<ITextElement, 'Lines'>
>({
  selectId: (doc) => doc.Id,
});

const initialState = textElementsAdapter.getInitialState();

export const textElementsSlice = createSlice({
  name: 'textElements',
  initialState,
  reducers: {
    loadTextElements: textElementsAdapter.setAll,
    addTextElement: textElementsAdapter.addOne,
    removeTextElement: textElementsAdapter.removeOne,
    cancelCreateTextElement: textElementsAdapter.removeOne,
    updateTextElement: textElementsAdapter.updateOne,
    clearTextElements: textElementsAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder.addCase(discardLayoutChanges.fulfilled, (state, action) => {
      textElementsAdapter.setAll(state, action.payload.TextElements);
    });
    builder.addCase(saveLayoutChanges.fulfilled, (state, action) => {
      textElementsAdapter.setAll(state, action.payload.TextElements);
    });
  },
});

export type TextElementState = {
  [textElementsSlice.name]: EntityState<Omit<ITextElement, 'Lines'>>;
};

export const {
  loadTextElements,
  updateTextElement,
  clearTextElements,
  addTextElement,
  cancelCreateTextElement,
  removeTextElement,
} = textElementsSlice.actions;
