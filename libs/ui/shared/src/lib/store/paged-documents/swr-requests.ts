import useSWR from 'swr';
import { MediaTypes } from '@frontend/util';
import { KalilaDocument } from '@frontend/domain';
import { fetcher } from '@frontend/shared-ui';

export function getDocuments<T extends KalilaDocument>(
  activityName: string,
  query: any,
  mediaType: MediaTypes,
  additionalParams = {},
  suffix: string = ''
) {
  return useSWR(
    [
      // only fetch if access token is present
      activityName,
      query,
      mediaType,
      additionalParams,
      suffix,
    ],
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );
}
