import { promisify } from 'util';
import imageSize from 'image-size';

const sizeOf = promisify(imageSize);

const imageRoot = process.env.IMAGE_ROOT ?? '/root/Kalila/volumes/assets';

export async function getImageSize(url: string) {
  return await sizeOf('/root/Kalila/volumes/assets' + url);
}
