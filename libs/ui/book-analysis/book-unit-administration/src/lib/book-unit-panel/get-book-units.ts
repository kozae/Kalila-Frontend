import { IChapter } from '@frontend/domain';
import useSWRImmutable from 'swr/immutable';

import { MediaTypes } from '@frontend/util';
import { fetcher } from '@frontend/shared-ui';

export function getBookUnits(chapter: IChapter | null, manuscriptId: string) {
  const filter =
    chapter && chapter.abbr === 'untagged'
      ? { FrameTagsEmpty: true }
      : chapter && chapter.abbr === 'all'
      ? {}
      : { FrameTagsCn: chapter?.abbr };
  return useSWRImmutable(
    chapter
      ? [
          'BookUnit',
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
