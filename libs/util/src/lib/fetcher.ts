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
    `${process.env['NEXT_PUBLIC_API_URL']}${controller}${suffix}`,
    {
      headers: {
        authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        accept: accept,
      },
      params: { ...query, ...additionalParams },
      paramsSerializer,
    }
  );
  return { content: data, pagination: getPagination(headers) };
}
