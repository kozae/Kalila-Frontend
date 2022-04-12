import { getManuscriptUnits } from '../queries';
import { useMemo } from 'react';
import { IChapter, IUnitSummary } from '@frontend/domain';
import {
  selectAllUnitSummaries,
  selectCurrentPageManuscriptId,
  useAppSelector,
} from '@frontend/shared-ui';

export function useManuscriptUnits(
  chapter: IChapter | null,
  accessToken: string | null
) {
  const manuscriptId = useAppSelector(selectCurrentPageManuscriptId);
  const inStoreMsUnits = useAppSelector(selectAllUnitSummaries);
  const { data: msUnits } = getManuscriptUnits(
    chapter,
    manuscriptId,
    accessToken
  );
  return useMemo(() => {
    if (msUnits && msUnits.content) {
      return new Map<string, IUnitSummary>(
        [...msUnits.content, ...inStoreMsUnits].map((unit: IUnitSummary) => [
          unit.BookUnitId,
          unit,
        ])
      );
    }
    return new Map<string, IUnitSummary>();
  }, [msUnits, inStoreMsUnits]);
}
