import { AngleHelper, PolygonHelper } from '@frontend/ui/facsimile';
import { fabric } from 'fabric';
import { IFacsimileRegion, pointToSmallXAndY } from '@frontend/domain';
import * as Jimp from 'jimp/browser';

const PADDING = 400;

export function createRegionDataUrl(
  region: IFacsimileRegion,
  img: fabric.Image,
  callback: (dataUrl: string) => void
) {
  const { Width, Height } = PolygonHelper.getWidthAndHeight(region.Points);
  const points = PolygonHelper.orderPoints(region.Points);
  const paddedPolygon = [
    {
      X: points[0].X - PADDING,
      Y: points[0].Y - PADDING,
    },
    {
      X: points[1].X + 2 * PADDING + Width,
      Y: points[1].Y - PADDING,
    },
    {
      X: points[2].X + 2 * PADDING + Width,
      Y: points[2].Y + 2 * PADDING + Height,
    },
    {
      X: points[3].X - PADDING,
      Y: points[3].Y + 2 * PADDING + Height,
    },
  ];
  img.set({
    clipPath: new fabric.Polygon(
      pointToSmallXAndY(paddedPolygon) as fabric.IPoint[],
      {
        top: paddedPolygon[0].Y - (img.height as number) / 2,
        left: paddedPolygon[0].X - (img.width as number) / 2,
      }
    ),
  });
  const croppedDataUrl = img.toDataURL({
    format: 'jpg',
    width: 2 * PADDING + Width,
    height: 2 * PADDING + Height,
    top: points[0].Y - PADDING,
    left: points[0].X - PADDING,
  });

  Jimp.read(croppedDataUrl).then((jimpImg) => {
    console.log({ width: jimpImg.getWidth() });
    console.log({ height: jimpImg.getHeight() });
    jimpImg.rotate(-region.Rotation, false);
    console.log({ width: jimpImg.getWidth() });
    console.log({ height: jimpImg.getHeight() });
    callback(img.toString());
  });

  // fabric.Image.fromURL(croppedDataUrl, (croppedImg) => {
  //   croppedImg.set({
  //     angle: -region.Rotation,
  //   });
  //   const url = croppedImg.toDataURL({
  //     format: 'jpg',
  //   });
  //
  //   fabric.Image.fromURL(url, (rotatedImg) => {
  //     console.table({
  //       oWidth: croppedImg.width,
  //       oHeight: croppedImg.height,
  //       width: rotatedImg.width,
  //       height: rotatedImg.height,
  //       rotation: region.Rotation,
  //     });
  //     callback(rotatedImg.toDataURL({ left: PADDING, top: PADDING }));
  //   });
  // });
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

function getYOffset({ X, Y }: { X: number; Y: number }, r: number) {
  return (
    Y * Math.cos(AngleHelper.degToRad(r)) -
    X * Math.sin(AngleHelper.degToRad(r))
  );
}

function getXOffset({ X, Y }: { X: number; Y: number }, r: number) {
  return (
    X * Math.cos(AngleHelper.degToRad(r)) +
    Y * Math.sin(AngleHelper.degToRad(r))
  );
}
