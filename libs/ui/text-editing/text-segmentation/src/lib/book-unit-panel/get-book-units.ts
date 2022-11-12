import { IChapter } from '@frontend/domain';
import useSWRImmutable from 'swr/immutable';

import { fetcher, MediaTypes } from '@frontend/util';

export function getBookUnits(
  accessToken: string | null | undefined,
  chapter: IChapter | null,
  manuscriptId: string
) {
  const filter =
    chapter && chapter.abbr === 'untagged'
      ? { FrameTagsEmpty: true }
      : chapter && chapter.abbr === 'all'
      ? {}
      : { FrameTagsCn: chapter?.abbr };
  return useSWRImmutable(
    accessToken && chapter
      ? [
          'BookUnit',
          accessToken,
          {
            ...filter,
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
