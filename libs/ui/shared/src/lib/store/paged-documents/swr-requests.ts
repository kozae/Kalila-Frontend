import useSWR from 'swr';
import { fetcher, MediaTypes } from '@frontend/util';
import { KalilaDocument } from '@frontend/domain';
import { ParsedUrlQuery } from 'querystring';

export function getDocuments<T extends KalilaDocument>(
  accessToken: string | undefined | null,
  activityName: string,
  query: ParsedUrlQuery,
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
