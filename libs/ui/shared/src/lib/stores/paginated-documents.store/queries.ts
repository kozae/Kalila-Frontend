import useSWRImmutable from 'swr/immutable';
import { fetcher, MediaTypes } from '@frontend/util';
import { NextRouter } from 'next/router';
import useSWR from 'swr';
import { KalilaDocument } from '@frontend/domain';

function transformSchemaName(activityName: string) {
  switch (activityName) {
    case 'PageDescription':
    case 'PageTranscription':
      return 'Page';
    default:
      return activityName;
  }
}

export function getSchema(
  accessToken: string | undefined | null,
  activityName: string,
  schemaFilter: any
) {
  return useSWRImmutable(
    [
      `EntrySchema/${transformSchemaName(activityName)}`,
      undefined, // no accessToken needed
      schemaFilter,
    ],
    fetcher
  );
}

export function getDocuments<T extends KalilaDocument>(
  accessToken: string | undefined | null,
  activityName: string,
  schema: any,
  { query }: NextRouter,
  mediaType: MediaTypes,
  additionalParams = {}
) {
  return useSWR(
    schema && accessToken
      ? [
          // only fetch if access token is present, after the schema is fetched
          activityName,
          accessToken,
          query,
          mediaType,
          additionalParams,
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
