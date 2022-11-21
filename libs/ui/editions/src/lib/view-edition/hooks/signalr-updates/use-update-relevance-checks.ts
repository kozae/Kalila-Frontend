import { useCallback } from 'react';
import { EditionStore } from '../../../store';

export function useUpdateRelevanceChecks(edition: EditionStore) {
  return {
    unitIdIsInEdition: useCallback(
      (id: string) => edition.unit_is_in_edition(id),
      [edition]
    ),
    unitIsInEditionRange: useCallback(
      (numericOrder: number) => edition.unit_is_in_range(numericOrder),
      [edition]
    ),
  };
}
