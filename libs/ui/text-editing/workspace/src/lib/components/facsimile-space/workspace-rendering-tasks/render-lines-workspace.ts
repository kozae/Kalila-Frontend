import { IFacsimileCanvasProps } from '../facsimile-canvas';
import { IFacsimileRegion } from '@frontend/domain';
import { fabric } from 'fabric';
import {
  createRegionsDataUrl,
  drawRegions,
  addEventListeners,
  useHighlighter,
} from '@frontend/ui/facsimile';

export type LinesProcedureProps = Omit<
  IFacsimileCanvasProps,
  'onLoaded' | 'activeWorkspace'
> & {
  canvas: fabric.Canvas;
  regions: Array<
    IFacsimileRegion & { Id: string; HighlightColor: string | undefined }
  >;
  onRegionHovered: (id: string | null) => void;
  onCreateDataUrl: (id: string, data: string) => void;
};

export function renderLinesWorkspace({
  canvas,
  regions,
  scaleRatio,
  onRegionHovered,
  url,
  onCreateDataUrl,
}: LinesProcedureProps) {
  console.log('rendering lines');
  const polygons = drawRegions(canvas, regions, scaleRatio);
  const { showHighlight, hideHighlight } = useHighlighter(
    canvas,
    polygons,
    scaleRatio
  );
  createRegionsDataUrl(regions, url, onCreateDataUrl);
  addEventListeners(polygons, {
    onMouseOver: (region) => {
      hideHighlight();
      onRegionHovered(region.Id);
      showHighlight(region);
    },
    onMouseOut: () => {
      hideHighlight();
      onRegionHovered(null);
    },
  });
}
