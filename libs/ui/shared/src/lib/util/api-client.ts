import axios from 'axios';
import { getSession } from 'next-auth/react';
import { getPagination, MediaTypes, paramsSerializer } from '@frontend/util';

export const ApiClient = () => {
  const instance = axios.create();
  instance.interceptors.request.use(async (request) => {
    const session: any = await getSession();

    if (session && session['access']) {
      request.headers.set('Authorization', `Bearer ${session['access']}`);
    }
    return request;
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      throw error;
    }
  );

  return instance;
};

export async function fetcher(
  controller: string,
  query: Record<string, any> = {},
  accept: string | MediaTypes = 'application/json',
  additionalParams = {},
  suffix = ''
) {
  const { data, headers } = await ApiClient().get(
    `${process.env['NEXT_PUBLIC_API_URL']}${controller}${suffix}`,
    {
      headers: {
        accept: accept,
      },
      params: { ...query, ...additionalParams },
      paramsSerializer: { serialize: paramsSerializer },
    }
  );
  return { content: data, pagination: getPagination(headers) };
}
