import { IFacsimileCanvasProps } from '../facsimile-canvas';
import { IFacsimileRegion } from '@frontend/domain';
import { fabric } from 'fabric';
import { drawRegions } from '@frontend/ui/facsimile';

export type LinesProcedureProps = Omit<
  IFacsimileCanvasProps,
  'onLoaded' | 'activeWorkspace'
> & {
  canvas: fabric.Canvas;
  regions: Array<IFacsimileRegion & { Id: string }>;
};

export function renderLinesWorkspace({
  canvas,
  regions,
  scaleRatio,
}: LinesProcedureProps) {
  console.log(regions);
  console.log('rendering lines');
  drawRegions(canvas, regions, scaleRatio);
}
