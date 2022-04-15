import { createAsyncThunk } from "@reduxjs/toolkit";
import { IUnitSummary } from "@frontend/domain";
import { ThunkApi } from "../../config";
import { orderBy } from "lodash";

export const closeUnit = createAsyncThunk<{ data?: IUnitSummary },
  { data: { page: number; line: number; token: number } },
  ThunkApi>("unitSummaries/closeUnit", async ({ data }, { getState }) => {
  const state = getState();
  const units = orderBy(Object.values(state.unitSummaries.entities).filter(
    (unit) => unit
      && (
        unit.StartsInPageNumber < data.page
        || (
          unit.StartsInPageNumber === data.page
          && unit.StartsInLineNumber < data.line
        )
        || (
          unit.StartsInPageNumber === data.page
          && unit.StartsInLineNumber === data.line
          && unit.FirstTokenOrderInLine < data.token
        )
      )
  ), ["StartsInPageNumber", "StartsInLineNumber", "FirstTokenOrderInLine"], ["desc", "desc", "desc"]);


  const unitToUpdate = units[0] ?? state.pageData.pageInfo.NearestOpenUnit as IUnitSummary | undefined;

  if (unitToUpdate) {
    return {
      data: {
        ...unitToUpdate,
        EndsInPageNumber: data.page,
        EndsInLineNumber: data.line,
        LastTokenOrderInLine: data.token
      }
    };
  }

  return {};
});
