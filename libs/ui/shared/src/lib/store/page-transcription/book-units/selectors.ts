import { bookUnitsAdapter, BookUnitsState } from './slice';
import { createSelector } from '@reduxjs/toolkit';
import { stringHasValue } from '@frontend/util';
import { orderBy } from 'lodash';

const selectBookUnitsState = (state: BookUnitsState) => state.bookUnits;

export const {
  selectAll: selectAllBookUnits,
  selectById: selectBookUnitById,
  selectIds: selectAllBookUnitIds,
} = bookUnitsAdapter.getSelectors<BookUnitsState>(selectBookUnitsState);

export const selectBookUnitsWithFilter = createSelector(
  [selectAllBookUnits, (state, filter: string) => filter],
  (bookUnits, filter) => {
    let result = bookUnits;
    if (stringHasValue(filter)) {
      result = bookUnits.filter((bu) =>
        bu.Title.toLowerCase().includes(filter.trim().toLowerCase())
      );
    }

    return orderBy(result, ['NumericalOrder']);
  }
);

export const selectBookUnitOrders = createSelector(
  selectAllBookUnits,
  (bookUnits) => bookUnits.map((bu) => bu.Order)
);
