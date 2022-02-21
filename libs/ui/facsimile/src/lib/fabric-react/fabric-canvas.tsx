import React, { CSSProperties, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { ICanvasOptions } from 'fabric/fabric-impl';

export interface Props {
  style?: CSSProperties;
  onReady?: (canvas: fabric.Canvas) => void;
  options?: ICanvasOptions;
  width: number;
  height: number;
}

/**
 * Fabric canvas as component
 */
const FabricCanvas = ({ style, options, width, height, onReady }: Props) => {
  const canvasEl = useRef(null);
  const canvasElParent = useRef<HTMLDivElement>(null);
  useEffect(() => {
    console.log('creating canvas');
    const canvas = new fabric.Canvas(canvasEl.current, options ?? {});

    if (onReady) {
      onReady(canvas);
    }

    return () => {
      canvas.dispose();
      console.log('canvas disposed');
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
