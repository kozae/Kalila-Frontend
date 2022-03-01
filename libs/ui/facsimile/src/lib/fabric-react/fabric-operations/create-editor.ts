import { fabric } from 'fabric';
import { hexToRgba } from '@frontend/util';
import { kalilaTheme } from '@frontend/shared-ui';
import { PolygonHelper } from '../../helpers';
import { IEvent } from 'fabric/fabric-impl';
import { IFacsimileRegion } from '@frontend/domain';

export function createEditRegionRect() {
  return new fabric.Rect({
    fill: hexToRgba(kalilaTheme.palette.primary.main, 0.4),
    selectable: true,
    hasControls: true,
    hoverCursor: 'move',
    borderColor: kalilaTheme.palette.primary.main,
    borderScaleFactor: 3,
    borderDashArray: [4, 4],
    cornerColor: kalilaTheme.palette.primary.dark,
    cornerStyle: 'circle',
    cornerSize: 11,
    transparentCorners: false,
  });
}

const defaultEditRegion: IFacsimileRegion = {
  Points: [
    { X: 50, Y: 50 },
    { X: 300, Y: 50 },
    { X: 300, Y: 200 },
    { X: 50, Y: 200 },
  ],
  Rotation: 0,
};

function showEditorFactory(
  scale: (x: number) => number,
  editorRect: fabric.Rect,
  polygons: fabric.Polygon[],
  canvas: fabric.Canvas
) {
  return (id: string, onChanged: (e: IEvent) => void) => {
    const existingPolygon = polygons.find((p) => p.data.Id === id);
    const polygonToEdit = existingPolygon
      ? existingPolygon.data
      : defaultEditRegion;
    if (existingPolygon) {
      canvas.remove(existingPolygon);
    }
    polygons
      .filter((p) => p.data.Id !== id)
      .forEach((p) => {
        p.off();
        p.set({
          stroke: undefined,
          fill: hexToRgba('#333333', 0.6),
        });
      });
    const scaledPolygon = PolygonHelper.scale(polygonToEdit.Points, scale);
    const { Width, Height } = PolygonHelper.getWidthAndHeight(scaledPolygon);
    editorRect.set({
      left: scaledPolygon[0].X,
      top: scaledPolygon[0].Y,
      width: Width,
      height: Height,
      angle: polygonToEdit.Rotation,
      evented: true,
    });
    canvas.add(editorRect);
    canvas.renderAll();
    canvas.setActiveObject(editorRect);
    canvas.on('object:modified', (e) => onChanged(e));
  };
}

function hideEditorFactory(
  canvas: fabric.Canvas,
  editorRect: fabric.Rect,
  polygons: fabric.Polygon[]
) {
  return () => {
    polygons.forEach((p) =>
      p.set({
        fill: hexToRgba(p.data.HighlightColor, 0.2),
        stroke: p.data.HighlightColor,
      })
    );
    editorRect.off();
    canvas.remove(editorRect);
    canvas.renderAll();
  };
}

export function createEditor(
  canvas: fabric.Canvas | null,
  editorRect: fabric.Rect,
  polygons: fabric.Polygon[],
  scale: (x: number) => number
) {
  const showEditor = canvas
    ? showEditorFactory(scale, editorRect, polygons, canvas)
    : (id: string, onChanged: (e: IEvent) => void) => {};
  const hideEditor = canvas
    ? hideEditorFactory(canvas, editorRect, polygons)
    : () => {};
  return { showEditor, hideEditor };
}
