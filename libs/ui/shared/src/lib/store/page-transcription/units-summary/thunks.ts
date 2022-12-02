import { createAsyncThunk, Update } from '@reduxjs/toolkit';
import { IUnitSummary } from '@frontend/domain';
import { ThunkApi } from '../../config';
import {
  determineEndBasedOnNextUnit,
  determinePrevUnitEnd,
  getPrevUnit,
} from './helpers';
import { orderUnits } from '@frontend/util';
import { last } from 'lodash';

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
    units.length !== 0
      ? last(units)
      : (state.pageData.pageInfo.NearestOpenUnit as IUnitSummary | undefined);

  if (unitToUpdate) {
    return {
      data: {
        ...unitToUpdate,
        End: [data.page, data.line, data.token],
      },
    };
  }

  return {};
});

export const removeUnitEndTag = createAsyncThunk<
  {
    openOnPageUnit?: string;
    openUnitFromPreviousPage?: IUnitSummary;
  },
  {
    id: string;
  },
  ThunkApi
>('unitSummaries/removeUnitEndTag', async ({ id }, { getState }) => {
  const state = getState();
  const unit = state.unitSummaries.entities[id];
  if (unit && unit.Start[0] === state.pageData.pageInfo.Number) {
    return {
      openOnPageUnit: id,
    };
  }
  return {
    openUnitFromPreviousPage: unit && { ...unit, End: [-1, -1, -1] },
  };
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

  const orderedUnits = orderUnits(
    Object.values(state.unitSummaries.entities).filter(
      (unit) => unit !== undefined
    ) as IUnitSummary[]
  );
  const current = orderedUnits.findIndex((u) => u.Id === unit.Id);
  if (current < orderedUnits.length - 1) {
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
            Start: newLocation,
          },
          prevUnit,
        ],
      };
    }
  }

  return { data: [{ ...unit, Start: newLocation }] };
});

export const insertUnit = createAsyncThunk<
  { insert: IUnitSummary; update: Update<IUnitSummary>[] },
  IUnitSummary,
  ThunkApi
>('unitSummaries/insertUnit', async (unit, { getState }) => {
  // find the unit before
  const state = getState();
  if (unit.Lacuna) {
    return { insert: unit, update: [] };
  }
  const units = orderUnits(
    Object.values(state.unitSummaries.entities).filter(
      (u) =>
        u &&
        (u.Start[0] < unit.Start[0] ||
          (u.Start[0] === unit.Start[0] && u.Start[1] < unit.Start[1]) ||
          (u.Start[0] === unit.Start[0] &&
            u.Start[1] === unit.Start[1] &&
            u.Start[2] < unit.Start[2]))
    ) as IUnitSummary[]
  );

  const update: Update<IUnitSummary>[] =
    units.length !== 0
      ? [
          {
            id: last(units)!.Id,
            changes: {
              End: [-1, -1, -1],
            },
          },
        ]
      : [];

  return { insert: unit, update };
});
