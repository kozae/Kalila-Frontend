import axios from 'axios';
import { MediaTypes, paramsSerializer } from '@frontend/util';

export async function sigla() {
  const { data } = await axios.get(
    `http://localhost:6688/server/api/v1/ManuscriptDescription`,
    {
      headers: {
        Accept: MediaTypes.PartialDocument,
      },
      params: { PageSize: 0, SelectProps: ['Siglum'] },
      paramsSerializer,
    }
  );
  return data.map(({ Id, Siglum }) => ({ Id, Siglum }));
}
