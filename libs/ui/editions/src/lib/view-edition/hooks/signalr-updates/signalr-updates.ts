import {
  IEditionPageData,
  IEditionPageDataMutators,
  IRealTimeUpdateProps,
  RowVirtualizer,
} from '@frontend/ui/editions';
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';

import { convertToNumericOrder } from '@frontend/util';
import { useRowUpdate } from './row-update';
import { useCellUpdate } from './cell-update';
import { useCellContentUpdate } from './cell-content-update';
import { useRefetchUnits } from './refetch-units';
import { useUpdateRelevanceChecks } from './use-update-relevance-checks';
import {
  isBookUnitCreation,
  isBookUnitDeletion,
  isBookUnitUpdate,
  isCellContentUpdate,
  isCellUpdate,
  isOrderChanged,
} from './update-selection';

export function useSignalrEditionUpdates(
  {
    fetchEditionUpdateByUnitList,
    fetchEditionUpdateByPage,
    fetchBookUnits,
    update,
  }: IRealTimeUpdateProps,
  rowVirtualizer: RowVirtualizer,
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
  const updateRow = useRowUpdate(edition, setRows);
  const updateCells = useCellUpdate(
    edition,
    setEdition,
    setCells,
    fetchEditionUpdateByUnitList
  );

  const updateCellsContent = useCellContentUpdate(
    edition,
    setEdition,
    setCells,
    fetchEditionUpdateByPage
  );

  const refetchUnits = useRefetchUnits(
    edition,
    setEdition,
    setRows,
    setCells,
    fetchBookUnits
  );

  const { unitIdIsInEdition, unitIsInEditionRange } =
    useUpdateRelevanceChecks(edition);

  const editionId = useMemo(() => edition.get_edition_id(), [edition]);

  useEffect(() => {
    if (update && enableUpdates) {
      let process: Promise<any> | undefined = undefined;
      if (isBookUnitUpdate(update.Topic)) {
        const id = update.Data?.Params?.Id;
        if (id && unitIdIsInEdition(id)) {
          console.log(update);
          process = isOrderChanged(update.Data.Update.NewOrder)
            ? refetchUnits()
            : updateRow(id, update.Data.Update.Title);
        }
      } else if (
        isBookUnitDeletion(update.Topic) &&
        unitIdIsInEdition(update.Data.Id)
      ) {
        process = refetchUnits();
      } else if (isBookUnitCreation(update.Topic)) {
        if (unitIsInEditionRange(convertToNumericOrder(update.Data.Order))) {
          process = refetchUnits();
        }
      } else if (isCellContentUpdate(update.Topic)) {
        process = updateCellsContent(update.Data);
      } else if (isCellUpdate(update.Topic)) {
        process = updateCells(update.Data);
      }

      if (process) {
        const currentRowBeforeUpdate = rowVirtualizer.virtualItems[0].index;
        process
          .then((r) => {
            setTimeout(() => {
              setUpdateTime(Date.now);
            }, 100);
            setTimeout(() => {
              rowVirtualizer.scrollToIndex(currentRowBeforeUpdate + 1, {
                align: 'start',
              });
              fetch(`/api/revalidate-edition?id=${editionId}`).catch((e) =>
                console.log(e)
              );
            }, 500);
          })
          .catch((e) => console.log({ e }));
      }
    } else {
      console.log('update disabled');
    }
  }, [update, enableUpdates]);
}
