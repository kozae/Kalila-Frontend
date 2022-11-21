import axios from 'axios';
import { MediaTypes, paramsSerializer } from '@frontend/util';

export async function pages(manuscriptId: string) {
  const { data } = await axios.get(`${process.env['INTERNAL_API_URL']}PageDescription`, {
    headers: {
      Accept: MediaTypes.PartialDocument,
    },
    params: {
      ManuscriptId: manuscriptId,
      SelectProps: ['Number'],
      PageSize: -1,
    },
    paramsSerializer,
  });
  return data.map(({ Id, Number }) => ({ Id, Number }));
}
