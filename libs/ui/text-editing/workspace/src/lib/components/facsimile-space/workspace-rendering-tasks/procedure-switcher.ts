import { IFacsimileRegion } from '@frontend/domain';
import { renderLayoutWorkspace } from './render-layout-workspace';
import { fabric } from 'fabric';
import { renderLinesWorkspace } from './render-lines-workspace';
import { TextEditingActiveWorkspace } from '@frontend/shared-ui';

export type WorkspaceProcedureProps = {
  activeWorkspace: TextEditingActiveWorkspace;
  canvas: fabric.Canvas;
  polygons: fabric.Polygon[];
  showHighlight: (region: IFacsimileRegion) => void;
  hideHighlight: () => void;
  onRegionHighlighted: (
    region: (IFacsimileRegion & { Id: string }) | null
  ) => void;
  onElementSelected: (id: string | null) => void;
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
