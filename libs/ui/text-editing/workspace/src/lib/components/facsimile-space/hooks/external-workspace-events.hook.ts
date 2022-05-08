import { useCallback, useEffect } from 'react';
import { PolygonHelper } from '@frontend/ui/facsimile';
import { IEvent } from 'fabric/fabric-impl';
import { FacsimileCanvasState } from './facsimile-canvas-state.hook';
import {
  useAppSelector,
  selectRegionHoveredInToolSpace,
  useAppDispatch,
  onRegionHoveredInFacsimileSpace,
  onRegionHoveredInToolSpace,
  setRegionUnderEditPolygon,
} from '@frontend/shared-ui';

export function useExternalWorkspaceEvents(canvasState: FacsimileCanvasState) {
  const dispatch = useAppDispatch();
  const regionHoveredInToolSpace = useAppSelector(
    selectRegionHoveredInToolSpace
  );
  useEffect(() => {
    if (regionHoveredInToolSpace === null) {
      canvasState.hideHighlight();
    } else if (regionHoveredInToolSpace) {
      canvasState.showHighlight(
        regionHoveredInToolSpace,
        canvasState.scaleRatio
      );
    }
  }, [
    regionHoveredInToolSpace,
    canvasState.showHighlight,
    canvasState.hideHighlight,
  ]);

  const round = Math.round;
  const startEditor = useCallback(
    ({ id }: any) => {
      const handleChange = (e: IEvent) => {
        const rectWidth = ((e.target?.width as number) *
          (e?.target?.scaleX as number)) as number;
        const rectHeight = ((e.target?.height as number) *
          (e?.target?.scaleY as number)) as number;
        const rectDimensions = {
          X: round((e.target?.left as number) / canvasState.scaleRatio),
          Y: round((e.target?.top as number) / canvasState.scaleRatio),
          Width: round(rectWidth / canvasState.scaleRatio),
          Height: round(rectHeight / canvasState.scaleRatio),
          Rotation: e.target?.angle as number,
        };

        dispatch(
          setRegionUnderEditPolygon({
            Points: PolygonHelper.fromRect(
              rectDimensions,
              rectDimensions.Rotation
            ),
            Rotation: round(rectDimensions.Rotation),
          })
        );
      };

      canvasState.hideHighlight(); // make sure the highlight is hidden
      dispatch(onRegionHoveredInFacsimileSpace(null));
      dispatch(onRegionHoveredInToolSpace(null));
      canvasState.showEditor(id, canvasState.scaleRatio, handleChange);
    },
    [canvasState.showEditor, canvasState.hideHighlight, canvasState.scaleRatio]
  );

  const recreatePolygons = () =>
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

  useEffect(() => {
    if (canvasState.selectedElement.id === null) {
      canvasState.hideEditor();
      recreatePolygons();
    } else {
      startEditor(canvasState.selectedElement);
    }
  }, [canvasState.selectedElement.id]);

  useEffect(() => {
    if (canvasState.canvas && canvasState.selectedElement.id !== null) {
      console.log('rerendering image and editor');
      canvasState.renderPageFacsimile(canvasState.canvas);
      recreatePolygons();
      startEditor(canvasState.selectedElement);
    }
  }, [canvasState.scaleRatio]);
}
