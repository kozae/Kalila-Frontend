import axios from 'axios';
import { MediaTypes, paramsSerializer } from '@frontend/util';

export async function sigla() {
  try {
    const { data } = await axios.get(
      `http://localhost:6688/v1/ManuscriptDescription`,
      {
        headers: {
          Accept: MediaTypes.PartialDocument,
        },
        params: { PageSize: -1, SelectProps: ['Siglum'] },
        paramsSerializer,
      }
    );
    return data.map(({ Id, Siglum }) => ({ Id, Siglum }));
  } catch (e) {
    console.log({ e });
  }
}
