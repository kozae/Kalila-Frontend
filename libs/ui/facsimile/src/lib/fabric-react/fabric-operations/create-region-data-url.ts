import { AngleHelper, PolygonHelper } from '@frontend/ui/facsimile';
import { fabric } from 'fabric';
import { IFacsimileRegion } from '@frontend/domain';

export function createDataUrlFromRect(
  {
    X,
    Y,
    Width,
    Height,
    Rotation,
    HighlightColor,
  }: {
    X: number;
    Y: number;
    Width: number;
    Height: number;
    Rotation: number;
    HighlightColor?: string;
  },
  img: fabric.Image,
  callback: (dataUrl: string) => void,
  paddingPercentage: number = 3
) {
  const padding = Math.floor(
    (Math.sqrt(Math.pow(Width, 2) + Math.pow(Height, 2)) * paddingPercentage) /
      100
  );
  const boundingRect = getBoundingRect(X, Y, Width, Height, Rotation);
  const croppedDataUrl = img.toDataURL({
    format: 'jpeg',
    width: 2 * padding + boundingRect.width,
    height: 2 * padding + boundingRect.height,
    top: boundingRect.y - padding,
    left: boundingRect.x - padding,
  });

  fabric.Image.fromURL(croppedDataUrl, (croppedImg) => {
    croppedImg.set({
      angle: -Rotation,
    });

    const rotatedImgUrl = croppedImg.toDataURL({
      format: 'jpeg',
    });

    fabric.Image.fromURL(rotatedImgUrl, (rotatedImg) => {
      const dX = ((rotatedImg.width as number) - (2 * padding + Width)) / 2;
      const dY = ((rotatedImg.height as number) - (2 * padding + Height)) / 2;

      const group = new fabric.Group([
        rotatedImg,
        createMask({
          width: Width,
          height: Height,
          x: dX,
          y: dY,
          padding,
          color: HighlightColor,
        }),
      ]);

      callback(
        group.toDataURL({
          format: 'jpeg',
          width: 2 * padding + Width,
          height: 2 * padding + Height,
          top: dY,
          left: dX,
        })
      );
    });
  });
}

export function createRegionsDataUrls(
  regions: Array<IFacsimileRegion & { Id: string; HighlightColor?: string }>,
  img: fabric.Image,
  onCreate: (id: string, data: string) => void
) {
  regions.forEach((r) => {
    const rect = {
      ...r.Points[0],
      ...PolygonHelper.getWidthAndHeight(r.Points),
      Rotation: r.Rotation,
      HighlightColor: r.HighlightColor,
    };
    createDataUrlFromRect(rect, img, (dataUrl) => {
      onCreate(r.Id, dataUrl);
    });
  });
}

function createMask(d: {
  width: number;
  height: number;
  x: number;
  y: number;
  padding: number;
  color: string | undefined;
}) {
  const rectWidth = 2 * d.padding + d.width,
    rectHeight = 2 * d.padding + d.height,
    clipPath = new fabric.Polygon(
      PolygonHelper.clipPolygonFromRect(rectWidth, rectHeight, [
        {
          X: d.padding,
          Y: d.padding,
        },
        {
          X: d.padding + d.width,
          Y: d.padding,
        },
        {
          X: d.padding + d.width,
          Y: d.padding + d.height,
        },
        {
          X: d.padding,
          Y: d.padding + d.height,
        },
      ]),
      {
        top: -rectHeight / 2,
        left: -rectWidth / 2,
        strokeLineJoin: 'round',
        strokeLineCap: 'round',
      }
    );
  return new fabric.Rect({
    width: rectWidth,
    height: rectHeight,
    top: d.y,
    left: d.x,
    fill: d.color ?? '#6b9e1f',
    opacity: 0.6,
    clipPath,
  });
}

function getBoundingRect(
  x0: number,
  y0: number,
  width: number,
  height: number,
  degree: number
) {
  if (degree <= 90) {
    const cos = Math.cos(AngleHelper.degToRad(degree)),
      sin = Math.sin(AngleHelper.degToRad(degree)),
      bHeight = Math.abs(width * sin) + Math.abs(height * cos),
      bWidth = Math.abs(height * sin) + Math.abs(width * cos),
      dX = Math.abs(height * sin);

    return {
      x: x0 - dX,
      y: y0,
      width: bWidth,
      height: bHeight,
    };
  }

  if (degree > 90 && degree <= 180) {
    const cos = Math.cos(AngleHelper.degToRad(90 - degree)),
      sin = Math.sin(AngleHelper.degToRad(90 - degree)),
      bWidth = Math.abs(width * sin) + Math.abs(height * cos),
      bHeight = Math.abs(height * sin) + Math.abs(width * cos),
      dY = Math.abs(height * sin);

    return {
      x: x0 - bWidth,
      y: y0 - dY,
      width: bWidth,
      height: bHeight,
    };
  }

  if (degree > 180 && degree <= 270) {
    const cos = Math.cos(AngleHelper.degToRad(180 - degree)),
      sin = Math.sin(AngleHelper.degToRad(180 - degree)),
      bHeight = Math.abs(width * sin) + Math.abs(height * cos),
      bWidth = Math.abs(height * sin) + Math.abs(width * cos),
      dX = Math.abs(width * cos),
      dY = bHeight;
    return {
      x: x0 - dX,
      y: y0 - dY,
      width: bWidth,
      height: bHeight,
    };
  } else {
    const cos = Math.cos(AngleHelper.degToRad(270 - degree)),
      sin = Math.sin(AngleHelper.degToRad(270 - degree)),
      bWidth = Math.abs(width * sin) + Math.abs(height * cos),
      bHeight = Math.abs(height * sin) + Math.abs(width * cos),
      dY = Math.abs(width * cos);
    return {
      x: x0,
      y: y0 - dY,
      width: bWidth,
      height: bHeight,
    };
  }
}
