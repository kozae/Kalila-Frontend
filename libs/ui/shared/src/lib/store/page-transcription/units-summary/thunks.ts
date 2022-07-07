import { createAsyncThunk } from '@reduxjs/toolkit';
import { IUnitSummary } from '@frontend/domain';
import { ThunkApi } from '../../config';
import {
  determineEndBasedOnNextUnit,
  determinePrevUnitEnd,
  getOrderedUnits,
  getPrevUnit,
} from './helpers';
import { orderUnits } from '@frontend/util';

export const closeUnit = createAsyncThunk<
  { data?: IUnitSummary },
  { data: { page: number; line: number; token: number } },
  ThunkApi
>('unitSummaries/closeUnit', async ({ data }, { getState }) => {
  const state = getState();
  const units = orderUnits(
    Object.values(state.unitSummaries.entities).filter(
      (unit) =>
        unit &&
        (unit.Start[0] < data.page ||
          (unit.Start[0] === data.page && unit.Start[1] < data.line) ||
          (unit.Start[0] === data.page &&
            unit.Start[1] === data.line &&
            unit.Start[2] < data.token))
    ) as IUnitSummary[]
  );

  const unitToUpdate =
    units[0] ??
    (state.pageData.pageInfo.NearestOpenUnit as IUnitSummary | undefined);

  if (unitToUpdate) {
    return {
      data: {
        ...unitToUpdate,
        EndsInPageNumber: data.page,
        EndsInLineNumber: data.line,
        LastTokenOrderInLine: data.token,
      },
    };
  }

  return {};
});

export const moveUnit = createAsyncThunk<
  { data: IUnitSummary[] },
  {
    unit: IUnitSummary;
    newLocation: [number, number, number];
  },
  ThunkApi
>('unitSummaries/moveUnit', async ({ unit, newLocation }, { getState }) => {
  const state = getState();

  const orderedUnits = getOrderedUnits(state);
  const current = orderedUnits.findIndex((u) => u.Id === unit.Id);
  if (current > orderedUnits.length - 1) {
    const nextUnit = orderedUnits[current + 1];
    unit = determineEndBasedOnNextUnit(unit, nextUnit, state);
  }
  // find if a unit was closed by the moved-unit start tag
  let prevUnit = getPrevUnit(unit, state);

  if (prevUnit !== undefined) {
    prevUnit = determinePrevUnitEnd(prevUnit, newLocation, state);
    if (prevUnit !== undefined) {
      return {
        data: [
          {
            ...unit,
            ...newLocation,
          },
          prevUnit,
        ],
      };
    }
  }

  return { data: [{ ...unit, ...newLocation }] };
});
