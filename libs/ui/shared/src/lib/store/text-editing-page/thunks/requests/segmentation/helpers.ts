import { RootState } from '../../../../config';
import { orderBy } from 'lodash';
import { IUnitSummary } from '@frontend/domain';
import ObjectID from 'bson-objectid';

export function processUnits(state: RootState) {
  const unitsInStore = orderBy(
    Object.values(state.unitSummaries.entities).filter(
      (unit) => unit !== undefined
    ),
    ['StartsInPageNumber', 'StartsInLineNumber', 'FirstTokenOrderInLine'],
    ['asc', 'asc', 'asc']
  ) as IUnitSummary[];

  return unitsInStore.slice().map((unit, index) => {
    if (unit && unitHasOpenEnd(unit)) {
      return unit;
    } else if (index === unitsInStore.length - 1) {
      return unit;
    } else {
      const nextUnit: IUnitSummary | undefined = unitsInStore[index + 1];
      if (nextUnit) {
        if (nextUnit.FirstTokenOrderInLine !== 0) {
          return {
            ...unit,
            EndsInPageNumber: nextUnit.StartsInPageNumber,
            EndsInLineNumber: nextUnit.StartsInLineNumber,
            LastTokenOrderInLine: nextUnit.FirstTokenOrderInLine - 1,
          };
        } else {
          const line = Object.values(state.lines.entities).find(
            (l) => l && l.LineOrder === nextUnit.StartsInLineNumber - 1
          );
          if (line) {
            const tokens = Object.values(state.tokens.entities).filter(
              (t) => t && t.LineId === line.Id
            );
            return {
              ...unit,
              EndsInPageNumber: nextUnit.StartsInPageNumber,
              EndsInLineNumber: nextUnit.StartsInLineNumber - 1,
              LastTokenOrderInLine: tokens.length - 1,
            };
          }

          return unit;
        }
      }

      return unit;
    }
  });
}

export function identifyChangeType(units: IUnitSummary[], state: RootState) {
  const newUnits: IUnitSummary[] = [];
  const updatedUnits: IUnitSummary[] = [];

  units.forEach((unit) => {
    if (unit.Id.length !== 24) {
      newUnits.push({ ...unit, Id: ObjectID().toString() });
    } else {
      const unitBeforeChange =
        state.textEditingPageState.unitSummariesBeforeChanges.find(
          (u) => u.Id === unit.Id
        );
      if (unitBeforeChange && unitChanged(unit, unitBeforeChange)) {
        updatedUnits.push(unit);
      }
    }
  });

  return { newUnits, updatedUnits };
}

function unitHasOpenEnd(unit: IUnitSummary) {
  return (
    unit.EndsInPageNumber !== undefined &&
    unit.EndsInLineNumber !== undefined &&
    unit.LastTokenOrderInLine !== undefined
  );
}

function unitChanged(u1: IUnitSummary, u2: IUnitSummary) {
  return (
    u1.StartsInPageNumber !== u2.StartsInPageNumber ||
    u1.StartsInLineNumber !== u2.StartsInLineNumber ||
    u1.FirstTokenOrderInLine !== u2.FirstTokenOrderInLine ||
    u1.EndsInPageNumber !== u2.EndsInPageNumber ||
    u2.EndsInLineNumber !== u2.EndsInLineNumber ||
    u2.LastTokenOrderInLine !== u2.LastTokenOrderInLine
  );
}
