import { IBookUnit } from '@frontend/domain';
import axios from 'axios';

export async function createRequest(
  unit: Partial<IBookUnit>,
  accessToken: string
) {
  return axios.post(`${process.env['NEXT_PUBLIC_API_URL']}BookUnit`, unit, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
