import { fabric } from 'fabric';
import { letterMap } from '@frontend/util';
import { commonObjectOptions, unitNumberLineOffset } from './render';
import { MapPosition } from '@frontend/ui/editions';

export function addManuscripts(
  canvas: fabric.Canvas,
  headerSigla: fabric.Text[],
  position: MapPosition,
  manuscriptThickness: number,
  sigla: string[]
) {
  const isLeft = position.startsWith('left');
  sigla.forEach((siglum, index) => {
    const x1 = isLeft ? index * manuscriptThickness + unitNumberLineOffset : 0;
    const y1 = isLeft ? 0 : index * manuscriptThickness + unitNumberLineOffset;
    const x2 = isLeft ? x1 : canvas.getWidth();
    const y2 = isLeft ? canvas.getHeight() : y1;
    const points = isLeft
      ? [x1 + manuscriptThickness / 2, y1, x1 + manuscriptThickness / 2, y2]
      : [x1, y1 + manuscriptThickness / 2, x2, y2 + manuscriptThickness / 2];
    const columnLine = new fabric.Line(points, {
      ...commonObjectOptions,
      strokeWidth: 1,
      stroke: 'rgba(0,0,0, 0.3)',
    });
    canvas.add(columnLine);

    if (position !== 'left-XL') {
      const letter = new fabric.Text(letterMap[index], {
        ...commonObjectOptions,
        left: isLeft ? points[0] - 6 : x1,
        top: isLeft ? y1 : points[1] - 12,
        fontFamily: "'Noto Sans Display', sans-serif",
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        charSpacing: 10,
        fill: '#000000',
      });
      canvas.add(letter);
    }

    const siglumMark = new fabric.Text(siglum, {
      ...commonObjectOptions,
      left: points[0] === 0 ? 30 : points[0] + 7,
      top: position === 'left-XL' ? 0 : points[1] === 0 ? 30 : points[1] - 7,
      fontFamily: "'Noto Sans Display', sans-serif",
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'right',
      charSpacing: 100,
      fill: '#000000',
      opacity: 0.7,
      angle: isLeft ? 90 : 0,
    });
    siglumMark.bringToFront();
    headerSigla.push(siglumMark);
    canvas.add(siglumMark);
  });
}
