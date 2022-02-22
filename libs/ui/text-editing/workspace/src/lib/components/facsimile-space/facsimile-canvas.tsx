import { fabric } from 'fabric';
import {
  FabricCanvas,
  renderBackgroundImage,
  useFabricJSEditor,
} from '@frontend/ui/facsimile';
import { useCallback, useEffect, useState } from 'react';
import { ActiveWorkspace } from '../../text-editing-workspace-context';
import { selectRegions, useAppSelector } from '@frontend/shared-ui';
import { workspaceProcedure } from './workspace-rendering-tasks';
import Portal from '@mui/material/Portal';
import Box from '@mui/material/Box';

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
  const [regionPreview, setRegionPreview] = useState<string | null>(null);
  const handleHover = (data: string | null) => {
    setRegionPreview(data);
  };
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
        handleHover,
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
        handleHover,
      });
    }
  }, [width, height, url, scaleRatio, regions, activeWorkspace]);

  return (
    <>
      <FabricCanvas width={width} height={height} onReady={tasksAfterReady} />
      {regionPreview !== null ? (
        <Portal>
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              right: 0,
              zIndex: 90,
              maxWidth: '800px',
            }}
          >
            <img width="100%" height="auto" src={regionPreview} alt="preview" />
          </Box>
        </Portal>
      ) : null}
    </>
  );
};
