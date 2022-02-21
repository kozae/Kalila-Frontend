import { fabric } from 'fabric';

interface IRenderBackgroundImageParams {
  width: number;
  height: number;
  scaleRatio: number;
  url: string;
}

export function renderBackgroundImage(
  canvas: fabric.Canvas,
  { width, height, url, scaleRatio }: IRenderBackgroundImageParams
) {
  canvas.setHeight(height);
  canvas.setWidth(width);
  fabric.Image.fromURL(url, (img: fabric.Image) => {
    img.set({
      top: 0,
      left: 0,
      selectable: false,
      evented: false,
      originX: 'left',
      originY: 'top',
      hasControls: false,
    });
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
    img.set({
      scaleX: scaleRatio,
      scaleY: scaleRatio,
    });
    canvas.renderAll();
  });
}
