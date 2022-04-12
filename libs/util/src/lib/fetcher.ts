import axios from 'axios';
import { MediaTypes } from './media-types';
import { getPagination } from './pagination-header';
import { paramsSerializer } from './params-serializer';

export async function fetcher(
  controller: string,
  accessToken: string,
  query: Record<string, any> = {},
  accept: string | MediaTypes = 'application/json',
  additionalParams = {},
  suffix: string = ''
) {
  const { data, headers } = await axios.get(
    `/server/api/v1/${controller}${suffix}`,
    {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        Accept: accept,
      },
      params: { ...query, ...additionalParams },
      paramsSerializer,
    }
  );
  return { content: data, pagination: getPagination(headers) };
}
