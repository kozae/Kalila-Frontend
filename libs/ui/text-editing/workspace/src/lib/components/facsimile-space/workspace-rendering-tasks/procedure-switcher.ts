import { FacsimileRegion } from '@frontend/domain';
import { renderLayoutWorkspace } from './render-layout-workspace';
import { fabric } from 'fabric';
import { renderLinesWorkspace } from './render-lines-workspace';
import { TextEditingActiveWorkspace } from '@frontend/shared-ui';

export type WorkspaceProcedureProps = {
  activeWorkspace: TextEditingActiveWorkspace;
  canvas: fabric.Canvas;
  scaleRatio: number;
  polygons: fabric.Polygon[];
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

export function workspaceProcedure({
  activeWorkspace,
  ...props
}: WorkspaceProcedureProps) {
  switch (activeWorkspace) {
    case 'layout':
      renderLayoutWorkspace(props);
      return;
    case 'lines':
      renderLinesWorkspace({ ...props, clickEvents: true });
      return;
    case 'transcription':
    case 'segmentation':
      renderLinesWorkspace({ ...props, clickEvents: false });
      return;
    default:
      return;
  }
}
