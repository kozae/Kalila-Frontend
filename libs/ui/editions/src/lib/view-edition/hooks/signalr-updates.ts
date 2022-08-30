import { getCells, getRows } from '@frontend/ui/editions';
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import updateImm from 'immutability-helper';
import { IPageUnitsUpdate } from '@frontend/shared-ui';
import { IEditionBookUnit } from '@frontend/domain';
import {
  IEditionPageData,
  IEditionPageDataMutators,
  IRealTimeUpdateProps,
} from '../models';

export function useSignalrEditionUpdates(
  {
    fetchEditionUpdateByUnitList,
    fetchEditionUpdateByPage,
    update,
  }: IRealTimeUpdateProps,
  {
    edition,
    setEdition,
    rows,
    cells,
    setRows,
    setCells,
  }: IEditionPageData & IEditionPageDataMutators,
  setUpdateTime: Dispatch<SetStateAction<number>>,
  enableUpdates: boolean
) {
  const updateRow = useCallback(
    (id: string, newTitle?: string, newOrder?: number) => {
      const index = edition.get_row_index(id);
      if (index !== undefined) {
        console.log({ newTitle, newOrder });
        setRows((rows) =>
          updateImm(rows, {
            [index]: {
              $set: rows[index].update_row(index, newTitle, newOrder),
            },
          })
        );
      }
    },
    [edition]
  );
  const updateCells = useCallback(
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
        edition = edition.update_cells(data, manuscriptIdx);
        setEdition(edition);
        setCells(getCells(edition));
      }
    },
    [edition, fetchEditionUpdateByUnitList]
  );

  const updateCellsContent = useCallback(
    async (updateInfo: { ManuscriptId: string; PageNumber: number }) => {
      const manuscriptIdx = edition.get_manuscript_idx(updateInfo.ManuscriptId);
      if (
        fetchEditionUpdateByPage &&
        manuscriptIdx &&
        edition.is_page_in_edition(manuscriptIdx, updateInfo.PageNumber)
      ) {
        const editionId = edition.get_edition_id();
        const data = await fetchEditionUpdateByPage(
          editionId,
          updateInfo.ManuscriptId,
          updateInfo.PageNumber
        );
        edition = edition.update_cells(data, manuscriptIdx);
        setEdition(edition);
        setCells(getCells(edition));
      }
    },
    [edition, fetchEditionUpdateByPage]
  );

  const deleteRow = useCallback(
    (id: string) => {
      const index = edition.get_row_index(id);
      console.log(index);
      if (index) {
        edition = edition.delete_row(index);
        setRows(getRows(edition));
        setCells(getCells(edition));
        setEdition(edition);
        setUpdateTime(Date.now);
      }
    },
    [edition]
  );

  const insertRow = useCallback(
    (unit: IEditionBookUnit) => {
      edition = edition.insert_row(unit);
      setRows(getRows(edition));
      setCells(getCells(edition));
      setEdition(edition);
      setUpdateTime(Date.now);
    },
    [edition]
  );

  useEffect(() => {
    console.log({ update, enableUpdates });
    if (update && enableUpdates) {
      console.log('updating');
      if (update.Topic.endsWith('AdminUpdate.BookUnit')) {
        const id = update.Data?.Params?.Ids && update.Data.Params.Ids[0];
        if (id) {
          updateRow(
            id,
            update.Data.Update.Title,
            update.Data.Update.OrderInChapter
          );
        }
      } else if (update.Topic.endsWith('Delete.BookUnit')) {
        const id = update.Data.Id;
        deleteRow(id);
      } else if (update.Topic.endsWith('Creation.BookUnit')) {
        // todo based on the edition information make sure the unit should be inserted
        const unit: IEditionBookUnit = {
          Id: update.Data.Id,
          Order: update.Data.OrderInChapter,
          Title: update.Data.Title,
        };
        insertRow(unit);
      } else if (update.Topic.endsWith('PageContentUpdate.Edition')) {
        updateCellsContent(update.Data)
          .catch((e) => {
            console.log(e);
          })
          .then(() => {
            setTimeout(() => {
              setUpdateTime(Date.now);
            }, 100);
          });
      } else if (update.Topic === 'ContentUpdate.Edition') {
        updateCells(update.Data)
          .catch((e) => {
            console.log(e);
          })
          .then(() => {
            setTimeout(() => {
              setUpdateTime(Date.now);
            }, 100);
          });
      }
    } else {
      console.log('update disabled');
    }
  }, [update, enableUpdates]);
}
