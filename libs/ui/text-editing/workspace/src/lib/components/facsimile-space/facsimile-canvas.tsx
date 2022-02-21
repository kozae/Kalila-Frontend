import { fabric } from 'fabric';
import {
  FabricCanvas,
  renderBackgroundImage,
  useFabricJSEditor,
} from '@frontend/ui/facsimile';
import { useCallback, useEffect } from 'react';
import { ActiveWorkspace } from '../../text-editing-workspace-context';
import { selectRegions, useAppSelector } from '@frontend/shared-ui';
import { workspaceProcedure } from './workspace-rendering-tasks';

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
  const { editor, onReady } = useFabricJSEditor();
  const regions = useAppSelector(
    selectRegions(spaceToGroupMap[activeWorkspace])
  );
  const tasksAfterReady = useCallback(
    (canvas: fabric.Canvas) => {
      onReady(canvas);
      renderBackgroundImage(canvas, { width, height, url, scaleRatio });
      workspaceProcedure({
        activeWorkspace,
        canvas,
        width,
        height,
        url,
        scaleRatio,
        regions,
      });
      onLoaded();
    },
    [width, height, url, scaleRatio, regions, activeWorkspace]
  );

  useEffect(() => {
    if (editor && editor.canvas) {
      renderBackgroundImage(editor.canvas, { width, height, url, scaleRatio });
      workspaceProcedure({
        activeWorkspace,
        canvas: editor.canvas,
        width,
        height,
        url,
        scaleRatio,
        regions,
      });
      // todo add a cleanup function per workspace type
    }
  }, [width, height, url, scaleRatio, regions, activeWorkspace]);
  return (
    <FabricCanvas width={width} height={height} onReady={tasksAfterReady} />
  );
};
