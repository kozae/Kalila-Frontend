import useSWR from 'swr';
import { MediaTypes } from '@frontend/util';
import { KalilaDocument } from '@frontend/domain';
import { fetcher } from '../../util';

export function getDocuments<T extends KalilaDocument>(
  activityName: string,
  query: any,
  mediaType: MediaTypes,
  additionalParams = {},
  suffix = ''
) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSWR(
    [activityName, query, mediaType, additionalParams, suffix],
    (args) => fetcher(...args),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );
}
