import { getPagination, paramsSerializer } from '@frontend/util';
import { ApiClient } from '@frontend/shared-ui';

export const validate = (params: any) => {
  return ApiClient()
    .get<boolean>(`${process.env['NEXT_PUBLIC_API_URL']}BookUnit/Check`, {
      params,
      paramsSerializer: { serialize: paramsSerializer },
    })
    .then((r) => !r.data);
};

export const countBookUnits = (params: any) => {
  return ApiClient()
    .get<number>(`${process.env['NEXT_PUBLIC_API_URL']}BookUnit`, {
      params: {
        ...params,
        PageSize: 1,
        PageNumber: 1,
      },
      paramsSerializer: { serialize: paramsSerializer },
      headers: {},
    })
    .then((r) => getPagination(r.headers)?.totalItems);
};
