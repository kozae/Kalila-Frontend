import axios from 'axios';
export async function getImageSize(path: string) {
  const { data } = await axios.get(
    `${process.env['INTERNAL_API_URL']}ImageSize`,
    {
      headers: {
        Accept: 'application/json',
      },
      params: { path },
    }
  );
  return data;
}
