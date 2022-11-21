import { attributesAdapter, AttributeState } from './slice';
import { createSelector } from '@reduxjs/toolkit';

const selectAttributesState = (state: AttributeState) => state.attributes;

const { selectAll } = attributesAdapter.getSelectors<AttributeState>(
  selectAttributesState
);

export const selectAttributes = createSelector(selectAll, (attributes) => {
  const map: Record<string, string[]> = {};
  attributes.forEach((att) => (map[att.Field] = att.Options));
  return map;
});
