import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { ILine } from '@frontend/domain';
import { discardLineChanges, saveLineChanges } from '../../text-editing-page';

export const linesAdapter = createEntityAdapter<
  Omit<ILine, 'Tokens'> & { ElementId: string }
>({
  selectId: (doc) => doc._id,
});

const initialState = linesAdapter.getInitialState();

export const linesSlice = createSlice({
  name: 'lines',
  initialState,
  reducers: {
    loadLines: linesAdapter.setAll,
    addLine: linesAdapter.addOne,
    loadGeneratedLines: linesAdapter.setAll,
    updateLine: linesAdapter.updateOne,
    updateManyLines: linesAdapter.updateMany,
    cancelCreateLine: linesAdapter.removeOne,
    deleteLine: linesAdapter.removeOne,
    clearLines: linesAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder.addCase(discardLineChanges.fulfilled, (state, action) => {
      linesAdapter.setAll(state, action.payload.Lines);
    });
    builder.addCase(saveLineChanges.fulfilled, (state, action) => {
      linesAdapter.setAll(state, action.payload.Lines);
    });
  },
});

export const {
  loadLines,
  addLine,
  updateLine,
  updateManyLines,
  cancelCreateLine,
  deleteLine,
  loadGeneratedLines,
  clearLines,
} = linesSlice.actions;
