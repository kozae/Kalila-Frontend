import axios from 'axios';
import { MediaTypes, paramsSerializer } from '@frontend/util';

export async function pages(manuscriptId: string) {
  const { data } = await axios.get(
    `http://internal-api:5504/server/api/v1/PageDescription`,
    {
      headers: {
        Accept: MediaTypes.PartialDocument,
      },
      params: {
        ManuscriptId: manuscriptId,
        SelectProps: ['Number'],
        PageSize: 0,
      },
      paramsSerializer,
    }
  );
  return data.map(({ Id, Number }) => ({ Id, Number }));
}
