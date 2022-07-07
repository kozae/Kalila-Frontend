import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { IUnitSummary } from '@frontend/domain';
import { closeUnit, moveUnit } from './thunks';
import { discardSegmentationChanges } from '../../text-editing-page/thunks/discard-segmentation';
import { saveSegmentation } from '../../text-editing-page';

export const unitSummariesAdapter = createEntityAdapter<IUnitSummary>({
  selectId: (doc) => doc.Id,
});

const initialState = unitSummariesAdapter.getInitialState();

export const unitSummariesSlice = createSlice({
  name: 'unitSummaries',
  initialState,
  reducers: {
    loadUnitSummaries: unitSummariesAdapter.setAll,
    insertUnit: unitSummariesAdapter.addOne,
    updateUnit: unitSummariesAdapter.updateOne,
    removeUnit: unitSummariesAdapter.removeOne,
    removeUnitEndTag: (state, action: PayloadAction<string>) => {
      unitSummariesAdapter.updateOne(state, {
        id: action.payload,
        changes: {
          End: [-1, -1, -1],
        },
      });
    },
    clearUnitSummaries: unitSummariesAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder.addCase(closeUnit.fulfilled, (state, action) => {
      if (action.payload.data !== undefined) {
        unitSummariesAdapter.upsertOne(state, action.payload.data);
      }
    });
    builder.addCase(moveUnit.fulfilled, (state, action) => {
      unitSummariesAdapter.upsertMany(state, action.payload.data);
    });
    builder.addCase(discardSegmentationChanges.fulfilled, (state, action) => {
      unitSummariesAdapter.setAll(state, action.payload.units);
    });
    builder.addCase(saveSegmentation.fulfilled, (state, action) => {
      unitSummariesAdapter.setAll(state, action.payload.units);
    });
  },
});

export const {
  loadUnitSummaries,
  clearUnitSummaries,
  insertUnit,
  updateUnit,
  removeUnit,
  removeUnitEndTag,
} = unitSummariesSlice.actions;
