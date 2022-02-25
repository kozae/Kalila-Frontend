import { IFacsimileRegion } from '@frontend/domain';
import { fabric } from 'fabric';
import {
  AngleHelper,
  drawPolygons,
  addEventListeners,
} from '@frontend/ui/facsimile';

export type LayoutProcedureProps = {
  canvas: fabric.Canvas;
  polygons: fabric.Polygon[];
  showHighlight: (region: IFacsimileRegion) => void;
  hideHighlight: () => void;
  onRegionHighlighted: (id: string | null) => void;
  onElementSelected: (id: string | null) => void;
};

export function renderLayoutWorkspace({
  canvas,
  polygons,
  showHighlight,
  hideHighlight,
  onRegionHighlighted,
  onElementSelected,
}: LayoutProcedureProps) {
  console.log('rendering layout');
  drawPolygons(canvas, polygons);
  addEventListeners(polygons, {
    onMouseOver: (region, e) => {
      hideHighlight();
      onRegionHighlighted(region.Id);
      showHighlight(region);
    },
    onMouseOut: (e) => {
      hideHighlight();
      onRegionHighlighted(null);
    },
    onClicked: (id, e) => {
      onElementSelected(id);
    },
  });
}

function getYOffset({ x, y }: { x: number; y: number }, r: number) {
  return (
    y * Math.cos(AngleHelper.degToRad(r)) -
    x * Math.sin(AngleHelper.degToRad(r))
  );
}

function getXOffset({ x, y }: { x: number; y: number }, r: number) {
  return (
    x * Math.cos(AngleHelper.degToRad(r)) +
    y * Math.sin(AngleHelper.degToRad(r))
  );
}
