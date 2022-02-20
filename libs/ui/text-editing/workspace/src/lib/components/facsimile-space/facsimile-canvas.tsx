import { fabric } from 'fabric';
import { FabricCanvas, useFabricJSEditor } from '@frontend/ui/facsimile';
import { useEffect } from 'react';
import { ActiveWorkspace } from '../../text-editing-workspace-context';

export interface IFacsimileCanvasProps {
  width: number;
  height: number;
  url: string;
  activeWorkspace: ActiveWorkspace;
  scaleRatio: number;
  onLoaded: () => void;
}

export const FacsimileCanvas = ({
  width,
  height,
  url,
  scaleRatio,
  onLoaded,
}: IFacsimileCanvasProps) => {
  const { editor, onReady } = useFabricJSEditor();
  const tasksAfterReady = (canvas: fabric.Canvas) => {
    onReady(canvas);
    drawImage(canvas, { width, height, url, scaleRatio });
    onLoaded();
  };
  useEffect(() => {
    if (editor && editor.canvas) {
      drawImage(editor.canvas, { width, height, url, scaleRatio });
    }
  }, [width, height, url, scaleRatio]);
  return (
    <FabricCanvas width={width} height={height} onReady={tasksAfterReady} />
  );
};

function drawImage(
  canvas: fabric.Canvas,
  {
    width,
    height,
    url,
    scaleRatio,
  }: Omit<IFacsimileCanvasProps, 'activeWorkspace' | 'onLoaded'>
) {
  canvas.setHeight(height);
  canvas.setWidth(width);
  fabric.Image.fromURL(url, (img: fabric.Image) => {
    img.set({
      top: 0,
      left: 0,
      selectable: false,
      evented: false,
      originX: 'left',
      originY: 'top',
      hasControls: false,
    });
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
    img.set({
      scaleX: scaleRatio,
      scaleY: scaleRatio,
    });
    canvas.renderAll();
  });
}
