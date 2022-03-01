import { fabric } from 'fabric';
import { IFacsimileRegion } from '@frontend/domain';
import { PolygonHelper } from '@frontend/ui/facsimile';
import { hexToRgba } from '@frontend/util';

export function createRegionHighlighter() {
  return new fabric.Rect({
    left: 0,
    top: 0,
    fill: '',
    selectable: false,
    hoverCursor: 'default',
    evented: false,
    originX: 'left',
    originY: 'top',
  });
}

export function showHighlightFactory(
  scale: (x: number) => number,
  highlighter: fabric.Rect,
  polygons: fabric.Polygon[],
  canvas: fabric.Canvas,
  hideHighlight: () => void
) {
  const width = canvas.width as number;
  const height = canvas.height as number;
  return (region: IFacsimileRegion) => {
    hideHighlight(); // make sure that the highlight is hidden
    canvas.add(highlighter);
    const points = PolygonHelper.scale(
      //@ts-ignore
      region.Points,
      scale
    );
    const clipPath = new fabric.Polygon(
      PolygonHelper.clipPolygonFromRect(width, height, points),
      {
        top: -(height / 2),
        left: -(width / 2),
      }
    );
    highlighter.set({
      clipPath,
      fill: hexToRgba('#333333', 0.5),
      width,
      height,
    });
    highlighter.bringToFront();
    polygons.forEach((p) =>
      p.set({
        fill: '',
        stroke: '',
      })
    );
    canvas.renderAll();
  };
}

export function hideHighlightFactory(
  highlighter: fabric.Rect,
  polygons: fabric.Polygon[],
  canvas: fabric.Canvas
) {
  return () => {
    polygons.forEach((p) =>
      p.set({
        fill: hexToRgba(p.data.HighlightColor, 0.2),
        stroke: p.data.HighlightColor,
      })
    );
    canvas.remove(highlighter);
    canvas.renderAll();
  };
}

export function createHighlighter(
  canvas: fabric.Canvas | null,
  highlighter: fabric.Rect,
  polygons: fabric.Polygon[],
  scale: (x: number) => number
) {
  const hideHighlight = canvas
    ? hideHighlightFactory(highlighter, polygons, canvas)
    : () => {};

  const showHighlight = canvas
    ? showHighlightFactory(scale, highlighter, polygons, canvas, hideHighlight)
    : (r: any) => {};

  return { hideHighlight, showHighlight };
}
