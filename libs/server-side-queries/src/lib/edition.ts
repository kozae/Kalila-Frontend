import axios from 'axios';
import { MediaTypes } from '@frontend/util';

export async function edition() {
  const { data } = await axios.get(
    `http://localhost:6688/server/api/v1/Editions/test`,
    {
      headers: {
        Accept: MediaTypes.JSON,
      },
    }
  );
  return data;
}
