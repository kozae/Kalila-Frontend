import axios from 'axios';

export async function getSchema(activityName: string, query: any = {}) {
  const { data } = await axios.get(
    `http://localhost:6688/v1/EntrySchema/${activityName}`,
    {
      headers: {
        Accept: 'application/json',
      },
      params: query,
    }
  );
  return data;
}
