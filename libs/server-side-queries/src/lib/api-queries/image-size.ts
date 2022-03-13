import axios from 'axios';

export async function getImageSize(path: string) {
  const { data } = await axios.get('http://web:5503/server/web/ImageSize', {
    headers: {
      Accept: 'application/json',
    },
    params: { path },
  });
  return data;
}
