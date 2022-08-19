import {
  commonObjectOptions,
  siglumLineOffset,
  StructurePositions,
  unitNumberLineOffset,
} from './render';
import { fabric } from 'fabric';
import { IRectOptions } from 'fabric/fabric-impl';

export const getManuscriptThickness = (
  canvas: fabric.Canvas,
  state: StructurePositions,
  NrSigla: number
) => {
  switch (state) {
    case 'left':
    case 'left-XL':
      return Math.round((canvas.getWidth() - unitNumberLineOffset) / NrSigla);
    case 'bottom':
    default:
      return Math.round((canvas.getHeight() - unitNumberLineOffset) / NrSigla);
  }
};

export const getUnitThickness = (
  canvas: fabric.Canvas,
  state: StructurePositions,
  NrUnits: number
) => {
  switch (state) {
    case 'left':
      return (canvas.getHeight() - siglumLineOffset) / NrUnits;
    case 'left-XL':
      return (4 * (canvas.getHeight() - siglumLineOffset)) / NrUnits;
    case 'bottom':
    default:
      return (canvas.getWidth() - siglumLineOffset) / NrUnits;
  }
};

export const getPositionMarkerOptions = (
  canvas: fabric.Canvas,
  state: StructurePositions,
  currentRow: number,
  unitThickness: number
): IRectOptions => {
  let width, height, top, left;
  switch (state) {
    case 'bottom':
      height = canvas.getHeight();
      width = unitThickness + 2;
      top = 0;
      left = siglumLineOffset + currentRow * unitThickness - 1;
      break;
    case 'left':
    case 'left-XL':
    default:
      width = canvas.getWidth();
      height = unitThickness + 2;
      left = 0;
      top = siglumLineOffset + currentRow * unitThickness - 1;
      break;
  }
  return {
    ...commonObjectOptions,
    height,
    width,
    top,
    left,
    fill: 'rgba(255,103,0, 0.2)',
    stroke: 'rgb(255,103,0)',
    strokeWidth: 1,
  };
};
