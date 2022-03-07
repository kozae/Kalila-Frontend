import { fabric } from 'fabric';
import { hexToRgba } from '@frontend/util';
import { kalilaTheme } from '@frontend/shared-ui';
import { PolygonHelper } from '../../helpers';
import { IEvent, IRectOptions } from 'fabric/fabric-impl';
import { IFacsimileRegion } from '@frontend/domain';
import Mousetrap from 'mousetrap';

const rectDefaultOptions: () => IRectOptions = () => ({
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

export function createEditRegionRect() {
  return new fabric.Rect(rectDefaultOptions());
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

function listenToKeyboardEvents(
  canvas: fabric.Canvas,
  editorRect: fabric.Rect
) {
  const renderAndFireEvent = () => {
    canvas.requestRenderAll();
    canvas.fire('object:modified', { target: editorRect });
  };
  // rotation
  Mousetrap.bind('shift+r', () => {
    console.log('rotating');
    editorRect.set({ angle: (editorRect.angle as number) + 1 }).setCoords();
    renderAndFireEvent();
  });
  Mousetrap.bind('shift+ctrl+r', () => {
    editorRect.set({ angle: (editorRect.angle as number) - 1 }).setCoords();
    renderAndFireEvent();
  });
  // movement
  Mousetrap.bind('shift+right', () => {
    editorRect.set({ left: (editorRect.left as number) + 1 }).setCoords();
    renderAndFireEvent();
  });
  Mousetrap.bind('shift+left', () => {
    editorRect.set({ left: (editorRect.left as number) - 1 }).setCoords();
    renderAndFireEvent();
  });
  Mousetrap.bind('shift+up', () => {
    editorRect.set({ top: (editorRect.top as number) - 1 }).setCoords();
    renderAndFireEvent();
  });
  Mousetrap.bind('shift+down', () => {
    editorRect.set({ top: (editorRect.top as number) + 1 }).setCoords();
    renderAndFireEvent();
  });
  // expand
  Mousetrap.bind('shift+ctrl+d', () => {
    editorRect.set({ width: (editorRect.width as number) + 1 }).setCoords();
    renderAndFireEvent();
  });
  Mousetrap.bind('shift+ctrl+a', () => {
    editorRect
      .set({
        left: (editorRect.left as number) - 1,
        width: (editorRect.width as number) + 1,
      })
      .setCoords();
    renderAndFireEvent();
  });
  Mousetrap.bind('shift+ctrl+w', () => {
    editorRect
      .set({
        top: (editorRect.top as number) - 1,
        height: (editorRect.height as number) + 1,
      })
      .setCoords();
    renderAndFireEvent();
  });
  Mousetrap.bind('shift+ctrl+s', () => {
    editorRect.set({ height: (editorRect.height as number) + 1 }).setCoords();
    renderAndFireEvent();
  });
  // shrink
  Mousetrap.bind('shift+d', () => {
    editorRect
      .set({
        left: (editorRect.left as number) + 1,
        width: (editorRect.width as number) - 1,
      })
      .setCoords();
    renderAndFireEvent();
  });
  Mousetrap.bind('shift+a', () => {
    editorRect
      .set({
        width: (editorRect.width as number) - 1,
      })
      .setCoords();
    renderAndFireEvent();
  });
  Mousetrap.bind('shift+w', () => {
    editorRect
      .set({
        height: (editorRect.height as number) - 1,
      })
      .setCoords();
    renderAndFireEvent();
  });
  Mousetrap.bind('shift+s', () => {
    editorRect
      .set({
        top: (editorRect.top as number) + 1,
        height: (editorRect.height as number) - 1,
      })
      .setCoords();
    renderAndFireEvent();
  });
}

function removeKeyboardEventListeners() {
  Mousetrap.reset();
}

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
    listenToKeyboardEvents(canvas, editorRect);
    canvas.on('object:modified', (e) => onChanged(e));
  };
}

function hideEditorFactory(canvas: fabric.Canvas, editorRect: fabric.Rect) {
  return () => {
    removeKeyboardEventListeners();
    canvas.remove(...canvas.getObjects());
    editorRect.set(rectDefaultOptions());
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
  const hideEditor = canvas ? hideEditorFactory(canvas, editorRect) : () => {};
  return { showEditor, hideEditor };
}
