import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../config';
import { regionDataUrlAdapter } from './slice';

const selectRegionDataUrlState = (state: RootState) => state.regionDataUrls;
const selectIds = (state: RootState, ids: string[]) => ids;

export const {
  selectEntities: selectRegionDataUrlEntities,
  selectAll: selectAllRegionDataUrl,
  selectById: selectRegionDataUrlById,
} = regionDataUrlAdapter.getSelectors<RootState>(selectRegionDataUrlState);

export const selectManyRegionDataUrlById = createSelector(
  [selectAllRegionDataUrl, selectIds],
  (items, ids) => {
    const result: Record<string, string> = {};
    items
      .filter((i) => ids.includes(i.id))
      .forEach((i) => (result[i.id] = i.data));
    return result;
  }
);
