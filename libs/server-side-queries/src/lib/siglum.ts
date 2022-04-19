import axios from 'axios';
import { MediaTypes, paramsSerializer } from '@frontend/util';

export async function siglum(id: string) {
  const { data } = await axios.get(
    `http://localhost:6688/server/api/v1/ManuscriptDescription`,
    {
      headers: {
        Accept: MediaTypes.PartialDocument,
      },
      params: { Ids: [id], SelectProps: ['Siglum'] },
      paramsSerializer,
    }
  );
  return data[0].Siglum;
}
