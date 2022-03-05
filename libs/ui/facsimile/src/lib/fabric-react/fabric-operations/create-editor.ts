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

export const defaultEditRegion: IFacsimileRegion = {
  Points: [
    { X: 50, Y: 50 },
    { X: 300, Y: 50 },
    { X: 300, Y: 200 },
    { X: 50, Y: 200 },
  ],
  Rotation: 0,
};

function listenToKeyboardEvents() {
  document.addEventListener('keydown', (e) => {
    console.log(e);
    e.preventDefault();
  });
}

// function removeKeyboardEventListeners() {
//   document.removeEventListener('');
// }

function showEditorFactory(canvas: fabric.Canvas, editorRect: fabric.Rect) {
  return (
    id: string,
    scaleRatio: number,
    onChanged: (e: IEvent) => void,
    editRegion: IFacsimileRegion = defaultEditRegion
  ) => {
    const scale = (x: number) => x * scaleRatio;
    const polygons = canvas.getObjects();
    const existingPolygon = polygons.find((p) => p.data.Id === id);
    const polygonToEdit = existingPolygon ? existingPolygon.data : editRegion;
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
    listenToKeyboardEvents();
    canvas.on('object:modified', (e) => onChanged(e));
  };
}

function hideEditorFactory(canvas: fabric.Canvas) {
  return () => {
    canvas.remove(...canvas.getObjects());
    canvas.renderAll();
  };
}

export function createEditor(
  canvas: fabric.Canvas | null,
  editorRect: fabric.Rect
) {
  const showEditor = canvas
    ? showEditorFactory(canvas, editorRect)
    : (
        id: string,
        scaleRatio: number,
        onChanged: (e: IEvent) => void,
        editRegion: IFacsimileRegion = defaultEditRegion
      ) => {};
  const hideEditor = canvas ? hideEditorFactory(canvas) : () => {};
  return { showEditor, hideEditor };
}
