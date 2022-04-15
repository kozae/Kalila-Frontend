import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { IUnitSummary } from "@frontend/domain";
import { closeUnit } from "./thunks";

export const unitSummariesAdapter = createEntityAdapter<IUnitSummary>({
  selectId: (doc) => doc.Id
});

const initialState = unitSummariesAdapter.getInitialState();

export const unitSummariesSlice = createSlice({
  name: "unitSummaries",
  initialState,
  reducers: {
    loadUnitSummaries: unitSummariesAdapter.setAll,
    insertUnit: unitSummariesAdapter.addOne,
    updateUnit: unitSummariesAdapter.updateOne,
    clearUnitSummaries: unitSummariesAdapter.removeAll
  },
  extraReducers: (builder) => {
    builder.addCase(closeUnit.fulfilled, (state, action) => {
      if (action.payload.data !== undefined) {
        unitSummariesAdapter.upsertOne(state, action.payload.data);
      }
    });
  }
});

export const { loadUnitSummaries, clearUnitSummaries, insertUnit, updateUnit } =
  unitSummariesSlice.actions;
