import { IChapter } from '@frontend/domain';
import useSWR from 'swr';
import { fetcher, MediaTypes } from '@frontend/util';

export function getManuscriptUnits(
  chapter: IChapter | null,
  manuscriptId: string,
  accessToken: string | null
) {
  return useSWR(
    accessToken && chapter
      ? [
          'ManuscriptUnit',
          accessToken,
          {
            ChapterCn: chapter.abbr,
            ManuscriptId: manuscriptId,
            PageSize: '0',
            SelectProps: [
              'Id',
              'BookUnitId',
              'Type',
              'Tags',
              'StartsInPageNumber',
            ],
          },
          MediaTypes.PartialDocument,
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
