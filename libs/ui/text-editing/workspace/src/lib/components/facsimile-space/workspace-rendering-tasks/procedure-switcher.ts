import { IFacsimileRegion } from '@frontend/domain';
import { renderLayoutWorkspace } from './render-layout-workspace';
import { IFacsimileCanvasProps } from '../facsimile-canvas';
import { fabric } from 'fabric';
import { renderLinesWorkspace } from './render-lines-workspace';

export type WorkspaceProcedureProps = Omit<
  IFacsimileCanvasProps,
  'onLoaded'
> & {
  canvas: fabric.Canvas;
  regions: Array<IFacsimileRegion & { Id: string }>;
  handleHover: (e: any) => void;
};

export function workspaceProcedure({
  activeWorkspace,
  ...props
}: WorkspaceProcedureProps) {
  switch (activeWorkspace) {
    case 'layout':
      renderLayoutWorkspace(props);
      return;
    case 'lines':
    case 'transcription':
      renderLinesWorkspace(props);
      return;
    default:
      return;
  }
}
