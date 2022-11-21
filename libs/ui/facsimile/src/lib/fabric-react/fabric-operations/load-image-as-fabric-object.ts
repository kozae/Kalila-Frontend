import { fabric } from 'fabric';

export function loadImageAsFabricObject(
  url: string,
  onLoad: (img: fabric.Image) => void
) {
  fabric.Image.fromURL(url, (img: fabric.Image) => {
    onLoad(img);
  });
}
