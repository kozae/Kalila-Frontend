import { fabric } from 'fabric';
import { PolygonHelper } from '../../helpers';
import { Polygon } from '../../models';
import { hexToRgba } from '@frontend/util';
import { highlightColors } from '../../constants';
import { IFacsimileRegion } from '@frontend/domain';

export function drawRegions(
  canvas: fabric.Canvas,
  regions: Array<IFacsimileRegion & { Id: string }>,
  scaleRatio: number
) {
  // create polygons
  const scale = (x: number) => x * scaleRatio;
  const polygons: Record<string, fabric.Polygon> = {};
  regions.forEach((region, i) => {
    const points = region.Points.map(({ X, Y }) => ({ x: X, y: Y }));
    polygons[region.Id] = new fabric.Polygon(
      PolygonHelper.scale(points as Polygon, scale),
      {
        fill: hexToRgba(highlightColors[i % 13], 0.2),
        stroke: highlightColors[i % 13],
        strokeWidth: 2,
        selectable: false,
        hasControls: false,
        hoverCursor: 'default',
        data: { ...region, Points: points },
      }
    );
  });

  // draw
  Object.values(polygons).forEach((p) => canvas.add(p));

  return Object.values(polygons);
}
