import { fabric } from 'fabric';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  createEditor,
  createEditRegionRect,
  createHighlighter,
  createPolygons,
  createRegionHighlighter,
  loadImageAsFabricObject,
  renderBackgroundImage,
} from '@frontend/ui/facsimile';
import {
  onElementSelected,
  onRegionHoveredInFacsimileSpace,
  selectCurrentPageFacsimileData,
  selectRegions,
  selectSelectedElement,
  selectTextEditingActiveWorkspace,
  TextEditingActiveWorkspace,
  useAppDispatch,
  useAppSelector,
  useWindowSize,
} from '@frontend/shared-ui';
import { IFacsimileRegion } from '@frontend/domain';
import { workspaceProcedure } from '../workspace-rendering-tasks';
import { stringHasValue } from '@frontend/util';
import { TextEditingWorkspaceContext } from '@frontend/ui/text-editing/shared';

function createPageFacsimileRenderer(data: {
  imageDisplayWidth: number;
  imageDisplayHeight: number;
  scaleRatio: number;
  pageId: string;
  imageUrl: string;
}) {
  return useCallback(
    (canvas: fabric.Canvas) => {
      if (stringHasValue(data.pageId)) {
        canvas.clear();
        renderBackgroundImage(canvas, {
          width: data.imageDisplayWidth,
          height: data.imageDisplayHeight,
          scaleRatio: data.scaleRatio,
          url: data.imageUrl,
        });
      }
    },
    [data]
  );
}

function usePolygonEventHandlers(canvas: fabric.Canvas | null) {
  const highlighterRect = createRegionHighlighter();
  const editorRect = createEditRegionRect();
  return useMemo(() => {
    const { showEditor, hideEditor } = createEditor(canvas, editorRect);
    const { hideHighlight, showHighlight } = createHighlighter(
      canvas,
      highlighterRect
    );
    return { showEditor, hideEditor, hideHighlight, showHighlight };
  }, [canvas]);
}

export type PolygonEventHandlers = ReturnType<typeof usePolygonEventHandlers>;

function createPolygonRenderer() {
  const dispatch = useAppDispatch();
  const setHighlightedRegionId = (
    region: (IFacsimileRegion & { Id: string }) | null
  ) => {
    dispatch(onRegionHoveredInFacsimileSpace(null));
    setTimeout(() => dispatch(onRegionHoveredInFacsimileSpace(region)), 100);
  };
  const handleElementSelection = ({
    id,
    region,
  }: {
    id: string | null;
    region: IFacsimileRegion | null;
  }) => dispatch(onElementSelected({ id, region }));

  return (
    canvas: fabric.Canvas | null,
    activeWorkspace: TextEditingActiveWorkspace,
    regions: Array<
      IFacsimileRegion & { Id: string; HighlightColor: string | undefined }
    >,
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
  const { fabricImg } = useContext(TextEditingWorkspaceContext);

  const windowSize = useWindowSize();
  const facsimileData = useAppSelector((state) =>
    selectCurrentPageFacsimileData(state, windowSize, 110, 5, 45)
  );
  const activeWorkspace = useAppSelector(selectTextEditingActiveWorkspace);
  const regions = useAppSelector((state) =>
    selectRegions(state, activeWorkspace)
  );
  const selectedElement = useAppSelector(selectSelectedElement);

  const renderPageFacsimile = createPageFacsimileRenderer(facsimileData);
  const renderPolygons = createPolygonRenderer();
  const polygonEventHandlers = usePolygonEventHandlers(canvas);
  return {
    canvas,
    onReady: setCanvas,
    onDispose: () => setCanvas(null),
    regions,
    fabricImg,
    renderPageFacsimile,
    renderPolygons,
    selectedElement,
    ...facsimileData,
    ...polygonEventHandlers,
  };
}

export type FacsimileCanvasState = ReturnType<typeof useFacsimileCanvasState>;
