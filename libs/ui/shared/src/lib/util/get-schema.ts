import useSWRImmutable from 'swr/immutable';
import { fetcher } from '@frontend/util';

export function transformSchemaName(activityName: string) {
  switch (activityName) {
    case 'PageDescription':
    case 'PageTranscription':
      return 'Page';
    default:
      return activityName;
  }
}

export function getSchema(activityName: string, schemaFilter: any = {}) {
  return useSWRImmutable(
    [
      `EntrySchema/${transformSchemaName(activityName)}`,
      undefined, // no accessToken needed
      schemaFilter,
    ],
    fetcher
  );
}
