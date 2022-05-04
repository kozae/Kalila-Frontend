import useSWR from 'swr';
import { fetcher, MediaTypes } from '@frontend/util';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import {
  IPageUnitsUpdate,
  selectAccessToken,
  SignalrWrapper,
  transformGroupName,
  useAppSelector,
} from '@frontend/shared-ui';
import { HubConnection } from '@microsoft/signalr';
import { EditionCellData, EditionRowTitle, EditionStore } from './store';
import updateImm from 'immutability-helper';
import {
  fetchEditionUpdateByChangeType,
  fetchEditionUpdateByPage,
  getCells,
  getRows,
} from './view-edition/helpers';
import { IEditionBookUnit } from '@frontend/domain';
import { IEditionPageProps } from '@frontend/ui/editions';

export function useSigla(accessToken?: string | null) {
  return useSWR(
    accessToken
      ? [
          'ManuscriptDescription',
          accessToken,
          { SelectProps: ['Siglum'], PageSize: 0 },
          MediaTypes.PartialDocument,
        ]
      : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );
}

export function useBookUnits(
  chapter?: string | null,
  accessToken?: string | null
) {
  return useSWR(
    accessToken && chapter
      ? [
          'BookUnit',
          accessToken,
          {
            SelectProps: ['Title', 'OrderInChapter'],
            PageSize: 0,
            ChapterCn: chapter,
          },
          MediaTypes.PartialDocument,
        ]
      : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );
}

export function useSignalrEditionUpdates(
  { edition, setEdition, rows, cells, setRows, setCells }: IEditionPageProps,
  setUpdateTime: Dispatch<SetStateAction<number>>
) {
  const {
    data: { update, connection, isConnected },
    methods: { joinGroup, leaveGroup },
  } = useContext(SignalrWrapper);

  useEffect(() => {
    if (connection && isConnected) {
      joinGroup(transformGroupName('Edition'), connection).then(() =>
        console.log(`Edition group joined`)
      );
    }
  }, [isConnected, connection]);

  useEffect(() => {
    return () => {
      leaveGroup(
        transformGroupName('Edition'),
        connection as HubConnection
      ).then(() => console.log(`Edition group left`));
    };
  }, []);

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
  const accessToken = useAppSelector(selectAccessToken);
  const updateCells = useCallback(
    async (updateInfo: IPageUnitsUpdate) => {
      const manuscriptIdx = edition.get_manuscript_idx(updateInfo.ManuscriptId);
      if (manuscriptIdx !== undefined) {
        const data = await fetchEditionUpdateByChangeType(
          'test',
          updateInfo,
          accessToken
        );
        edition = edition.update_cells(data, manuscriptIdx);
        setCells(getCells(edition));
        setEdition(edition);
      }
    },
    [edition, accessToken]
  );

  const updateCellsContent = useCallback(
    async (updateInfo: { ManuscriptId: string; PageNumber: number }) => {
      const manuscriptIdx = edition.get_manuscript_idx(updateInfo.ManuscriptId);
      if (
        manuscriptIdx &&
        edition.is_page_in_edition(manuscriptIdx, updateInfo.PageNumber)
      ) {
        const data = await fetchEditionUpdateByPage(
          'test',
          updateInfo.ManuscriptId,
          updateInfo.PageNumber,
          accessToken
        );
        edition = edition.update_cells(data, manuscriptIdx);
        setCells(getCells(edition));
        setEdition(edition);
      }
    },
    [edition, accessToken]
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
    if (update) {
      console.log(update);
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
        updateCellsContent(update.Data).catch();
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
    }
  }, [update]);
}
