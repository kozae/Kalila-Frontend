import axios from 'axios';
import { paramsSerializer } from '@frontend/util';

export async function pageTranscription(manuscriptId: string, pageId: string) {
  const { data } = await axios.get(
    `http://localhost:6688/v1/PageTranscription/One`,
    {
      headers: {
        Accept: 'application/json',
      },
      params: { ManuscriptId: manuscriptId, Id: pageId },
      paramsSerializer,
    }
  );
  return data;
}
