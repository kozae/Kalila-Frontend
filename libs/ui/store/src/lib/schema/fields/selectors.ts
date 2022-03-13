import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../config';
import { fieldsAdapter } from './slice';

const selectFieldsState = (state: RootState) => state.fields;
const selectFilter = (
  state: RootState,
  filter: Record<'FieldGroup', string | undefined>
) => filter;

const { selectAll } = fieldsAdapter.getSelectors<RootState>(selectFieldsState);

export const selectFields = createSelector(
  [selectAll, selectFilter],
  (fields, filter = { FieldGroup: undefined }) => {
    if (filter.FieldGroup) {
      return fields.filter(
        (f) =>
          f.TopField ||
          (f.FieldGroup === filter.FieldGroup && f.InputMode !== 15)
      );
    }
    return fields.filter((f) => f.InputMode !== 15);
  }
);
