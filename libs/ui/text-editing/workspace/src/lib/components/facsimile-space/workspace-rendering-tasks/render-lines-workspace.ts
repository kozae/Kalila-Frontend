import { IFacsimileRegion } from '@frontend/domain';
import { fabric } from 'fabric';
import { drawPolygons, addEventListeners } from '@frontend/ui/facsimile';

export type LinesProcedureProps = {
  canvas: fabric.Canvas;
  polygons: fabric.Polygon[];
  showHighlight: (region: IFacsimileRegion) => void;
  hideHighlight: () => void;
  onRegionHighlighted: (id: string | null) => void;
  onElementSelected: (id: string | null) => void;
};

export function renderLinesWorkspace({
  canvas,
  polygons,
  hideHighlight,
  showHighlight,
  onRegionHighlighted,
  onElementSelected,
}: LinesProcedureProps) {
  console.log('rendering lines');
  drawPolygons(canvas, polygons);

  addEventListeners(polygons, {
    onMouseOver: (region) => {
      hideHighlight();
      onRegionHighlighted(region.Id);
      showHighlight(region);
    },
    onMouseOut: () => {
      hideHighlight();
      onRegionHighlighted(null);
    },
    onClicked: (id, e) => {
      onElementSelected(id);
    },
  });
}
