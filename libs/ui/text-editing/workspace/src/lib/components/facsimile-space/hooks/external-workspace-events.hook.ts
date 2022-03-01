import { useCallback, useEffect } from 'react';
import { createDataUrlFromRect } from '@frontend/ui/facsimile';
import { IEvent } from 'fabric/fabric-impl';
import { fabric } from 'fabric';
import { FacsimileCanvasState } from './facsimile-canvas-state.hook';
import {
  useAppSelector,
  selectRegionHoveredInToolSpace,
  useAppDispatch,
  setRegionUnderEditUrl,
  onRegionHoveredInFacsimileSpace,
  onRegionHoveredInToolSpace,
  selectSelectedElementId,
} from '@frontend/shared-ui';

export function useExternalWorkspaceEvents(canvasState: FacsimileCanvasState) {
  const dispatch = useAppDispatch();
  const selectedElementId = useAppSelector(selectSelectedElementId);
  const regionHoveredInToolSpace = useAppSelector(
    selectRegionHoveredInToolSpace
  );
  useEffect(() => {
    if (regionHoveredInToolSpace === null) {
      canvasState.hideHighlight();
    } else if (regionHoveredInToolSpace) {
      canvasState.showHighlight(regionHoveredInToolSpace);
    }
  }, [
    regionHoveredInToolSpace,
    canvasState.showHighlight,
    canvasState.hideHighlight,
  ]);

  const round = Math.round;
  const startEditor = useCallback(
    (id) => {
      const handleChange = (e: IEvent) => {
        dispatch(setRegionUnderEditUrl(null));
        const rectDimensions = {
          X: round((e.target?.left as number) / canvasState.scaleRatio),
          Y: round((e.target?.top as number) / canvasState.scaleRatio),
          Width: round((e.target?.width as number) / canvasState.scaleRatio),
          Height: round((e.target?.height as number) / canvasState.scaleRatio),
          Rotation: e.target?.angle as number,
        };

        createDataUrlFromRect(
          rectDimensions,
          canvasState.fabricImg as fabric.Image,
          (url) => dispatch(setRegionUnderEditUrl(url))
        );
      };

      canvasState.hideHighlight(); // make sure the highlight is hidden
      dispatch(onRegionHoveredInFacsimileSpace(null));
      dispatch(onRegionHoveredInToolSpace(null));
      canvasState.showEditor(id, handleChange);
    },
    [
      canvasState.showEditor,
      canvasState.hideHighlight,
      canvasState.fabricImg,
      canvasState.scaleRatio,
    ]
  );

  useEffect(() => {
    if (selectedElementId === null) {
      canvasState.hideEditor();
    } else {
      startEditor(selectedElementId);
    }
  }, [selectedElementId]);
}
