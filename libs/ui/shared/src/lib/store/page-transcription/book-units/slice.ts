import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { IBookUnit } from '@frontend/domain';
import { insertUnit, removeUnit, replaceUnit } from '../units-summary';

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
    removeLacuna: (
      state,
      action: PayloadAction<{ id: string; lacuna: string }>
    ) => {
      bookUnitsAdapter.updateOne(state, {
        id: action.payload.id,
        changes: { ManuscriptInfo: null },
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(insertUnit, (state, action) => {
      if (action.payload.Lacuna) {
        bookUnitsAdapter.updateOne(state, {
          id: action.payload.BookUnitId,
          changes: { ManuscriptInfo: `lacuna_${action.payload.Id}` },
        });
      } else {
        bookUnitsAdapter.updateOne(state, {
          id: action.payload.BookUnitId,
          changes: { ManuscriptInfo: `${action.payload.Start[0]}` },
        });
      }
    });
    builder.addCase(removeUnit, (state, action) => {
      bookUnitsAdapter.updateOne(state, {
        id: action.payload.bookUnitId,
        changes: { ManuscriptInfo: null },
      });
    });
    builder.addCase(replaceUnit, (state, action) => {
      bookUnitsAdapter.updateOne(state, {
        id: action.payload.msUnit.BookUnitId,
        changes: { ManuscriptInfo: null },
      });
      bookUnitsAdapter.updateOne(state, {
        id: action.payload.bookUnit.Id,
        changes: { ManuscriptInfo: `${action.payload.msUnit.Start[0]}` },
      });
    });
  },
});

export type BookUnitsState = {
  [bookUnitsSlice.name]: EntityState<
    IBookUnit & { ManuscriptInfo: string | null }
  >;
};

export const {
  loadBookUnits,
  removeBookUnit,
  clearBookUnits,
  updateBookUnit,
  removeLacuna,
} = bookUnitsSlice.actions;
