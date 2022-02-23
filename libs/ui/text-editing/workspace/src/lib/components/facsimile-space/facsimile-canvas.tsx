import { fabric } from 'fabric';
import {
  FabricCanvas,
  renderBackgroundImage,
  useFabricJSEditor,
} from '@frontend/ui/facsimile';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  ActiveWorkspace,
  TextEditingWorkspaceContext,
} from '../../text-editing-workspace-context';
import {
  addDataUrl,
  selectRegions,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import { workspaceProcedure } from './workspace-rendering-tasks';
import { FacsimileRegionPreview } from './facsimile-region-preview';

export interface IFacsimileCanvasProps {
  width: number;
  height: number;
  url: string;
  activeWorkspace: ActiveWorkspace;
  scaleRatio: number;
  onLoaded: () => void;
}

const spaceToGroupMap: Record<ActiveWorkspace, 'layout' | 'lines' | undefined> =
  {
    description: undefined,
    segmentation: undefined,
    layout: 'layout',
    lines: 'lines',
    transcription: 'lines',
  };

export const FacsimileCanvas = ({
  width,
  height,
  url,
  scaleRatio,
  activeWorkspace,
  onLoaded,
}: IFacsimileCanvasProps) => {
  const dispatch = useAppDispatch();
  const { editor, onReady } = useFabricJSEditor();
  const regions = useAppSelector(
    selectRegions(spaceToGroupMap[activeWorkspace])
  );

  const storeDataUrl = useCallback((id: string, data: string) => {
    dispatch(addDataUrl({ id, data }));
  }, []);
  const { hoveredElement } = useContext(TextEditingWorkspaceContext);
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

  useEffect(() => {
    console.log(hoveredElement);
  }, [hoveredElement]);

  const tasksAfterReady = useCallback(
    (canvas: fabric.Canvas) => {
      onReady(canvas);
      canvas.clear();
      renderBackgroundImage(canvas, { width, height, url, scaleRatio });
      workspaceProcedure({
        activeWorkspace,
        canvas,
        width,
        height,
        url,
        scaleRatio,
        regions,
        onRegionHovered: setHoveredRegionId,
        onCreateDataUrl: storeDataUrl,
      });
      onLoaded();
    },
    [width, height, url, scaleRatio, regions, activeWorkspace]
  );

  useEffect(() => {
    if (editor && editor.canvas) {
      editor.canvas.clear();
      renderBackgroundImage(editor.canvas, { width, height, url, scaleRatio });
      workspaceProcedure({
        activeWorkspace,
        canvas: editor.canvas,
        width,
        height,
        url,
        scaleRatio,
        regions,
        onRegionHovered: setHoveredRegionId,
        onCreateDataUrl: storeDataUrl,
      });
    }
  }, [width, height, url, scaleRatio, regions, activeWorkspace]);

  return (
    <>
      <FabricCanvas width={width} height={height} onReady={tasksAfterReady} />
      <FacsimileRegionPreview hoveredRegionId={hoveredRegionId} />
    </>
  );
};
