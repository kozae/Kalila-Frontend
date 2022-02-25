import { fabric } from 'fabric';
import { PolygonHelper } from '../../helpers';
import { hexToRgba } from '@frontend/util';
import { IFacsimileRegion, pointToSmallXAndY } from '@frontend/domain';

export interface IPolygonData {
  polygons: Record<string, fabric.Polygon>;
  hideHighlight: () => void;
  showHighlight: (region: IFacsimileRegion) => void;
}

export function drawPolygons(
  canvas: fabric.Canvas,
  polygons: fabric.Polygon[]
) {
  polygons.forEach((p) => canvas.add(p));
}

export function createPolygons(
  regions: Array<
    IFacsimileRegion & { Id: string; HighlightColor: string | undefined }
  >,
  scale: (x: number) => number
) {
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
        hoverCursor: 'pointer',
        data: region,
      }
    );
  });

  return polygons;
}
