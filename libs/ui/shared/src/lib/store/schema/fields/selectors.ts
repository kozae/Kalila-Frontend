import { createSelector } from '@reduxjs/toolkit';
import { fieldsAdapter, FieldsState } from './slice';

const selectFieldsState = (state: FieldsState) => state.fields;
const selectFilter = (
  state: FieldsState,
  filter: Record<'FieldGroup', string | undefined>
) => filter;

const { selectAll } =
  fieldsAdapter.getSelectors<FieldsState>(selectFieldsState);

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
