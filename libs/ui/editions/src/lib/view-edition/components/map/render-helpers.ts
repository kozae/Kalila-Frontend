import {
  commonObjectOptions,
  siglumLineOffset,
  unitNumberLineOffset,
} from './render';
import { fabric } from 'fabric';
import { IRectOptions } from 'fabric/fabric-impl';
import { MapPosition } from '@frontend/ui/editions';

export const getManuscriptThickness = (
  canvas: fabric.Canvas,
  state: MapPosition,
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
  state: MapPosition,
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
  state: MapPosition,
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
    excludeFromExport: true,
    fill: 'rgba(255,103,0, 0.2)',
    stroke: 'rgb(255,103,0)',
    strokeWidth: 1,
  };
};

export const getUnitRowMarkerOptions = (
  canvas: fabric.Canvas,
  state: MapPosition,
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
    fill: 'rgba(241,231,64, 0.4)',
  };
};

export const getUnitBoxMarkerOptions = (
  canvas: fabric.Canvas,
  state: MapPosition,
  unitIdx: number,
  manuscriptIdx: number,
  unitThickness: number,
  manuscriptThickness: number
): IRectOptions => {
  const distanceFromSiglum = siglumLineOffset + unitIdx * unitThickness;
  const distanceFromUnitNumber =
    unitNumberLineOffset + manuscriptIdx * manuscriptThickness;
  let width, height, top, left;
  switch (state) {
    case 'bottom':
      height = manuscriptThickness;
      width = unitThickness + 2;
      top = distanceFromUnitNumber;
      left = distanceFromSiglum - 1;
      break;
    case 'left':
    case 'left-XL':
    default:
      width = manuscriptThickness;
      height = unitThickness + 2;
      left = distanceFromUnitNumber;
      top = distanceFromSiglum - 1;
      break;
  }
  return {
    ...commonObjectOptions,
    height,
    width,
    top,
    left,
    stroke: 'rgba(255,255,255, 0.5)',
    strokeWidth: 1,
    fill: 'rgba(241,231,64, 0.8)',
  };
};
