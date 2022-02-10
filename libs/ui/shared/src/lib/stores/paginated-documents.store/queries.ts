import { fetcher, MediaTypes } from '@frontend/util';
import { NextRouter } from 'next/router';
import useSWR from 'swr';
import { KalilaDocument } from '@frontend/domain';

export function getDocuments<T extends KalilaDocument>(
  accessToken: string | undefined | null,
  activityName: string,
  { query }: NextRouter,
  mediaType: MediaTypes,
  additionalParams = {}
) {
  return useSWR(
    accessToken
      ? [
          // only fetch if access token is present
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
