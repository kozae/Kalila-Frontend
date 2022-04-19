import { createAsyncThunk } from "@reduxjs/toolkit";
import { IUnitSummary } from "@frontend/domain";
import { ThunkApi } from "@frontend/shared-ui";
import { saveThunk } from "./save";
import { orderBy } from "lodash";

export const saveSegmentation = createAsyncThunk<{
  units: IUnitSummary[];
  nearestOpenUnitClosed: boolean;
},
  { closeNearestOpenUnit: boolean },
  ThunkApi>(saveThunk.segmentationChanges, async ({ closeNearestOpenUnit }, { getState }) => {
  const state = getState();
  const unitsInStore = orderBy(
    Object.values(state.unitSummaries.entities)
      .filter(unit => unit !== undefined),
    ["StartsInPageNumber", "StartsInLineNumber", "FirstTokenOrderInLine"],
    ["asc", "asc", "asc"]
  ) as IUnitSummary[];
  if (closeNearestOpenUnit && state.pageData.pageInfo.NearestOpenUnit) {
    console.log({ unitsInStore });
  }
  // todo if any units have open ends, attempt to calculate the end of these units
  return {
    units: [],
    nearestOpenUnitClosed: false
  };
});
