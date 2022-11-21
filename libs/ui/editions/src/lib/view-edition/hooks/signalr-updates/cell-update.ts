import { Dispatch, SetStateAction, useCallback } from 'react';
import { IPageUnitsUpdate } from '@frontend/shared-ui';
import { getCells } from '@frontend/ui/editions';
import { EditionCellData, EditionStore } from '../../../store';
import { IEditionUnit } from '@frontend/domain';

export function useCellUpdate(
  edition: EditionStore,
  setEdition: Dispatch<SetStateAction<EditionStore>>,
  setCells: Dispatch<SetStateAction<EditionCellData[][]>>,
  fetchEditionUpdateByUnitList:
    | ((
        editionId: string,
        updateInfo: IPageUnitsUpdate
      ) => Promise<{ Changes: IEditionUnit[]; Lacunae: number[] }>)
    | undefined
) {
  return useCallback(
    async (updateInfo: IPageUnitsUpdate) => {
      const manuscriptIdx = edition.get_manuscript_idx(updateInfo.ManuscriptId);
      const editionId = edition.get_edition_id();
      if (
        fetchEditionUpdateByUnitList &&
        manuscriptIdx !== undefined &&
        (updateInfo.Update.length !== 0 ||
          updateInfo.Create.length !== 0 ||
          updateInfo.Delete.length !== 0)
      ) {
        const data = await fetchEditionUpdateByUnitList(editionId, updateInfo);
        edition = edition.update_cells(data.Changes, manuscriptIdx);
        edition = edition.update_ms_lacunae(
          manuscriptIdx,
          new Uint32Array(data.Lacunae)
        );
        setEdition(edition);
        setCells(getCells(edition));
      }
    },
    [edition, fetchEditionUpdateByUnitList]
  );
}
