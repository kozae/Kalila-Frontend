import { FacsimileRegion } from '@frontend/domain';
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
  showHighlight: (
    region: { Region: FacsimileRegion },
    scaleRatio: number
  ) => void;
  hideHighlight: () => void;
  onRegionHighlighted: (
    region: { Region: FacsimileRegion; Id: string } | null
  ) => void;
  onElementSelected: ({
    Id,
    Region,
  }: {
    Region: FacsimileRegion;
    Id: string;
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
    onClicked: (Id, Region) => {
      onElementSelected({ Id, Region: Region.Region });
    },
  });
}
