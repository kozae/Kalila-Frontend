import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

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
});

export const { loadDataUrls, addDataUrl, clearDataUrls } =
  regionDataUrlsSlice.actions;
