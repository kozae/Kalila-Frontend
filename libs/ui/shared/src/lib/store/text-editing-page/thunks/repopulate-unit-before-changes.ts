import { createAsyncThunk } from '@reduxjs/toolkit';
import { IUnitSummary } from '@frontend/domain';
import { ThunkApi } from '@frontend/shared-ui';

export const repopulateUnitSummariesBeforeChanges = createAsyncThunk<
  {
    units: IUnitSummary[];
    nearestOpenUnit: IUnitSummary | null;
  },
  {},
  ThunkApi
>(
  'textEditingPageState/repopulateUnitSummariesBeforeChanges',
  async ({}, { getState }) => {
    const state = getState();

    return {
      units: Object.values(state.unitSummaries.entities) as IUnitSummary[],
      nearestOpenUnit: state.pageData.pageInfo.NearestOpenUnit,
    };
  }
);
