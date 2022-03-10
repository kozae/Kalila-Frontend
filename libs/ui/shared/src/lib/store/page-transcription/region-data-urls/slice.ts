import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { saveLayoutChanges } from '../../text-editing-page';

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
    clearDataUrls: regionDataUrlAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder.addCase(saveLayoutChanges.fulfilled, (state, action) => {
      regionDataUrlAdapter.setAll(state, action.payload.dataUrls);
    });
  },
});

export const { loadDataUrls, addDataUrl, clearDataUrls } =
  regionDataUrlsSlice.actions;
