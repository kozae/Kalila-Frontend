import { IUnitSummary } from '@frontend/domain';
import { RootState } from '@frontend/shared-ui';
import { maxBy, orderBy } from 'lodash';

export function determineEndBasedOnNextUnit(
  unit: IUnitSummary,
  nextUnit: IUnitSummary,
  state: RootState
): IUnitSummary {
  if (nextUnit.Start[2] !== 0) {
    return {
      ...unit,
      End: [nextUnit.Start[0], nextUnit.Start[1], nextUnit.Start[2] - 1],
    };
  } else {
    const line = Object.values(state.lines.entities).find(
      (l) => l && l.LineOrder === nextUnit.Start[1] - 1
    );
    if (line) {
      const tokens = Object.values(state.tokens.entities).filter(
        (t) => t && t.LineId === line.Id
      );
      return {
        ...unit,
        End: [nextUnit.Start[0], nextUnit.Start[1] - 1, tokens.length - 1],
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
  if (unit.Start[2] !== 0) {
    return Object.values(state.unitSummaries.entities).find(
      (u) => u && u.End[1] === unit.Start[1] && u.End[2] === unit.Start[2] - 1
    );
  } else {
    return maxBy(
      Object.values(state.unitSummaries.entities).filter(
        (u) => u && u.End[1] === unit.Start[1] - 1
      ),
      'LastTokenOrderInLine'
    );
  }
}

export function determinePrevUnitEnd(
  prevUnit: IUnitSummary,
  newStart: [number, number, number],
  state: RootState
): IUnitSummary | undefined {
  if (newStart[2] !== 0) {
    return {
      ...prevUnit,
      End: [newStart[0], newStart[1], newStart[2] - 1],
    };
  } else {
    const line = Object.values(state.lines.entities).find(
      (l) => l && l.LineOrder === newStart[1] - 1
    );
    if (line) {
      const tokenCount = Object.values(state.tokens.entities).filter(
        (t) => t && t.LineId === line.Id
      ).length;
      return {
        ...prevUnit,
        End: [newStart[0], newStart[1] - 1, tokenCount - 1],
      };
    }
    return undefined;
  }
}
