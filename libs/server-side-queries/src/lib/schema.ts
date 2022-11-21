import axios from 'axios';

export async function getSchema(activityName: string, query: any = {}) {
  const { data } = await axios.get(
    `${process.env['INTERNAL_API_URL']}EntrySchema/${activityName}`,
    {
      headers: {
        Accept: 'application/json',
      },
      params: query,
    }
  );
  return data;
}
