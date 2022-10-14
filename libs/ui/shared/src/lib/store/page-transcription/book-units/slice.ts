import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { IBookUnit } from '@frontend/domain';
import { updateBookUnit } from './thunks';
import { orderBy } from 'lodash';

export const bookUnitsAdapter = createEntityAdapter<
  IBookUnit & { ManuscriptInfo: string | null }
>({
  selectId: (doc) => doc.Id,
});

const initialState = bookUnitsAdapter.getInitialState();

export const bookUnitsSlice = createSlice({
  name: 'bookUnits',
  initialState,
  reducers: {
    loadBookUnits: bookUnitsAdapter.setAll,
    updateBookUnit: bookUnitsAdapter.updateOne,
    removeBookUnit: bookUnitsAdapter.removeOne,
    clearBookUnits: bookUnitsAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder.addCase(updateBookUnit.fulfilled, (state, action) => {
      bookUnitsAdapter.updateOne(state, action.payload);
    });
  },
});

export type BookUnitsState = {
  [bookUnitsSlice.name]: EntityState<
    IBookUnit & { ManuscriptInfo: string | null }
  >;
};

export const { loadBookUnits, removeBookUnit, clearBookUnits } =
  bookUnitsSlice.actions;
