import { promisify } from 'util';
import imageSize from 'image-size';

const sizeOf = promisify(imageSize);

export async function getImageSize(url: string) {
  return await sizeOf(`/images${url}`);
}
