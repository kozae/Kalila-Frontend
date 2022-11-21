import useSWR from 'swr';
import { MediaTypes } from '@frontend/util';
import { fetcher } from '@frontend/shared-ui';

export function useSigla() {
  return useSWR(
    [
      'ManuscriptDescription',

      { SelectProps: ['Siglum'], PageSize: -1 },
      MediaTypes.PartialDocument,
    ],
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );
}

export function useBookUnits(chapter?: string | null) {
  return useSWR(
    chapter
      ? [
          'BookUnit',

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
