import { IFacsimileRegion } from '@frontend/domain';
import { fabric } from 'fabric';
import {
  drawPolygons,
  addEventListeners,
  addTextToPolygons,
} from '@frontend/ui/facsimile';

export type LayoutProcedureProps = {
  canvas: fabric.Canvas;
  polygons: fabric.Polygon[];
  scaleRatio: number;
  showHighlight: (region: IFacsimileRegion, scaleRatio: number) => void;
  hideHighlight: () => void;
  onRegionHighlighted: (
    region: (IFacsimileRegion & { Id: string }) | null
  ) => void;
  onElementSelected: ({
    id,
    region,
  }: {
    id: string | null;
    region: IFacsimileRegion | null;
  }) => void;
};

export function renderLayoutWorkspace({
  canvas,
  polygons,
  scaleRatio,
  showHighlight,
  hideHighlight,
  onRegionHighlighted,
  onElementSelected,
}: LayoutProcedureProps) {
  console.log('rendering layout');
  drawPolygons(canvas, polygons);
  addTextToPolygons(canvas, polygons, (data) => `${data.Text}`);
  addEventListeners(polygons, {
    onMouseOver: (region, e) => {
      hideHighlight();
      onRegionHighlighted(region);
      showHighlight(region, scaleRatio);
    },
    onMouseOut: (e) => {
      hideHighlight();
      onRegionHighlighted(null);
    },
    onClicked: (id, e) => {
      onElementSelected({ id, region: null });
    },
  });
}
