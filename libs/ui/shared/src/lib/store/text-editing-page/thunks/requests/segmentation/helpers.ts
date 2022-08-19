import { RootState } from '../../../../config';
import { IUnitSummary } from '@frontend/domain';
import ObjectID from 'bson-objectid';
import { determineEndBasedOnNextUnit } from '../../../../page-transcription/units-summary';
import { orderUnits } from '@frontend/util';

export function processUnits(state: RootState) {
  const orderedUnits = orderUnits(
    Object.values(state.unitSummaries.entities) as IUnitSummary[]
  );

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
    unit.End[0] !== undefined &&
    unit.End[0] !== -1 &&
    unit.End[1] !== undefined &&
    unit.End[1] !== -1 &&
    unit.End[2] !== undefined &&
    unit.End[2] !== -1
  );
}

function unitUnchanged(u1: IUnitSummary, u2: IUnitSummary | undefined) {
  return (
    u1.Start[0] === u2?.Start[0] &&
    u1.Start[1] === u2?.Start[1] &&
    u1.Start[2] === u2?.Start[2] &&
    u1.End[0] === u2?.End[0] &&
    u1.End[1] === u2?.End[1] &&
    u1.End[2] === u2?.End[2]
  );
}
