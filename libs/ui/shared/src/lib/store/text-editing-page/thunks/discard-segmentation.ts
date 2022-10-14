import { createAsyncThunk } from '@reduxjs/toolkit';
import { IUnitSummary } from '@frontend/domain';
import { ThunkApi } from '@frontend/shared-ui';
import { sleeper } from '@frontend/util';
import { discardThunk } from './discard';

export const discardSegmentationChanges = createAsyncThunk<
  {
    units: IUnitSummary[];
    nearestOpenUnit: IUnitSummary | null;
  },
  any,
  ThunkApi
>(discardThunk.segmentationChanges, async ({}, { getState }) => {
  const state = getState();
  await sleeper(10);
  return {
    units: state.textEditingPageState.unitSummariesBeforeChanges,
    nearestOpenUnit: state.textEditingPageState.nearestOpenUnitBeforeChanges,
  };
});
