import { FabricCanvas } from '@frontend/ui/facsimile';
import {
  AccessMode,
  ActiveWorkspace,
} from '../../text-editing-workspace-context';
import { selectRegions, useAppSelector } from '@frontend/shared-ui';
import { FacsimileRegionPreview } from './facsimile-region-preview';
import {
  useDataUrlGeneration,
  useExternalWorkspaceEvents,
  useFacsimileCanvasState,
} from './hooks';

export interface IFacsimileCanvasProps {
  width: number;
  height: number;
  url: string;
  activeWorkspace: ActiveWorkspace;
  accessMode: AccessMode;
  scaleRatio: number;
  onLoaded: () => void;
}

export const FacsimileCanvas = (props: IFacsimileCanvasProps) => {
  const canvasState = useFacsimileCanvasState(props);
  useExternalWorkspaceEvents(props, canvasState);
  useDataUrlGeneration(canvasState);

  return (
    <>
      <FabricCanvas
        width={props.width}
        height={props.height}
        onReady={canvasState.onReady}
      />
      <FacsimileRegionPreview
        accessMode={props.accessMode}
        highlightedRegionId={canvasState.highlightedRegionId}
      />
    </>
  );
};
