import axios from 'axios';
import { MediaTypes } from './media-types';
import { getPagination } from './pagination-header';

export async function fetcher(
  controller: string,
  accessToken: string,
  query: Record<string, any> = {},
  accept: string | MediaTypes = 'application/json',
  additionalParams = {}
) {
  const { data, headers } = await axios.get(`/server/api/v1/${controller}`, {
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
      Accept: accept,
    },
    params: { ...query, ...additionalParams },
  });
  return { content: data, pagination: getPagination(headers) };
}
