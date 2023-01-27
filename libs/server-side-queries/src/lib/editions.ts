import axios from 'axios';
import { MediaTypes, paramsSerializer } from '@frontend/util';

export async function editions() {
  try {
    const { data } = await axios.get(
      `${process.env['INTERNAL_API_URL']}Edition/Summaries`,
      {
        headers: {
          Accept: MediaTypes.JSON,
          "Accept-Encoding": MediaTypes.JSON,
        },
        params: { PageSize: -1 },
        paramsSerializer: { serialize: paramsSerializer },
      }
    );
    return data.map(({ Id, Name }) => ({ Id, Name }));
  } catch (e) {
    console.log({ e });
  }
}
