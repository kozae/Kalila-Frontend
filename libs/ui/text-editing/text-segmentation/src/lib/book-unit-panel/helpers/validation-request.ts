import axios from 'axios';
import { paramsSerializer } from '@frontend/util';

export const validate = (params: any) => {
  return axios
    .get<boolean>(`${process.env['NEXT_PUBLIC_API_URL']}BookUnit/Check`, {
      params,
      paramsSerializer,
    })
    .then((r) => !r.data);
};
