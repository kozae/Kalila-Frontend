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
import ObjectID from 'bson-objectid';

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
    const changes = identifyChanges(units, state);
    const lacunae = Object.values(state.unitSummaries.entities)
      .filter((u) => u && u.Lacuna)
      .map((u) => ({ ...u, Id: ObjectID().toString() })) as IUnitSummary[];
    if (lacunae.length === 0) {
      await postPageUnits(changes, state);
    } else {
      await postPageUnits(changes, state, lacunae);
    }

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
