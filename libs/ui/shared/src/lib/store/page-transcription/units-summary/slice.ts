import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IUnitSummary } from '@frontend/domain';

export const unitSummariesAdapter = createEntityAdapter<IUnitSummary>({
  selectId: (doc) => doc.Id,
});

const initialState = unitSummariesAdapter.getInitialState();

export const unitSummariesSlice = createSlice({
  name: 'unitSummaries',
  initialState,
  reducers: {
    loadUnitSummaries: unitSummariesAdapter.setAll,
    clearUnitSummaries: unitSummariesAdapter.removeAll,
  },
});

export const { loadUnitSummaries, clearUnitSummaries } =
  unitSummariesSlice.actions;
