import { IFacsimileRegion } from '@frontend/domain';
import { fabric } from 'fabric';
import { drawPolygons, addEventListeners } from '@frontend/ui/facsimile';

export type LayoutProcedureProps = {
  canvas: fabric.Canvas;
  polygons: fabric.Polygon[];
  showHighlight: (region: IFacsimileRegion) => void;
  hideHighlight: () => void;
  onRegionHighlighted: (
    region: (IFacsimileRegion & { Id: string }) | null
  ) => void;
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
      onRegionHighlighted(region);
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
