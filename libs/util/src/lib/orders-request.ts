import axios from 'axios';
import { paramsSerializer } from '@frontend/util';
import { IBookUnit } from '@frontend/domain';

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
        paramsSerializer,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then((r) => r.data);
};
