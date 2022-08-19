import { fabric } from 'fabric';
import { useCallback, useMemo, useState } from 'react';
import {
  createEditor,
  createEditRegionRect,
  createHighlighter,
  createPolygons,
  createRegionHighlighter,
  renderBackgroundImage,
} from '@frontend/ui/facsimile';
import {
  onElementSelected,
  onRegionHoveredInFacsimileSpace,
  selectCurrentPageFacsimileData,
  selectRegions,
  selectSelectedElement,
  selectTextEditingAccessMode,
  selectTextEditingActiveWorkspace,
  TextEditingActiveWorkspace,
  useAppDispatch,
  useAppSelector,
  useWindowSize,
} from '@frontend/shared-ui';
import { FacsimileRegion } from '@frontend/domain';
import { workspaceProcedure } from '../workspace-rendering-tasks';
import { stringHasValue } from '@frontend/util';

function createPageFacsimileRenderer(data: {
  imageDisplayWidth: number;
  imageDisplayHeight: number;
  scaleRatio: number;
  pageId: string;
  imageUrl: string | undefined;
}) {
  return useCallback(
    (canvas: fabric.Canvas) => {
      if (stringHasValue(data.pageId)) {
        canvas.clear();
        renderBackgroundImage(canvas, {
          width: data.imageDisplayWidth,
          height: data.imageDisplayHeight,
          scaleRatio: data.scaleRatio,
          url: data.imageUrl as string,
        });
      }
    },
    [data]
  );
}

function usePolygonEventHandlers(canvas: fabric.Canvas | null) {
  const highlighterRect = createRegionHighlighter();
  return useMemo(() => {
    const { showEditor, hideEditor } = createEditor(canvas);
    const { hideHighlight, showHighlight } = createHighlighter(
      canvas,
      highlighterRect
    );
    return { showEditor, hideEditor, hideHighlight, showHighlight };
  }, [canvas]);
}

export type PolygonEventHandlers = ReturnType<typeof usePolygonEventHandlers>;

function createPolygonRenderer(accessMode: string) {
  const dispatch = useAppDispatch();
  const setHighlightedRegionId = (
    region: { Region: FacsimileRegion; Id: string } | null
  ) => {
    dispatch(onRegionHoveredInFacsimileSpace(null));
    setTimeout(() => dispatch(onRegionHoveredInFacsimileSpace(region)), 100);
  };
  const handleElementSelection = ({
    Id,
    Region,
  }: {
    Id: string | null;
    Region: FacsimileRegion;
  }) => accessMode !== 'view' && dispatch(onElementSelected({ Id, Region }));

  return (
    canvas: fabric.Canvas | null,
    activeWorkspace: TextEditingActiveWorkspace,
    regions: Array<{
      Id: string;
      HighlightColor: string | undefined;
      Text: string;
      Region: FacsimileRegion;
    }>,
    scaleRatio: number,
    {
      hideHighlight,
      showHighlight,
    }: Pick<PolygonEventHandlers, 'hideHighlight' | 'showHighlight'>
  ) => {
    if (canvas) {
      const scale = (x: number) => x * scaleRatio;
      const polygons = createPolygons(regions, scale);
      workspaceProcedure({
        canvas,
        scaleRatio,
        activeWorkspace: activeWorkspace,
        polygons: Object.values(polygons),
        hideHighlight: hideHighlight,
        showHighlight: showHighlight,
        onRegionHighlighted: setHighlightedRegionId,
        onElementSelected: handleElementSelection,
      });
    }
  };
}

export function useFacsimileCanvasState() {
  const [canvas, setCanvas] = useState<null | fabric.Canvas>(null);

  const windowSize = useWindowSize();
  const facsimileData = useAppSelector((state) =>
    selectCurrentPageFacsimileData(state, windowSize, 110, 5, 45)
  );
  const activeWorkspace = useAppSelector(selectTextEditingActiveWorkspace);
  const regions = useAppSelector((state) =>
    selectRegions(state, activeWorkspace)
  );
  const selectedElement = useAppSelector(selectSelectedElement);
  const accessMode = useAppSelector(selectTextEditingAccessMode);

  const renderPageFacsimile = createPageFacsimileRenderer(facsimileData);
  const renderPolygons = createPolygonRenderer(accessMode);
  const polygonEventHandlers = usePolygonEventHandlers(canvas);
  return {
    canvas,
    onReady: setCanvas,
    onDispose: () => setCanvas(null),
    regions,
    renderPageFacsimile,
    renderPolygons,
    selectedElement,
    ...facsimileData,
    ...polygonEventHandlers,
  };
}

export type FacsimileCanvasState = ReturnType<typeof useFacsimileCanvasState>;
