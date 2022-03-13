import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IDataEntrySchema } from '@frontend/util';

export const fieldsAdapter = createEntityAdapter<IDataEntrySchema>({
  selectId: (doc) => `${doc.DocumentName}.${doc.FieldNamePascalCase}`,
});

const initialState = fieldsAdapter.getInitialState();

export const fieldsSlice = createSlice({
  name: 'fields',
  initialState,
  reducers: {
    loadFields: fieldsAdapter.setAll,
    addFields: fieldsAdapter.addMany,
    clearFields: fieldsAdapter.removeAll,
  },
});

export const { loadFields, addFields, clearFields } = fieldsSlice.actions;
