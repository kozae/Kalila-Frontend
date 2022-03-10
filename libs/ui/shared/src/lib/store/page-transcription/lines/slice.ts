import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { ILine } from '@frontend/domain';
import { discardLineChanges } from '../../text-editing-page';

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
    loadGeneratedLines: linesAdapter.setAll,
    clearLines: linesAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder.addCase(discardLineChanges.fulfilled, (state, action) => {
      linesAdapter.setAll(state, action.payload.Lines);
    });
  },
});

export const { loadLines, loadGeneratedLines, clearLines } = linesSlice.actions;
