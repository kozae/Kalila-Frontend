import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fabric } from 'fabric';
import { IFacsimileRegion } from '@frontend/domain';
import {
  createPolygons,
  createRegionHighlighter,
  createHighlighter,
  renderBackgroundImage,
  IPolygonData,
  createEditor,
  loadImageAsFabricObject,
  createEditRegionRect,
} from '@frontend/ui/facsimile';
import { IFacsimileCanvasProps } from '../facsimile-canvas';
import { workspaceProcedure } from '../workspace-rendering-tasks';
import {
  ActiveWorkspace,
  TextEditingWorkspaceContext,
} from '../../../text-editing-workspace-context';
import { selectRegions, useAppSelector } from '@frontend/shared-ui';

const spaceToGroupMap: Record<ActiveWorkspace, 'layout' | 'lines' | undefined> =
  {
    description: undefined,
    segmentation: undefined,
    layout: 'layout',
    lines: 'lines',
    transcription: 'lines',
  };

function useBackgroundImageChangeEffect(
  canvas: fabric.Canvas | null,
  { width, height, url, scaleRatio, activeWorkspace }: IFacsimileCanvasProps
) {
  useEffect(() => {
    if (canvas) {
      canvas.clear();
      renderBackgroundImage(canvas, { width, height, url, scaleRatio });
    }
  }, [width, height, url, scaleRatio, activeWorkspace]);
}

function createOnReadyFunction(
  canvas: fabric.Canvas | null,
  setCanvas: (canvas: fabric.Canvas) => void,
  regions: Array<
    IFacsimileRegion & { Id: string; HighlightColor: string | undefined }
  >,
  { width, height, url, scaleRatio, onLoaded }: IFacsimileCanvasProps
) {
  return useCallback(
    (canvas: fabric.Canvas) => {
      setCanvas(canvas);
      canvas.clear();
      renderBackgroundImage(canvas, { width, height, url, scaleRatio });
      onLoaded();
    },
    [width, height, url, scaleRatio, regions]
  );
}

function usePolygonData(
  canvas: fabric.Canvas | null,
  regions: Array<
    IFacsimileRegion & { Id: string; HighlightColor: string | undefined }
  >,
  { scaleRatio }: IFacsimileCanvasProps
) {
  const highlighterRect = createRegionHighlighter();
  const editorRect = createEditRegionRect();
  return useMemo(() => {
    const scale = (x: number) => x * scaleRatio;
    const polygons = createPolygons(regions, scale);
    const { showEditor, hideEditor } = createEditor(
      canvas,
      editorRect,
      Object.values(polygons),
      scale
    );
    const { hideHighlight, showHighlight } = createHighlighter(
      canvas,
      highlighterRect,
      Object.values(polygons),
      scale
    );
    return { polygons, hideHighlight, showHighlight, showEditor, hideEditor };
  }, [regions, scaleRatio, canvas]);
}

function usePolygonChangeEffect(
  canvas: fabric.Canvas | null,
  polygonData: IPolygonData,
  activeWorkspace: ActiveWorkspace,
  setHighlightedRegionId: (id: string | null) => void
) {
  const { onElementSelected } = useContext(TextEditingWorkspaceContext);
  useEffect(() => {
    if (canvas) {
      workspaceProcedure({
        canvas,
        activeWorkspace,
        polygons: Object.values(polygonData.polygons),
        hideHighlight: polygonData.hideHighlight,
        showHighlight: polygonData.showHighlight,
        onRegionHighlighted: setHighlightedRegionId,
        onElementSelected,
      });
    }
  }, [activeWorkspace, polygonData]);
}

function useImageAsFabricObject(url: string) {
  const [fabricImg, setFabricImg] = useState<null | fabric.Image>(null);
  useEffect(() => {
    loadImageAsFabricObject(url, setFabricImg);
  }, [url]);
  return fabricImg;
}

export function useFacsimileCanvasState(props: IFacsimileCanvasProps) {
  const regions = useAppSelector(
    selectRegions(spaceToGroupMap[props.activeWorkspace])
  );
  const [canvas, setCanvas] = useState<null | fabric.Canvas>(null);
  const fabricImg = useImageAsFabricObject(props.url);
  const [highlightedRegionId, setHighlightedRegionId] = useState<string | null>(
    null
  );
  const onReady = createOnReadyFunction(canvas, setCanvas, regions, props);

  useBackgroundImageChangeEffect(canvas, props);
  const polygonData = usePolygonData(canvas, regions, props);
  usePolygonChangeEffect(
    canvas,
    polygonData,
    props.activeWorkspace,
    setHighlightedRegionId
  );

  return {
    canvas,
    fabricImg,
    regions,
    onReady,
    highlightedRegionId,
    setHighlightedRegionId,
    ...polygonData,
  };
}

export type FacsimileCanvasState = ReturnType<typeof useFacsimileCanvasState>;
