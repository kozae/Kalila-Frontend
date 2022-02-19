import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { ILine } from '@frontend/domain';

export const linesAdapter = createEntityAdapter<Omit<ILine, 'Tokens'>>({
  selectId: (doc) => doc._id,
});

const initialState = linesAdapter.getInitialState();

export const linesSlice = createSlice({
  name: 'lines',
  initialState,
  reducers: {
    loadLines: linesAdapter.setAll,
    clearLines: linesAdapter.removeAll,
  },
});

export const { loadLines, clearLines } = linesSlice.actions;
