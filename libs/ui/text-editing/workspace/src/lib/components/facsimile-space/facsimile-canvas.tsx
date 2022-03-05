import { FabricCanvas } from '@frontend/ui/facsimile';
import {
  useDataUrlGeneration,
  useExternalWorkspaceEvents,
  useFacsimileCanvasEffects,
  useFacsimileCanvasState,
} from './hooks';

export const FacsimileCanvas = ({ onLoaded }: { onLoaded: () => void }) => {
  const canvasState = useFacsimileCanvasState();
  useFacsimileCanvasEffects(canvasState, onLoaded);
  useExternalWorkspaceEvents(canvasState);
  useDataUrlGeneration(canvasState);

  return (
    <FabricCanvas
      width={
        ![NaN, undefined].includes(canvasState.imageDisplayWidth)
          ? canvasState.imageDisplayWidth
          : 0
      }
      height={
        ![NaN, undefined].includes(canvasState.imageDisplayHeight)
          ? canvasState.imageDisplayHeight
          : 0
      }
      onReady={canvasState.onReady}
    />
  );
};
