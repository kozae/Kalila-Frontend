import { fabric } from 'fabric';
import { PolygonHelper } from '../../helpers';
import { hexToRgba } from '@frontend/util';
import { FacsimileRegion, pointToSmallXAndY } from '@frontend/domain';

export function drawPolygons(
  canvas: fabric.Canvas,
  polygons: fabric.Polygon[]
) {
  polygons.forEach((p) => canvas.add(p));
}

export function createPolygons(
  regions: Array<{
    Id: string;
    HighlightColor: string | undefined;
    Text: string;
    Region: FacsimileRegion;
  }>,
  scale: (x: number) => number
) {
  const polygons: Record<string, fabric.Polygon> = {};
  regions.forEach((region) => {
    const points = PolygonHelper.scale(
      [
        { X: region.Region[0], Y: region.Region[1] },
        { X: region.Region[2], Y: region.Region[3] },
        { X: region.Region[4], Y: region.Region[5] },
        { X: region.Region[6], Y: region.Region[7] },
      ],
      scale
    );
    const renderStates = {
      normal: {
        fill: hexToRgba(region.HighlightColor as string, 0.2),
        stroke: region.HighlightColor,
      },
      hidden: {
        fill: undefined,
        stroke: undefined,
      },
      greyed: {
        fill: hexToRgba('#333333', 0.6),
        stroke: undefined,
      },
    };
    polygons[region.Id] = new fabric.Polygon(
      pointToSmallXAndY(points) as fabric.IPoint[],
      {
        ...renderStates.normal,
        strokeWidth: 2,
        selectable: false,
        hasControls: false,
        hoverCursor: 'pointer',
        data: { ...region, ...renderStates },
      }
    );
  });

  return polygons;
}
