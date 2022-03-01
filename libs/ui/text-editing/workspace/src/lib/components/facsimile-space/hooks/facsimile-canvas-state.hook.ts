import { fabric } from 'fabric';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createEditor,
  createEditRegionRect,
  createHighlighter,
  createPolygons,
  createRegionHighlighter,
  IPolygonData,
  loadImageAsFabricObject,
  renderBackgroundImage,
} from '@frontend/ui/facsimile';
import {
  onElementSelected,
  onRegionHoveredInFacsimileSpace,
  selectImageDimensions,
  selectImageUrl,
  selectPageDataLoadingStatus,
  selectRegions,
  selectTextEditingActiveWorkspace,
  TextEditingActiveWorkspace,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import { IFacsimileRegion } from '@frontend/domain';
import { workspaceProcedure } from '../workspace-rendering-tasks';

function createOnReadyFunction(
  canvas: fabric.Canvas | null,
  setCanvas: (canvas: fabric.Canvas) => void,
  {
    imageDisplayWidth,
    imageDisplayHeight,
    imageUrl,
    scaleRatio,
    onLoaded,
  }: {
    imageDisplayWidth: number;
    imageDisplayHeight: number;
    imageUrl: string;
    scaleRatio: number;
    onLoaded: () => void;
  }
) {
  return useCallback(
    (canvas: fabric.Canvas) => {
      setCanvas(canvas);
      canvas.clear();
      renderBackgroundImage(canvas, {
        width: imageDisplayWidth,
        height: imageDisplayHeight,
        url: imageUrl,
        scaleRatio,
      });
      onLoaded();
    },
    [imageDisplayWidth, imageDisplayHeight, imageUrl, scaleRatio]
  );
}

function useBackgroundImageChangeEffect(
  canvas: fabric.Canvas | null,
  {
    imageDisplayWidth,
    imageDisplayHeight,
    imageUrl,
    scaleRatio,
    activeWorkspace,
    loading,
  }: {
    imageDisplayWidth: number;
    imageDisplayHeight: number;
    imageUrl: string;
    scaleRatio: number;
    activeWorkspace: TextEditingActiveWorkspace;
    loading: boolean;
  }
) {
  useEffect(() => {
    if (canvas && !loading) {
      console.log('recreating background image');
      canvas.clear();
      renderBackgroundImage(canvas, {
        width: imageDisplayWidth,
        height: imageDisplayHeight,
        url: imageUrl,
        scaleRatio,
      });
    }
    if (loading) {
      canvas?.clear();
    }
  }, [
    imageDisplayWidth,
    imageDisplayHeight,
    imageUrl,
    scaleRatio,
    activeWorkspace,
    loading,
  ]);
}

function useImageAsFabricObject(url: string) {
  const [fabricImg, setFabricImg] = useState<null | fabric.Image>(null);
  useEffect(() => {
    loadImageAsFabricObject(url, setFabricImg);
  }, [url]);
  return fabricImg;
}

function usePolygonData(
  canvas: fabric.Canvas | null,
  regions: Array<
    IFacsimileRegion & { Id: string; HighlightColor: string | undefined }
  >,
  scaleRatio: number
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
  activeWorkspace: TextEditingActiveWorkspace
) {
  const dispatch = useAppDispatch();
  const setHighlightedRegionId = (
    region: (IFacsimileRegion & { Id: string }) | null
  ) => {
    dispatch(onRegionHoveredInFacsimileSpace(null));
    setTimeout(() => dispatch(onRegionHoveredInFacsimileSpace(region)), 100);
  };
  const handleElementSelection = (id: string | null) =>
    dispatch(onElementSelected(id));

  useEffect(() => {
    if (canvas) {
      workspaceProcedure({
        canvas,
        activeWorkspace,
        polygons: Object.values(polygonData.polygons),
        hideHighlight: polygonData.hideHighlight,
        showHighlight: polygonData.showHighlight,
        onRegionHighlighted: setHighlightedRegionId,
        onElementSelected: handleElementSelection,
      });
    }
  }, [activeWorkspace, polygonData]);
}

const spaceToGroupMap: Record<
  TextEditingActiveWorkspace,
  'layout' | 'lines' | undefined
> = {
  description: undefined,
  segmentation: undefined,
  layout: 'layout',
  lines: 'lines',
  transcription: 'lines',
};

export function useFacsimileCanvasState(onLoaded: () => void) {
  const [canvas, setCanvas] = useState<null | fabric.Canvas>(null);
  const loading = useAppSelector(selectPageDataLoadingStatus);
  const imageSize = useAppSelector(selectImageDimensions);
  const imageUrl = useAppSelector(selectImageUrl);
  const activeWorkspace = useAppSelector(selectTextEditingActiveWorkspace);
  const regions = useAppSelector((state) =>
    selectRegions(state, spaceToGroupMap[activeWorkspace])
  );
  const fabricImg = useImageAsFabricObject(imageUrl);
  const onReady = createOnReadyFunction(canvas, setCanvas, {
    ...imageSize,
    imageUrl,
    onLoaded,
  });
  useBackgroundImageChangeEffect(canvas, {
    ...imageSize,
    imageUrl,
    activeWorkspace,
    loading,
  });
  const polygonData = usePolygonData(canvas, regions, imageSize.scaleRatio);
  usePolygonChangeEffect(canvas, polygonData, activeWorkspace);
  return { onReady, regions, fabricImg, ...imageSize, ...polygonData };
}

export type FacsimileCanvasState = ReturnType<typeof useFacsimileCanvasState>;
