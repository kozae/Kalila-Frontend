import { attributesAdapter } from './slice';
import { RootState } from '../../config';
import { createSelector } from '@reduxjs/toolkit';

const selectAttributesState = (state: RootState) => state.attributes;

const { selectAll } = attributesAdapter.getSelectors<RootState>(
  selectAttributesState
);

export const selectAttributes = createSelector(selectAll, (attributes) => {
  const map: Record<string, string[]> = {};
  attributes.forEach((att) => (map[att.Field] = att.Options));
  return map;
});
