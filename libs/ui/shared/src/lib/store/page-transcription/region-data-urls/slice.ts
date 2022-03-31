import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { saveLayoutChanges, saveLineChanges } from '../../text-editing-page';

export const regionDataUrlAdapter = createEntityAdapter<{
  id: string;
  data: string;
}>({
  selectId: (doc) => doc.id,
});

const initialState = regionDataUrlAdapter.getInitialState();

export const regionDataUrlsSlice = createSlice({
  name: 'regionDataUrls',
  initialState,
  reducers: {
    loadDataUrls: regionDataUrlAdapter.setAll,
    addDataUrl: regionDataUrlAdapter.upsertOne,
    addManyDataUrls: regionDataUrlAdapter.upsertMany,
    clearDataUrls: regionDataUrlAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder.addCase(saveLayoutChanges.fulfilled, (state, action) => {
      regionDataUrlAdapter.setAll(state, action.payload.dataUrls);
    });
    builder.addCase(saveLineChanges.fulfilled, (state, action) => {
      regionDataUrlAdapter.setAll(state, action.payload.dataUrls);
    });
  },
});

export const { loadDataUrls, addDataUrl, addManyDataUrls, clearDataUrls } =
  regionDataUrlsSlice.actions;
