import { createAsyncThunk } from '@reduxjs/toolkit';
import { IUnitSummary } from '@frontend/domain';
import { ThunkApi } from '@frontend/shared-ui';
import { saveThunk } from './save';
import { identifyChanges, postPageUnits, processUnits } from './requests';

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
    const state = getState();
    const units = processUnits(state);
    const changes = identifyChanges(units, state);

    await postPageUnits(changes, state);

    // if (closeNearestOpenUnit && state.pageData.pageInfo.NearestOpenUnit) {
    //   // TODO: close nearest open unit if present
    // }

    return {
      units: [
        ...units.filter((u: any) => u.Id.length === 24),
        ...changes.newUnits,
      ],
      nearestOpenUnitClosed: false,
    };
  }
);
