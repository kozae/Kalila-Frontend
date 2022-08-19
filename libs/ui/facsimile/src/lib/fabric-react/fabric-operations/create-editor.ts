import { fabric } from 'fabric';
import { hexToRgba, regionToPoints } from '@frontend/util';
import { kalilaTheme } from '@frontend/shared-ui';
import { PolygonHelper } from '../../helpers';
import { IEvent, IRectOptions } from 'fabric/fabric-impl';
import Mousetrap from 'mousetrap';
import { FacsimileRegion, Polygon } from '@frontend/domain';

export const defaultEditRegion: { Region: FacsimileRegion } = {
  Region: [50, 50, 300, 50, 300, 200, 50, 200, 0],
};

const rectDefaultOptions: (
  polygon: Polygon,
  width: number,
  height: number,
  rotation: number
) => IRectOptions = (polygon, width, height, rotation) => {
  return {
    left: polygon[0].X,
    top: polygon[0].Y,
    width: width,
    height: height,
    angle: rotation,
    evented: true,
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
    data: {
      normal: {},
      hidden: {},
      greyed: {},
    },
  };
};

export function createEditRegionRect(
  polygon: Polygon,
  width: number,
  height: number,
  rotation: number
) {
  return new fabric.Rect(rectDefaultOptions(polygon, width, height, rotation));
}

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

function showEditorFactory(canvas: fabric.Canvas) {
  return (
    id: string,
    scaleRatio: number,
    onChanged: (e: IEvent) => void,
    editRegion: { Region: FacsimileRegion } = defaultEditRegion
  ) => {
    const scale = (x: number) => x * scaleRatio;
    const polygons = canvas.getObjects();
    const existingPolygon = polygons.find((p) => p.data.Id === id);
    const polygonToEdit = existingPolygon ? existingPolygon.data : editRegion;
    console.log({ polygonToEdit });
    if (existingPolygon) {
      canvas.remove(existingPolygon);
    }
    polygons
      .filter((p) => p.data.Id !== id)
      .forEach((p) => {
        p.off();
        p.set(p.data.greyed);
      });

    const scaledPolygon = PolygonHelper.scale(
      regionToPoints(polygonToEdit.Region),
      scale
    );
    const { Width, Height } = PolygonHelper.getWidthAndHeight(scaledPolygon);
    const editorRect = createEditRegionRect(
      scaledPolygon,
      Width,
      Height,
      polygonToEdit.Region[8]
    );
    canvas.add(editorRect);
    canvas.renderAll();
    canvas.setActiveObject(editorRect);
    listenToKeyboardEvents(canvas, editorRect);
    canvas.on('object:modified', (e) => onChanged(e));
  };
}

function hideEditorFactory(canvas: fabric.Canvas) {
  return () => {
    removeKeyboardEventListeners();
    try {
      canvas.remove(...canvas.getObjects());
    } catch {
      // no objects to remove
    }

    canvas.renderAll();
  };
}

export function createEditor(canvas: fabric.Canvas | null) {
  const showEditor = canvas
    ? showEditorFactory(canvas)
    : (
        id: string,
        scaleRatio: number,
        onChanged: (e: IEvent) => void,
        editRegion: { Region: FacsimileRegion } = defaultEditRegion
      ) => {};
  const hideEditor = canvas ? hideEditorFactory(canvas) : () => {};
  return { showEditor, hideEditor };
}
