import { IFacsimileCanvasProps } from '../facsimile-canvas';
import { IFacsimileRegion } from '@frontend/domain';
import { fabric } from 'fabric';
import { highlightColors } from '@frontend/ui/facsimile';
import { PolygonHelper } from '../../../../../../../facsimile/src/lib/helpers/polygon.helper';
import { hexToRgba } from '@frontend/util';

export type LayoutProcedureProps = Omit<
  IFacsimileCanvasProps,
  'onLoaded' | 'activeWorkspace'
> & {
  canvas: fabric.Canvas;
  regions: Array<IFacsimileRegion & { Id: string }>;
};

export function renderLayoutWorkspace({
  canvas,
  regions,
  scaleRatio,
}: LayoutProcedureProps) {
  console.log('rendering layout');
  // set polygons
  const polygons: Record<string, fabric.Polygon> = {};
  regions.forEach((region, i) => {
    const points = region.Points.map(({ X, Y }) => ({ x: X, y: Y }));
    console.log(region);
    polygons[region.Id] = new fabric.Polygon(points, {
      angle: region.Rotation,
      fill: '',
      stroke: highlightColors[i],
      strokeWidth: 3,
      data: { ...region, Points: points },
    });
  });
  // scale polygons
  const scale = (x: number) => x * scaleRatio;
  Object.entries(polygons).forEach(([id, { data }], i) => {
    polygons[id] = new fabric.Polygon(PolygonHelper.scale(data.Points, scale), {
      fill: hexToRgba(highlightColors[i], 0.2),
      stroke: highlightColors[i],
      strokeWidth: 2,
      selectable: false,
      hasControls: false,
      hoverCursor: 'default',
      data: data,
    });
  });

  // draw
  Object.values(polygons).forEach((p) => canvas.add(p));
}
