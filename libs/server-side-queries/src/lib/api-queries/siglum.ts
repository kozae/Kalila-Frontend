import axios from 'axios';
import { MediaTypes } from '@frontend/util';

export async function siglum(id: string) {
  const { data } = await axios.get(
    `http://internal-api:6001/server/api/v1/ManuscriptDescription`,
    {
      headers: {
        Accept: MediaTypes.PartialDocument,
      },
      params: { Ids: [id], SelectProps: ['Siglum'] },
    }
  );
  return data;
}
