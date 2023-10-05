import axios from 'axios';
import { MediaTypes, paramsSerializer } from '@frontend/util';

export async function bookUnits(ids: string[]): Promise<any[]> {
  const { data } = await axios.get(
    `${process.env['INTERNAL_API_URL']}BookUnit`,
    {
      headers: {
        Accept: MediaTypes.FullDescriptionDocument,
      },
      params: {
        Ids: ids,
        PageSize: -1,
      },
      paramsSerializer: { serialize: paramsSerializer },
    }
  );
  return data;
}
