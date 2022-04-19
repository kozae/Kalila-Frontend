import { createAsyncThunk } from "@reduxjs/toolkit";
import { IUnitSummary } from "@frontend/domain";
import { ThunkApi } from "../../config";
import { maxBy, orderBy } from "lodash";

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


export const moveUnit = createAsyncThunk<{ data: IUnitSummary[] },
  {
    unit: IUnitSummary,
    newLocation: {
      StartsInPageNumber: number,
      StartsInLineNumber: number,
      FirstTokenOrderInLine: number
    }
  },
  ThunkApi>("unitSummaries/moveUnit", async ({ unit, newLocation }, { getState }) => {
  const state = getState();
  // find if a unit was closed by the moved-unit start tag
  let prevUnit: IUnitSummary | undefined = undefined;
  if (unit.FirstTokenOrderInLine !== 0) {
    prevUnit = Object.values(state.unitSummaries.entities)
      .find((u) => u
        && u.EndsInLineNumber === unit.StartsInLineNumber
        && u.LastTokenOrderInLine === unit.FirstTokenOrderInLine - 1);
  } else {
    prevUnit = maxBy(Object.values(state.unitSummaries.entities)
      .filter((u) => u
        && u.EndsInLineNumber === unit.StartsInLineNumber - 1), "LastTokenOrderInLine");
  }

  if (prevUnit !== undefined) {
    if (newLocation.FirstTokenOrderInLine !== 0) {
      return {
        data: [
          {
            ...unit,
            ...newLocation
          },
          {
            ...prevUnit,
            EndsInPageNumber: newLocation.StartsInPageNumber,
            EndsInLineNumber: newLocation.StartsInLineNumber,
            LastTokenOrderInLine: newLocation.FirstTokenOrderInLine - 1
          }
        ]
      };
    } else {
      const line = Object.values(state.lines.entities).find((l) =>
        l && l.LineOrder === newLocation.StartsInLineNumber - 1);
      if (line) {
        const tokenCount = Object.values(state.tokens.entities)
          .filter((t) => t && t.LineId === line.Id).length;
        return {
          data: [
            {
              ...unit,
              ...newLocation
            },
            {
              ...prevUnit,
              EndsInPageNumber: newLocation.StartsInPageNumber,
              EndsInLineNumber: newLocation.StartsInLineNumber - 1,
              LastTokenOrderInLine: tokenCount - 1
            }
          ]
        };
      }

    }
  }

  return { data: [{ ...unit, ...newLocation }] };
});
