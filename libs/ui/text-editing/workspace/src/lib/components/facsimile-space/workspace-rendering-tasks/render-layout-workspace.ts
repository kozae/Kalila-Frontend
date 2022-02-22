import { IFacsimileCanvasProps } from '../facsimile-canvas';
import { IFacsimileRegion } from '@frontend/domain';
import { fabric } from 'fabric';
import {
  AngleHelper,
  drawRegions,
  PolygonHelper,
} from '@frontend/ui/facsimile';
import { orderBy } from 'lodash';

export type LayoutProcedureProps = Omit<
  IFacsimileCanvasProps,
  'onLoaded' | 'activeWorkspace'
> & {
  canvas: fabric.Canvas;
  regions: Array<IFacsimileRegion & { Id: string }>;
  handleHover: (e: any) => void;
};

export function renderLayoutWorkspace({
  canvas,
  regions,
  scaleRatio,
  handleHover,
  url,
}: LayoutProcedureProps) {
  console.log('rendering layout');
  const polygons = drawRegions(canvas, regions, scaleRatio);

  fabric.Image.fromURL(url, (img: fabric.Image) => {
    polygons.forEach((p) => {
      p.on('mouseover', (e) => {
        const points = PolygonHelper.orderPoints(p.data.Points);
        img.set({
          clipPath: new fabric.Polygon(points, {
            top: points[0].y - (img.height as number) / 2,
            left: points[0].x - (img.width as number) / 2,
          }),
        });
        const { Width, Height } = PolygonHelper.getWidthAndHeight(points);
        const croppedDataUrl = img.toDataURL({
          format: 'jpg',
          width: Width,
          height: Height,
          top: points[0].y,
          left: points[0].x,
        });
        fabric.Image.fromURL(croppedDataUrl, (croppedImg) => {
          croppedImg.set({
            angle: -p.data.Rotation,
          });
          handleHover(croppedImg.toDataURL({}));
        });
      });
      p.on('mouseout', (e) => handleHover(null));
    });
  });
}

function getYOffset({ x, y }: { x: number; y: number }, r: number) {
  return (
    y * Math.cos(AngleHelper.degToRad(r)) -
    x * Math.sin(AngleHelper.degToRad(r))
  );
}

function getXOffset({ x, y }: { x: number; y: number }, r: number) {
  return (
    x * Math.cos(AngleHelper.degToRad(r)) +
    y * Math.sin(AngleHelper.degToRad(r))
  );
}
