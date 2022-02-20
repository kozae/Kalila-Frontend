import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

export interface IAttribute {
  DocAndField: string;
  Field: string;
  Options: string[];
}

export const attributesAdapter = createEntityAdapter<IAttribute>({
  selectId: (doc) => doc.DocAndField,
});

const initialState = attributesAdapter.getInitialState();

export const attributesSlice = createSlice({
  name: 'attributes',
  initialState,
  reducers: {
    loadAttributes: attributesAdapter.setAll,
    addAttributes: attributesAdapter.addMany,
    clearAttributes: attributesAdapter.removeAll,
  },
});

export const { loadAttributes, addAttributes, clearAttributes } =
  attributesSlice.actions;
