import { FabricCanvas } from '@frontend/ui/facsimile';
import {
  useExternalWorkspaceEvents,
  useFacsimileCanvasEffects,
  useFacsimileCanvasState,
} from './hooks';
import {
  selectPageDataLoadingStatus,
  useAppSelector,
} from '@frontend/ui/store';

export const FacsimileCanvas = ({ onLoaded }: { onLoaded: () => void }) => {
  const canvasState = useFacsimileCanvasState();
  const loading = useAppSelector(selectPageDataLoadingStatus);
  useFacsimileCanvasEffects(canvasState, loading, onLoaded);
  useExternalWorkspaceEvents(canvasState);

  return (
    <FabricCanvas
      create={!loading}
      width={
        !canvasState.imageDisplayWidth !== undefined &&
        !isNaN(canvasState.imageDisplayWidth)
          ? canvasState.imageDisplayWidth
          : 0
      }
      height={
        canvasState.imageDisplayHeight !== undefined &&
        !isNaN(canvasState.imageDisplayHeight)
          ? canvasState.imageDisplayHeight
          : 0
      }
      onReady={canvasState.onReady}
      onDispose={canvasState.onDispose}
    />
  );
};
