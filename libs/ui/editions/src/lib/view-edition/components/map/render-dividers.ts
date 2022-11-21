import { fabric } from 'fabric';
import { MapPosition } from '@frontend/ui/editions';
import {
  commonObjectOptions,
  siglumLineOffset,
  unitNumberLineOffset,
} from './render';
import { IEvent } from 'fabric/fabric-impl';

export function renderDividers(
  canvas: fabric.Canvas,
  position: MapPosition,
  unitLineThickness: number,
  dividers: number[],
  onRowClicked: (row: number) => void | Promise<void>,
  onRowHovered: (row: number, x: number, y: number) => void | Promise<void>
) {
  const isLeft = position.startsWith('left');
  const unitLineHighlighter = new fabric.Rect({
    ...commonObjectOptions,
    visible: false,
    width: isLeft ? canvas.getWidth() : unitLineThickness,
    height: isLeft ? unitLineThickness : canvas.getHeight(),
    fill: 'rgb(255,103,0)',
    opacity: 0.2,
  });
  canvas.add(unitLineHighlighter);
  dividers.forEach((unitIndex) => {
    const distanceFromSiglum = siglumLineOffset + unitIndex * unitLineThickness;
    const dividerMarker = new fabric.Rect({
      ...commonObjectOptions,
      evented: true,
      hoverCursor: 'pointer',
      height: isLeft ? unitLineThickness : canvas.getHeight(),
      width: isLeft ? canvas.getWidth() : unitLineThickness,
      fill: 'rgba(74,110,21, 1)',
      top: isLeft ? distanceFromSiglum : 0,
      left: isLeft ? 0 : distanceFromSiglum,
    });
    canvas.add(dividerMarker);
    dividerMarker.moveTo(10);
    dividerMarker.on('mousedown', () => {
      onRowClicked(unitIndex * 2);
    });

    dividerMarker.on('mouseover', ({ e }: IEvent<any>) => {
      onRowHovered(unitIndex, e.x, e.y);
      if (isLeft) {
        unitLineHighlighter.set('top', distanceFromSiglum);
      } else {
        unitLineHighlighter.set('left', distanceFromSiglum);
      }
      unitLineHighlighter.set('visible', true);
      canvas.renderAll();
    });

    dividerMarker.on('mouseout', () => {
      onRowHovered(-1, 0, 0);
      unitLineHighlighter.set('visible', false);
      canvas.renderAll();
    });
  });
}
