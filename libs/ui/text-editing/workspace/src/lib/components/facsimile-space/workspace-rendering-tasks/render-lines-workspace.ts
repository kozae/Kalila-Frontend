import { FacsimileRegion } from '@frontend/domain';
import { fabric } from 'fabric';
import {
  drawPolygons,
  addEventListeners,
  addTextToPolygons,
} from '@frontend/ui/facsimile';

export type LinesProcedureProps = {
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
  clickEvents: boolean;
};

export function renderLinesWorkspace({
  canvas,
  polygons,
  scaleRatio,
  hideHighlight,
  showHighlight,
  onRegionHighlighted,
  onElementSelected,
  clickEvents,
}: LinesProcedureProps) {
  drawPolygons(canvas, polygons);
  addTextToPolygons(canvas, polygons, (data) => `${data.Text}`);
  addEventListeners(polygons, {
    onMouseOver: (region) => {
      hideHighlight();
      onRegionHighlighted(region);
      showHighlight(region, scaleRatio);
    },
    onMouseOut: () => {
      hideHighlight();
      onRegionHighlighted(null);
    },
    onClicked: (id, region) => {
      clickEvents && onElementSelected({ Id: id, Region: region.Region });
    },
  });
}
