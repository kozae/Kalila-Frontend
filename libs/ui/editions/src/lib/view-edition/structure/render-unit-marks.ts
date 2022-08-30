import { fabric } from 'fabric';
import {
  commonObjectOptions,
  siglumLineOffset,
  StructurePositions,
  unitNumberLineOffset,
} from './render';
import { IEvent } from 'fabric/fabric-impl';

export function addUnits(
  canvas: fabric.Canvas,
  position: StructurePositions,
  unitLineThickness: number,
  manuscriptThickness: number,
  unitMatrix: number[][],
  imageMatrix: number[][],
  sigla: string[],
  onRowClicked: (row: number) => void | Promise<void>,
  onRowHovered: (row: number, x: number, y: number) => void | Promise<void>
) {
  const isLeft = position.startsWith('left');
  const msLineHighlighter = new fabric.Rect({
    ...commonObjectOptions,
    visible: false,
    width: isLeft ? manuscriptThickness : canvas.getWidth(),
    height: isLeft ? canvas.getHeight() : manuscriptThickness,
    fill: 'rgb(255,103,0)',
    opacity: 0.2,
  });
  const unitLineHighlighter = new fabric.Rect({
    ...commonObjectOptions,
    visible: false,
    width: isLeft ? canvas.getWidth() : unitLineThickness,
    height: isLeft ? unitLineThickness : canvas.getHeight(),
    fill: 'rgb(255,103,0)',
    opacity: 0.2,
  });

  canvas.add(msLineHighlighter);
  canvas.add(unitLineHighlighter);
  const siglumMarkers = sigla.map(
    (siglum) =>
      new fabric.Text(siglum, {
        ...commonObjectOptions,
        visible: false,
        fontFamily: "'Noto Sans Display', sans-serif",
        fontSize: 14,
        textAlign: 'right',
        charSpacing: 100,
        fill: '#000000',
        opacity: 0.7,
        angle: isLeft ? 90 : 0,
      })
  );
  canvas.add(...siglumMarkers);
  unitMatrix.forEach((manuscriptUnitArray, manuscriptIndex) => {
    const distanceFromUnitNumber =
      unitNumberLineOffset + manuscriptIndex * manuscriptThickness;
    if (isLeft) {
      siglumMarkers[manuscriptIndex].set(
        'left',
        distanceFromUnitNumber + +manuscriptThickness / 2 + 7
      );
    } else {
      siglumMarkers[manuscriptIndex].set(
        'top',
        distanceFromUnitNumber + manuscriptThickness / 2 - 7
      );
    }
    manuscriptUnitArray.forEach((unitOrder, unitIndex) => {
      const distanceFromSiglum =
        siglumLineOffset + unitIndex * unitLineThickness;
      if (unitOrder !== -1) {
        const hasImage = imageMatrix[manuscriptIndex][unitIndex] !== 0;
        const unitMarker = new fabric.Rect({
          ...commonObjectOptions,
          evented: true,
          hoverCursor: 'pointer',
          height: isLeft ? unitLineThickness : manuscriptThickness,
          width: isLeft ? manuscriptThickness : unitLineThickness,
          fill:
            unitOrder !== unitIndex
              ? 'rgba(0,20,39, 0.5)'
              : 'rgba(74,110,21, 0.5)',
          top: isLeft ? distanceFromSiglum : distanceFromUnitNumber,
          stroke: hasImage ? 'rgba(0,0,0, 0.5)' : 'rgba(255,255,255, 0.5)',
          strokeWidth: hasImage ? 2 : 1,
          left: isLeft ? distanceFromUnitNumber : distanceFromSiglum,
        });
        canvas.add(unitMarker);
        unitMarker.on('mousedown', () => {
          onRowClicked(unitIndex * 2);
        });
        unitMarker.on('mouseover', ({ e }: IEvent<any>) => {
          onRowHovered(unitIndex, e.x, e.y);
          if (isLeft) {
            msLineHighlighter.set('left', distanceFromUnitNumber);
            unitLineHighlighter.set('top', distanceFromSiglum);
            siglumMarkers.forEach((m) => m.set('top', distanceFromSiglum));
          } else {
            msLineHighlighter.set('top', distanceFromUnitNumber);
            unitLineHighlighter.set('left', distanceFromSiglum);
            siglumMarkers.forEach((m) => m.set('left', distanceFromSiglum));
          }

          msLineHighlighter.set('visible', true);
          unitLineHighlighter.set('visible', true);
          if (unitIndex > 5) {
            siglumMarkers.forEach((m) => m.set('visible', true));
          }

          canvas.renderAll();
        });
        unitMarker.on('mouseout', () => {
          onRowHovered(-1, 0, 0);
          msLineHighlighter.set('visible', false);
          unitLineHighlighter.set('visible', false);
          siglumMarkers.forEach((m) => m.set('visible', false));
          canvas.renderAll();
        });
      }
    });
  });
}
