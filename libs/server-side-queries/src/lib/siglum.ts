import axios from 'axios';
import { BookId, MediaTypes, paramsSerializer } from '@frontend/util';

export async function siglum(id: string) {
  const { data } = await axios.get(`http://localhost:6688/v1/Manuscript`, {
    headers: {
      Accept: MediaTypes.PartialDocument,
    },
    params: { Ids: id, SelectProps: 'Siglum', BookId },
    paramsSerializer,
  });
  return data[0].Siglum;
}
