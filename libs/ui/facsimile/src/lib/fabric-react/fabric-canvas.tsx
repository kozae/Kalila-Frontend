import React, { CSSProperties, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { ICanvasOptions } from 'fabric/fabric-impl';

export interface IFabricCanvasProps {
  style?: CSSProperties;
  onReady?: (canvas: fabric.Canvas) => void;
  options?: ICanvasOptions;
  width: number;
  height: number;
}

/**
 * Fabric canvas as component
 */
export const FabricCanvas = ({
  style,
  options,
  width,
  height,
  onReady,
}: IFabricCanvasProps) => {
  const canvasEl = useRef(null);
  const canvasElParent = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasEl.current, options ?? {});

    if (onReady) {
      onReady(canvas);
    }

    return () => {
      console.log('canvas disposed');
      canvas.dispose();
    };
  }, []);
  return (
    <div
      ref={canvasElParent}
      style={{ width: 'fit-content', height: 'fit-content' }}
    >
      <canvas width={width} height={height} ref={canvasEl} />
    </div>
  );
};
