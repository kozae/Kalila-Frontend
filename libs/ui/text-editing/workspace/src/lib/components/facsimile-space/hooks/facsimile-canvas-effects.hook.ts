import { FacsimileCanvasState } from './facsimile-canvas-state.hook';
import { useEffect } from 'react';

export function useFacsimileCanvasEffects(
  canvasState: FacsimileCanvasState,
  loading: boolean | undefined,
  onLoaded: () => void
) {
  useEffect(() => {
    return () => {
      canvasState.onReady(null);
    };
  }, []);

  useEffect(() => {
    if (!loading && canvasState.canvas) {
      console.log('rendering image after canvas created');
      canvasState.renderPageFacsimile(canvasState.canvas);
      onLoaded();
    }
  }, [canvasState.canvas]);

  useEffect(() => {
    if (
      !loading &&
      canvasState.canvas &&
      canvasState.selectedElement.id === null
    ) {
      if (canvasState.regions.activeWorkspace === 'description') {
        console.log('rerendering image only');
        canvasState.renderPageFacsimile(canvasState.canvas);
      }
      if (
        ['lines', 'layout', 'transcription', 'segmentation'].includes(
          canvasState.regions.activeWorkspace
        )
      ) {
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
    }
  }, [canvasState.scaleRatio, canvasState.regions]);
}
