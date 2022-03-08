import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { generateDataUrls } from './thunks';
import { createRegionsDataUrls } from '@frontend/ui/facsimile';

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
    builder.addCase(generateDataUrls.fulfilled, (state, action) => {
      const onCreate = (id: string, data: string) =>
        regionDataUrlAdapter.upsertOne(state, { id, data });
      createRegionsDataUrls(
        action.payload.data,
        action.payload.fabricImg,
        onCreate
      );
    });
  },
});

export const { loadDataUrls, addDataUrl, clearDataUrls } =
  regionDataUrlsSlice.actions;
