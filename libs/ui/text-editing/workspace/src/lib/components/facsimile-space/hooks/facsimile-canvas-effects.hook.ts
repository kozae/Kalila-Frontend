import { FacsimileCanvasState } from './facsimile-canvas-state.hook';
import { useEffect } from 'react';

export function useFacsimileCanvasEffects(
  canvasState: FacsimileCanvasState,
  onLoaded: () => void
) {
  useEffect(() => {
    return () => {
      canvasState.onReady(null);
    };
  }, []);

  useEffect(() => {
    if (canvasState.canvas) {
      console.log('rerendering image only');
      canvasState.renderPageFacsimile(canvasState.canvas);
      onLoaded();
    }
  }, [canvasState.canvas]);

  useEffect(() => {
    if (canvasState.canvas && canvasState.selectedElement.id === null) {
      console.log('rerendering image and polygons');
      canvasState.renderPageFacsimile(canvasState.canvas);
      canvasState.renderPolygons(
        canvasState.canvas,
        canvasState.regions.activeWorkspace,
        canvasState.regions.data,
        canvasState.scaleRatio,
        {
          hideHighlight: canvasState.hideHighlight,
          showHighlight: canvasState.showHighlight,
        }
      );
    }
  }, [canvasState.scaleRatio, canvasState.regions.activeWorkspace]);
}
