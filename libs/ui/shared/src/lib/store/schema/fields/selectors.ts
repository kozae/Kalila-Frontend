import { RootState } from '@frontend/shared-ui';
import { createSelector } from '@reduxjs/toolkit';
import { fieldsAdapter } from './slice';

const selectFieldsState = (state: RootState) => state.fields;

const { selectAll } = fieldsAdapter.getSelectors<RootState>(selectFieldsState);

export const selectFields = (
  filter: Record<'FieldGroup', string | undefined> = { FieldGroup: undefined }
) =>
  createSelector(selectAll, (fields) => {
    if (filter.FieldGroup) {
      return fields.filter(
        (f) =>
          f.TopField ||
          (f.FieldGroup === filter.FieldGroup && f.InputMode !== 15)
      );
    }
    return fields.filter((f) => f.InputMode !== 15);
  });
