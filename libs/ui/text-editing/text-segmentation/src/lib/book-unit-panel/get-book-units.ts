import { IChapter } from '@frontend/domain';
import useSWRImmutable from 'swr/immutable';

import { fetcher, MediaTypes } from '@frontend/util';

export function getBookUnits(
  accessToken: string | null | undefined,
  chapter: IChapter | null,
  manuscriptId: string
) {
  return useSWRImmutable(
    accessToken && chapter
      ? [
          'BookUnit',
          accessToken,
          {
            FrameTagsCn: chapter.abbr,
            PageSize: '-1',
            ManuscriptInfo: manuscriptId,
          },
          MediaTypes.FullDescriptionDocument,
          {},
        ]
      : null,
    fetcher
  );
}
