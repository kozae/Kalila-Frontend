import useSWR from 'swr';
import { fetcher, MediaTypes } from '@frontend/util';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { SignalrWrapper, transformGroupName } from '@frontend/shared-ui';
import { HubConnection } from '@microsoft/signalr';
import { EditionCellData, EditionRowTitle, EditionStore } from './store';
import updateImm from 'immutability-helper';

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
  edition: EditionStore,
  rows: EditionRowTitle[],
  cells: EditionCellData[][],
  setRows: Dispatch<SetStateAction<EditionRowTitle[]>>
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

  useEffect(() => {
    if (update) {
      console.log(update);
      if (update.Topic.endsWith('BookUnit')) {
        const id = update.Data?.Params?.Ids && update.Data.Params.Ids[0];
        if (id) {
          updateRow(
            id,
            update.Data.Update.Title,
            update.Data.Update.OrderInChapter
          );
        }
      }
    }
  }, [update]);
}
