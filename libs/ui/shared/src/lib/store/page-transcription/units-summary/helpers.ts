import { IUnitSummary } from '@frontend/domain';
import { RootState } from '@frontend/shared-ui';
import { maxBy, orderBy } from 'lodash';

export function determineEndBasedOnNextUnit(
  unit: IUnitSummary,
  nextUnit: IUnitSummary,
  state: RootState
) {
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

export function getOrderedUnits(state: RootState) {
  return orderBy(
    Object.values(state.unitSummaries.entities).filter(
      (unit) => unit !== undefined
    ),
    ['StartsInPageNumber', 'StartsInLineNumber', 'FirstTokenOrderInLine'],
    ['asc', 'asc', 'asc']
  ) as IUnitSummary[];
}

export function getPrevUnit(unit: IUnitSummary, state: RootState) {
  if (unit.FirstTokenOrderInLine !== 0) {
    return Object.values(state.unitSummaries.entities).find(
      (u) =>
        u &&
        u.EndsInLineNumber === unit.StartsInLineNumber &&
        u.LastTokenOrderInLine === unit.FirstTokenOrderInLine - 1
    );
  } else {
    return maxBy(
      Object.values(state.unitSummaries.entities).filter(
        (u) => u && u.EndsInLineNumber === unit.StartsInLineNumber - 1
      ),
      'LastTokenOrderInLine'
    );
  }
}

export function determinePrevUnitEnd(
  prevUnit: IUnitSummary,
  newLocation: {
    StartsInPageNumber: number;
    StartsInLineNumber: number;
    FirstTokenOrderInLine: number;
  },
  state: RootState
) {
  if (newLocation.FirstTokenOrderInLine !== 0) {
    return {
      ...prevUnit,
      EndsInPageNumber: newLocation.StartsInPageNumber,
      EndsInLineNumber: newLocation.StartsInLineNumber,
      LastTokenOrderInLine: newLocation.FirstTokenOrderInLine - 1,
    };
  } else {
    const line = Object.values(state.lines.entities).find(
      (l) => l && l.LineOrder === newLocation.StartsInLineNumber - 1
    );
    if (line) {
      const tokenCount = Object.values(state.tokens.entities).filter(
        (t) => t && t.LineId === line.Id
      ).length;
      return {
        ...prevUnit,
        EndsInPageNumber: newLocation.StartsInPageNumber,
        EndsInLineNumber: newLocation.StartsInLineNumber - 1,
        LastTokenOrderInLine: tokenCount - 1,
      };
    }
    return undefined;
  }
}
