import { RootState } from '../../../../config';
import { IUnitSummary } from '@frontend/domain';
import ObjectID from 'bson-objectid';
import {
  determineEndBasedOnNextUnit,
  getOrderedUnits,
} from '../../../../page-transcription/units-summary';

export function processUnits(state: RootState) {
  const orderedUnits = getOrderedUnits(state);

  return orderedUnits.slice().map((unit, index) => {
    if (unit && unitHasOpenEnd(unit)) {
      return unit;
    } else if (index === orderedUnits.length - 1) {
      return unit;
    } else {
      const nextUnit: IUnitSummary | undefined = orderedUnits[index + 1];
      if (nextUnit) {
        return determineEndBasedOnNextUnit(unit, nextUnit, state);
      }

      return unit;
    }
  });
}

export function identifyChanges(units: IUnitSummary[], state: RootState) {
  const newUnits: IUnitSummary[] = [];
  const updatedUnits: IUnitSummary[] = [];
  const deletedUnits: string[] = [];

  units.forEach((unit) => {
    if (unit.Id.length !== 24) {
      newUnits.push({ ...unit, Id: ObjectID().toString() });
    } else {
      const unitBeforeChange =
        state.textEditingPageState.unitSummariesBeforeChanges.find(
          (u) => u.Id === unit.Id
        );
      if (!unitUnchanged(unit, unitBeforeChange)) {
        updatedUnits.push(unit);
      }
    }
  });
  state.textEditingPageState.unitSummariesBeforeChanges.forEach((unit) => {
    if (state.unitSummaries.entities[unit.Id] === undefined) {
      deletedUnits.push(unit.Id);
    }
  });

  return { newUnits, updatedUnits, deletedUnits };
}

function unitHasOpenEnd(unit: IUnitSummary) {
  return (
    unit.EndsInPageNumber !== undefined &&
    unit.EndsInLineNumber !== undefined &&
    unit.LastTokenOrderInLine !== undefined
  );
}

function unitUnchanged(u1: IUnitSummary, u2: IUnitSummary | undefined) {
  return (
    u1.StartsInPageNumber === u2?.StartsInPageNumber &&
    u1.StartsInLineNumber === u2?.StartsInLineNumber &&
    u1.FirstTokenOrderInLine === u2?.FirstTokenOrderInLine &&
    u1.EndsInPageNumber === u2?.EndsInPageNumber &&
    u1.EndsInLineNumber === u2?.EndsInLineNumber &&
    u1.LastTokenOrderInLine === u2?.LastTokenOrderInLine
  );
}
