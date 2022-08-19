import axios from 'axios';
import { MediaTypes } from '@frontend/util';

export async function edition(id: string) {
  const { data } = await axios.get(`http://localhost:6688/v1/Edition/One`, {
    params: { Id: id },
    headers: {
      Accept: MediaTypes.JSON,
    },
  });
  return data;
}
