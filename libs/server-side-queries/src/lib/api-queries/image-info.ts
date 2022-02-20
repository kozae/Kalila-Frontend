import axios from 'axios';
import { IIIFInfo } from '@frontend/domain';

function IIIFInfoUrl(imageUrl: string) {
  return (
    'https://kalila.kozae.de/iiif/2/files' +
    imageUrl.replace('/files', '').replace(/\//g, '%2F') +
    '/info.json'
  );
}

export async function getImageInfo(url: string) {
  const { data } = await axios.get<IIIFInfo>(IIIFInfoUrl(url));
  return data;
}
