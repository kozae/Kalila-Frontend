import { IChapter } from '@frontend/domain';
import useSWR from 'swr';
import { fetcher, MediaTypes } from '@frontend/util';

export interface IBookUnitQuery {
  PageNumber: number;
  TitleCn: string;
}

export function getBookUnits(
  chapter: IChapter | null,
  accessToken: string | null,
  query: IBookUnitQuery
) {
  return useSWR(
    accessToken && chapter
      ? [
          'BookUnit',
          accessToken,
          {
            ChapterCn: chapter.abbr,
            PageSize: '5',
            ...query,
          },
          MediaTypes.FullDescriptionDocument,
          {},
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
