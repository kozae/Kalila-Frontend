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
    } else if (activeElement.FacsimileRegion) {
      canvasState.showHighlight(activeElement.FacsimileRegion);
    }
  }, [activeElement]);

  const round = Math.round;
  const startEditor = useCallback(
    (id) => {
      const handleChange = (e: IEvent) => {
        setRegionUnderEditUrl(null);
        const rectDimensions = {
          X: round((e.target?.left as number) / props.scaleRatio),
          Y: round((e.target?.top as number) / props.scaleRatio),
          Width: round((e.target?.width as number) / props.scaleRatio),
          Height: round((e.target?.height as number) / props.scaleRatio),
        };
        console.log({ rectDimensions });
        const Points = PolygonHelper.fromRect(
          rectDimensions,
          round(e.target?.angle as number)
        );
        createRegionDataUrl(
          { Points, Rotation: round(e.target?.angle as number) },
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
    console.log({ selectedElementId });
    if (selectedElementId === null) {
      canvasState.hideEditor();
    } else {
      startEditor(selectedElementId);
    }
  }, [selectedElementId]);
}
