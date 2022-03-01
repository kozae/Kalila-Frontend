import { FabricCanvas } from '@frontend/ui/facsimile';
import { useDataUrlGeneration, useExternalWorkspaceEvents } from './hooks';
import { useFacsimileCanvasState } from './hooks/facsimile-canvas-state.hook';
import { useImageDisplaySize } from '../../hooks/use-image-display-size.hook';

export const FacsimileCanvas = ({ onLoaded }: { onLoaded: () => void }) => {
  useImageDisplaySize();
  const canvasState = useFacsimileCanvasState(onLoaded);
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
