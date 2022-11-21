import { Dispatch, SetStateAction, useCallback } from 'react';
import { getCells } from '@frontend/ui/editions';
import { EditionCellData, EditionStore } from '../../../store';
import { IEditionUnit } from '@frontend/domain';

export function useCellContentUpdate(
  edition: EditionStore,
  setEdition: Dispatch<SetStateAction<EditionStore>>,
  setCells: Dispatch<SetStateAction<EditionCellData[][]>>,
  fetchEditionUpdateByPage:
    | ((
        editionId: string,
        manuscriptId: string,
        pageNumber: number
      ) => Promise<{ Changes: IEditionUnit[]; Lacunae: number[] }>)
    | undefined
) {
  return useCallback(
    async (updateInfo: { ManuscriptId: string; PageNumber: number }) => {
      const manuscriptIdx = edition.get_manuscript_idx(updateInfo.ManuscriptId);
      if (
        fetchEditionUpdateByPage &&
        manuscriptIdx !== undefined &&
        edition.is_page_in_edition(manuscriptIdx, updateInfo.PageNumber)
      ) {
        const editionId = edition.get_edition_id();
        const data = await fetchEditionUpdateByPage(
          editionId,
          updateInfo.ManuscriptId,
          updateInfo.PageNumber
        );
        edition = edition.update_cells(data.Changes, manuscriptIdx);
        edition = edition.update_ms_lacunae(
          manuscriptIdx,
          new Uint32Array(data.Lacunae)
        );
        setEdition(edition);
        setCells(getCells(edition));
      }
    },
    [edition, fetchEditionUpdateByPage]
  );
}
