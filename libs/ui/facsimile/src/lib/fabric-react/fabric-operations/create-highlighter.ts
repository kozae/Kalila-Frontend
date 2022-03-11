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
    data: {
      normal: {},
      hidden: {},
      greyed: {},
    },
  });
}

export function showHighlightFactory(
  canvas: fabric.Canvas,
  highlighter: fabric.Rect,
  hideHighlight: () => void
) {
  return (region: IFacsimileRegion, scaleRatio: number) => {
    const polygons = canvas.getObjects();
    const scale = (x: number) => x * scaleRatio;
    const width = canvas.width as number;
    const height = canvas.height as number;
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
    polygons.forEach((p) => p.set(p.data.hidden));
    canvas.renderAll();
  };
}

export function hideHighlightFactory(
  canvas: fabric.Canvas,
  highlighter: fabric.Rect
) {
  return () => {
    canvas.remove(highlighter);
    const polygons = canvas.getObjects();
    polygons.forEach((p) => p.set(p.data.normal));
    canvas.renderAll();
  };
}

export function createHighlighter(
  canvas: fabric.Canvas | null,
  highlighter: fabric.Rect
) {
  const hideHighlight = canvas
    ? hideHighlightFactory(canvas, highlighter)
    : () => {};

  const showHighlight = canvas
    ? showHighlightFactory(canvas, highlighter, hideHighlight)
    : (r: any) => {};

  return { hideHighlight, showHighlight };
}
