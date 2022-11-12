import { Dispatch, SetStateAction, useCallback } from 'react';
import { getCells, getRows } from '@frontend/ui/editions';
import { EditionCellData, EditionRowTitle, EditionStore } from '../../../store';
import { IEditionBookUnit } from '@frontend/domain';

export function useRefetchUnits(
  edition: EditionStore,
  setEdition: Dispatch<SetStateAction<EditionStore>>,
  setRows: Dispatch<SetStateAction<EditionRowTitle[]>>,
  setCells: Dispatch<SetStateAction<EditionCellData[][]>>,
  fetchBookUnits:
    | ((params: {
        Id: string;
      }) => Promise<{ Id: string; Units: IEditionBookUnit[] }>)
    | undefined
) {
  return useCallback(async () => {
    if (fetchBookUnits) {
      const data = await fetchBookUnits({ Id: edition.get_edition_id() });
      edition = edition.replace_rows(data.Units);
      setRows(getRows(edition));
      setCells(getCells(edition));
      setEdition(edition);
    }
  }, [edition, fetchBookUnits]);
}
