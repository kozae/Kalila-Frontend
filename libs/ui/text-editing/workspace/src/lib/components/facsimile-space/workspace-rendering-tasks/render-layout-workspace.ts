import { IFacsimileCanvasProps } from '../facsimile-canvas';
import { IFacsimileRegion } from '@frontend/domain';
import { fabric } from 'fabric';
import {
  AngleHelper,
  drawRegions,
  addEventListeners,
  useHighlighter,
  createRegionsDataUrl,
} from '@frontend/ui/facsimile';

export type LayoutProcedureProps = Omit<
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

export function renderLayoutWorkspace({
  canvas,
  regions,
  scaleRatio,
  onRegionHovered,
  url,
  onCreateDataUrl,
}: LayoutProcedureProps) {
  console.log('rendering layout');
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
