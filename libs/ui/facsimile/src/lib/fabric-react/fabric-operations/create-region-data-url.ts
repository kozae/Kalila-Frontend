import { PolygonHelper } from '@frontend/ui/facsimile';
import { fabric } from 'fabric';
import { IFacsimileRegion, pointToSmallXAndY } from '@frontend/domain';

export function createRegionDataUrl(
  region: IFacsimileRegion,
  img: fabric.Image,
  callback: (dataUrl: string) => void
) {
  const points = PolygonHelper.orderPoints(region.Points);
  const { Width, Height } = PolygonHelper.getWidthAndHeight(points);
  img.set({
    clipPath: new fabric.Polygon(pointToSmallXAndY(points) as fabric.IPoint[], {
      top: points[0].Y - (img.height as number) / 2,
      left: points[0].X - (img.width as number) / 2,
    }),
  });
  const croppedDataUrl = img.toDataURL({
    format: 'jpg',
    width: Width,
    height: Height,
    top: points[0].Y,
    left: points[0].X,
  });
  fabric.Image.fromURL(croppedDataUrl, (croppedImg) => {
    croppedImg.set({
      angle: -region.Rotation,
    });
    callback(croppedImg.toDataURL({}));
  });
}

export function createRegionsDataUrls(
  regions: Array<IFacsimileRegion & { Id: string }>,
  img: fabric.Image,
  onCreate: (id: string, data: string) => void
) {
  regions.forEach((r) => {
    createRegionDataUrl(r, img, (dataUrl) => {
      onCreate(r.Id, dataUrl);
    });
  });
}
