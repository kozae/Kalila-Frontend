import { createAsyncThunk } from '@reduxjs/toolkit';
import { IUnitSummary } from '@frontend/domain';
import { ThunkApi } from '@frontend/shared-ui';
import { saveThunk } from './save';
import {
  identifyChangeType,
  patchUnits,
  postUnits,
  processUnits,
} from './requests';

export const saveSegmentation = createAsyncThunk<
  {
    units: IUnitSummary[];
    nearestOpenUnitClosed: boolean;
  },
  { closeNearestOpenUnit: boolean },
  ThunkApi
>(
  saveThunk.segmentationChanges,
  async ({ closeNearestOpenUnit }, { getState }) => {
    console.log('saving units');
    const state = getState();
    const units = processUnits(state);
    const { newUnits, updatedUnits } = identifyChangeType(units, state);

    await postUnits(newUnits, state);
    await patchUnits(updatedUnits, state);

    // if (closeNearestOpenUnit && state.pageData.pageInfo.NearestOpenUnit) {
    //   // TODO: close nearest open unit if present
    // }

    return {
      units: [...units.filter((u) => u.Id.length === 24), ...newUnits],
      nearestOpenUnitClosed: false,
    };
  }
);
