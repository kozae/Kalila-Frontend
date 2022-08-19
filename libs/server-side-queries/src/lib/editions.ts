import axios from 'axios';
import { MediaTypes, paramsSerializer } from '@frontend/util';

export async function editions() {
  try {
    const { data } = await axios.get(
      `http://localhost:6688/v1/Edition/Summaries`,
      {
        headers: {
          Accept: MediaTypes.JSON,
        },
        params: { PageSize: -1 },
        paramsSerializer,
      }
    );
    return data.map(({ Id }) => Id);
  } catch (e) {
    console.log({ e });
  }
}
