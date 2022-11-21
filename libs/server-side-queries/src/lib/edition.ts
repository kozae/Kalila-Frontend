import axios from 'axios';
import { MediaTypes } from '@frontend/util';

export async function edition(id: string) {
  const { data } = await axios.get(
    `${process.env['INTERNAL_API_URL']}Edition/One`,
    {
      params: { Id: id },
      headers: {
        Accept: MediaTypes.JSON,
      },
    }
  );
  return data;
}
