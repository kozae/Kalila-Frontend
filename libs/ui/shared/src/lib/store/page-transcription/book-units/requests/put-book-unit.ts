import axios from 'axios';
import { IBookUnit } from '@frontend/domain';
import { paramsSerializer } from '@frontend/util';

export async function patchBookUnit(
  id: string,
  data: Partial<IBookUnit>,
  accessToken?: string
) {
  await axios.patch(
    `${process.env['NEXT_PUBLIC_API_URL']}BookUnit/Admin`,
    {
      Title: data.Title ?? null,
      Order: data.Order ?? null,
    },
    {
      params: {
        Ids: [id],
      },
      paramsSerializer,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
