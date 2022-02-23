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
  scaleRatio: number,
  highlighter: fabric.Rect,
  polygons: fabric.Polygon[],
  canvas: fabric.Canvas
) {
  const scale = (x: number) => x * scaleRatio;
  const width = canvas.width as number;
  const height = canvas.height as number;
  return (region: IFacsimileRegion) => {
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

export function useHighlighter(
  canvas: fabric.Canvas,
  polygons: fabric.Polygon[],
  scaleRatio: number
) {
  const highlighter = createRegionHighlighter();
  const showHighlight = showHighlightFactory(
    scaleRatio,
    highlighter,
    polygons,
    canvas
  );
  const hideHighlight = hideHighlightFactory(highlighter, polygons, canvas);

  return { hideHighlight, showHighlight };
}
