import {
  createEntityAdapter,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';

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

export type AttributeState = {
  [attributesSlice.name]: EntityState<IAttribute>;
};

export const { loadAttributes, addAttributes, clearAttributes } =
  attributesSlice.actions;
