import { fabric } from 'fabric';
import {
  commonObjectOptions,
  siglumLineOffset,
  StructurePositions,
} from './render';

export function addUnitNumbers(
  canvas: fabric.Canvas,
  position: StructurePositions,
  unitLineThickness: number,
  NoUnits: number
) {
  const isLeft = position.startsWith('left');
  Array(NoUnits)
    .fill(0)
    .forEach((_, index) => {
      const left = isLeft
        ? 0
        : siglumLineOffset + index * unitLineThickness + unitLineThickness / 2;
      const top = isLeft
        ? siglumLineOffset + index * unitLineThickness + unitLineThickness / 2
        : 0;

      if (index !== 0 && index % 10 === 0) {
        const unitNumber = new fabric.Text(`${index}`, {
          ...commonObjectOptions,
          left: left === 0 ? 2 : left - 6,
          top: top === 0 ? 2 : top - 6,
          fontFamily: "'Noto Sans Display', sans-serif",
          fontSize: 12,
          fontWeight: 'bold',
          textAlign: 'center',
          fill: '#000000',
        });
        canvas.add(unitNumber);
      }
    });
}
