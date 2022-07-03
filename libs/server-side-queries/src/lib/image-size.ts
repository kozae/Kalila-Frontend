import axios from 'axios';
export async function getImageSize(path: string) {
  const { data } = await axios.get('http://localhost:6688/v1/ImageSize', {
    headers: {
      Accept: 'application/json',
    },
    params: { path },
  });
  return data;
}
