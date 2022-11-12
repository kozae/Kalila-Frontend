import axios from 'axios';
import { getPagination, paramsSerializer } from '@frontend/util';

export const validate = (params: any) => {
  return axios
    .get<boolean>(`${process.env['NEXT_PUBLIC_API_URL']}BookUnit/Check`, {
      params,
      paramsSerializer,
    })
    .then((r) => !r.data);
};

export const countBookUnits = (
  params: any,
  accessToken: string | undefined
) => {
  return axios
    .get<number>(`${process.env['NEXT_PUBLIC_API_URL']}BookUnit`, {
      params: {
        ...params,
        PageSize: 1,
        PageNumber: 1,
      },
      paramsSerializer,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((r) => getPagination(r.headers)?.totalItems);
};
