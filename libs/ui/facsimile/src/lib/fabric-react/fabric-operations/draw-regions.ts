import { fabric } from 'fabric';
import { PolygonHelper } from '../../helpers';
import { hexToRgba } from '@frontend/util';
import { IFacsimileRegion, pointToSmallXAndY } from '@frontend/domain';

export function drawRegions(
  canvas: fabric.Canvas,
  regions: Array<
    IFacsimileRegion & { Id: string; HighlightColor: string | undefined }
  >,
  scaleRatio: number
) {
  // create polygons
  const scale = (x: number) => x * scaleRatio;
  const polygons: Record<string, fabric.Polygon> = {};
  regions.forEach((region) => {
    const points = PolygonHelper.scale(region.Points, scale);
    polygons[region.Id] = new fabric.Polygon(
      pointToSmallXAndY(points) as fabric.IPoint[],
      {
        fill: hexToRgba(region.HighlightColor as string, 0.2),
        stroke: region.HighlightColor,
        strokeWidth: 2,
        selectable: false,
        hasControls: false,
        hoverCursor: 'default',
        data: region,
      }
    );
  });

  // draw
  Object.values(polygons).forEach((p) => canvas.add(p));

  return Object.values(polygons);
}
