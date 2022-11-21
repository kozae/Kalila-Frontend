import React, { CSSProperties, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { ICanvasOptions } from 'fabric/fabric-impl';

export interface IFabricCanvasProps {
  style?: CSSProperties;
  onReady?: (canvas: fabric.Canvas) => void;
  onDispose?: () => void;
  options?: ICanvasOptions;
  width: number;
  height: number;
  create: boolean;
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
  onDispose,
  create,
}: IFabricCanvasProps) => {
  const canvasEl = useRef(null);
  const canvasElParent = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let canvas: fabric.Canvas | null = null;
    if (create) {
      canvas = new fabric.Canvas(canvasEl.current, options ?? {});
      console.log('canvas created');
      if (onReady) {
        onReady(canvas);
      }
    }

    return () => {
      if (canvas) {
        canvas.dispose();
        console.log('canvas disposed');
        if (onDispose) {
          onDispose();
        }
      }
    };
  }, [create]);
  return (
    <div
      ref={canvasElParent}
      style={{ width: 'fit-content', height: 'fit-content' }}
    >
      <canvas width={width} height={height} ref={canvasEl} />
    </div>
  );
};
