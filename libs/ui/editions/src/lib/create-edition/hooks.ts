import useSWR from 'swr';
import { fetcher, MediaTypes } from '@frontend/util';

export function useSigla(accessToken?: string | null) {
  return useSWR(
    accessToken
      ? [
          'ManuscriptDescription',
          accessToken,
          { SelectProps: ['Siglum'], PageSize: -1 },
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
