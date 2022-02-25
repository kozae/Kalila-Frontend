import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../config';
import { regionDataUrlAdapter } from './slice';

const selectRegionDataUrlState = (state: RootState) => state.regionDataUrls;

export const {
  selectEntities: selectRegionDataUrlEntities,
  selectAll: selectAllRegionDataUrl,
  selectById: selectRegionDataUrlByIdAdapter,
} = regionDataUrlAdapter.getSelectors<RootState>(selectRegionDataUrlState);

export const selectRegionDataUrl = (id: string | null) =>
  createSelector(selectRegionDataUrlEntities, (entities) => {
    if (id && entities[id] !== undefined) {
      return entities[id]?.data;
    }
    return null;
  });

export const selectManyRegionDataUrlById = (ids: string[]) =>
  createSelector(selectAllRegionDataUrl, (items) => {
    const result: Record<string, string> = {};
    items
      .filter((i) => ids.includes(i.id))
      .forEach((i) => (result[i.id] = i.data));
    return result;
  });

export const selectRegionDataUrlById = (id: string) =>
  createSelector(
    (state: RootState) => state,
    (state) => selectRegionDataUrlByIdAdapter(state, id)
  );
