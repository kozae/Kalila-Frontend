import { useMemo } from 'react';
import { IUnitSummary } from '@frontend/domain';
import { selectAllUnitSummaries, useAppSelector } from '@frontend/shared-ui';

export function useManuscriptUnits() {
  const inStoreMsUnits = useAppSelector(selectAllUnitSummaries);
  return useMemo(() => {
    return new Map<string, IUnitSummary>(
      inStoreMsUnits.map((unit: IUnitSummary) => [unit.BookUnitId, unit])
    );
  }, [inStoreMsUnits]);
}
