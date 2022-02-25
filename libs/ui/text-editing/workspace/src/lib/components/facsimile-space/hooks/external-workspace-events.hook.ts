import { useCallback, useContext, useEffect } from 'react';
import { TextEditingWorkspaceContext } from '../../../text-editing-workspace-context';
import { FacsimileCanvasState } from './facsimile-canvas-state.hook';
import { createRegionDataUrl, PolygonHelper } from '@frontend/ui/facsimile';
import { IEvent } from 'fabric/fabric-impl';
import { fabric } from 'fabric';
import { IFacsimileCanvasProps } from '../facsimile-canvas';

export function useExternalWorkspaceEvents(
  props: IFacsimileCanvasProps,
  canvasState: FacsimileCanvasState
) {
  const { activeElement, selectedElementId, setRegionUnderEditUrl } =
    useContext(TextEditingWorkspaceContext);
  useEffect(() => {
    if (activeElement === null) {
      canvasState.hideHighlight();
    } else {
      canvasState.showHighlight(activeElement.FacsimileRegion);
    }
  }, [activeElement, canvasState.hideHighlight, canvasState.showHighlight]);

  const startEditor = useCallback(
    (id) => {
      const handleChange = (e: IEvent) => {
        console.log({ e });
        setRegionUnderEditUrl(null);
        const rectDimensions = {
          X: (e.target?.left as number) / props.scaleRatio,
          Y: (e.target?.top as number) / props.scaleRatio,
          Width: (e.target?.width as number) / props.scaleRatio,
          Height: (e.target?.height as number) / props.scaleRatio,
        };
        const Points = PolygonHelper.fromRect(
          rectDimensions,
          e.target?.angle as number
        );
        createRegionDataUrl(
          { Points, Rotation: e.target?.angle as number },
          canvasState.fabricImg as fabric.Image,
          setRegionUnderEditUrl
        );
      };

      canvasState.hideHighlight(); // make sure the highlight is hidden
      canvasState.setHighlightedRegionId(null);
      canvasState.showEditor(id, handleChange);
    },
    [
      canvasState.showEditor,
      canvasState.hideHighlight,
      canvasState.fabricImg,
      props.scaleRatio,
    ]
  );

  useEffect(() => {
    if (selectedElementId === null) {
      canvasState.hideEditor();
    } else {
      startEditor(selectedElementId);
    }
  }, [selectedElementId, startEditor, canvasState.hideEditor]);
}
