import axios from 'axios';
import { BookId, MediaTypes, paramsSerializer } from '@frontend/util';

export async function siglum(id: string) {
  const { data } = await axios.get(
    `${process.env['INTERNAL_API_URL']}Manuscript`,
    {
      headers: {
        Accept: MediaTypes.PartialDocument,
      },
      params: { Ids: id, SelectProps: 'Siglum', BookId },
      paramsSerializer: { serialize: paramsSerializer },
    }
  );
  return data[0].Siglum;
}
