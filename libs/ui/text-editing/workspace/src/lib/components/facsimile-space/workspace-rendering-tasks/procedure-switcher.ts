import { IFacsimileRegion } from '@frontend/domain';
import { renderLayoutWorkspace } from './render-layout-workspace';
import { IFacsimileCanvasProps } from '../facsimile-canvas';
import { fabric } from 'fabric';

export type WorkspaceProcedureProps = Omit<
  IFacsimileCanvasProps,
  'onLoaded'
> & {
  canvas: fabric.Canvas;
  regions: Array<IFacsimileRegion & { Id: string }>;
};

export function workspaceProcedure({
  activeWorkspace,
  ...props
}: WorkspaceProcedureProps) {
  switch (activeWorkspace) {
    case 'layout':
      renderLayoutWorkspace(props);
      return;
    default:
      return;
  }
}
