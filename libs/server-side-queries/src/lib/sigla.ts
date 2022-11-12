import axios from 'axios';
import { BookId, MediaTypes, paramsSerializer } from '@frontend/util';

export async function sigla() {
  try {
    const { data } = await axios.get(`http://localhost:6688/v1/Manuscript`, {
      headers: {
        Accept: MediaTypes.PartialDocument,
      },
      params: { PageSize: -1, SelectProps: 'Siglum', BookId },
      paramsSerializer,
    });
    return data.map(({ _id, Siglum }) => ({ Id: _id, Siglum }));
  } catch (e) {
    console.log({ e });
  }
}
