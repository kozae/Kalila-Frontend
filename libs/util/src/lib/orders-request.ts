import axios from 'axios';
import { IBookUnit } from '@frontend/domain';
import { paramsSerializer } from './params-serializer';

export const getOrders = (
  params: { OrderGt: number[]; OrderLt: number[] },
  accessToken?: string | number
) => {
  return axios
    .get<Partial<IBookUnit>[]>(
      `${process.env['NEXT_PUBLIC_API_URL']}BookUnit`,
      {
        params: {
          ...params,
          PageSize: -1,
        },
        paramsSerializer: { serialize: paramsSerializer },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then((r) => r.data);
};
