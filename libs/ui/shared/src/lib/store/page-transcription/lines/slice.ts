import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { ILine } from '@frontend/domain';
import { discardLineChanges, saveLineChanges } from '../../text-editing-page';

export const linesAdapter = createEntityAdapter<
  Omit<ILine, 'Tokens'> & { ElementId: string }
>({
  selectId: (doc) => doc.Id,
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
    moveLines: (
      state,
      action: PayloadAction<
        { LineId: string; Target: string; LineOrder: number }[]
      >
    ) => {
      linesAdapter.updateMany(
        state,
        action.payload.map((d) => ({
          id: d.LineId,
          changes: { ElementId: d.Target, LineOrder: d.LineOrder },
        }))
      );
    },
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

export type LinesState = {
  [linesSlice.name]: EntityState<Omit<ILine, 'Tokens'> & { ElementId: string }>;
};

export const {
  loadLines,
  addLine,
  updateLine,
  moveLines,
  updateManyLines,
  cancelCreateLine,
  deleteLine,
  loadGeneratedLines,
  clearLines,
} = linesSlice.actions;
