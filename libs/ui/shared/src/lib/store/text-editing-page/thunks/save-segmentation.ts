import { createAsyncThunk } from '@reduxjs/toolkit';
import { IUnitSummary } from '@frontend/domain';
import { ThunkApi } from '@frontend/shared-ui';
import { saveThunk } from './save';
import {
  identifyChanges,
  nearestOpenUnitClosed,
  openedUnitFromPreviousPage,
  postPageUnits,
  processUnits,
} from './requests';

export const saveSegmentation = createAsyncThunk<
  {
    units: IUnitSummary[];
    nearestOpenUnitClosed: boolean;
    openedUnitFromPreviousPage?: IUnitSummary;
  },
  { closeNearestOpenUnit: boolean },
  ThunkApi
>(
  saveThunk.segmentationChanges,
  async ({ closeNearestOpenUnit }, { getState }) => {
    const state = getState();
    const units = closeNearestOpenUnit
      ? processUnits(state, state.pageData.pageInfo.NearestOpenUnit)
      : processUnits(state, null);
    console.log({ units });
    const changes = identifyChanges(units, state);
    await postPageUnits(changes, state);

    return {
      units: [
        ...units.filter((u: any) => u.Id.length === 24),
        ...changes.newUnits,
      ],
      nearestOpenUnitClosed: nearestOpenUnitClosed(changes.updatedUnits, state),
      openedUnitFromPreviousPage: openedUnitFromPreviousPage(
        changes.updatedUnits,
        state
      ),
    };
  }
);
