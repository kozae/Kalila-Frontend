import { fabric } from 'fabric';
import { IObjectOptions } from 'fabric/fabric-impl';
import {
  getManuscriptThickness,
  getPositionMarkerOptions,
  getUnitThickness,
} from './render-helpers';
import { addManuscripts } from './render-manuscripts';
import { addUnitNumbers } from './render-unit-numbers';
import { addUnits } from './render-unit-marks';
import { MapPosition } from '@frontend/ui/editions';

export const siglumLineOffset = 30;
export const unitNumberLineOffset = 20;
export const commonObjectOptions: IObjectOptions = {
  hasControls: false,
  selectable: false,
  evented: false,
  hoverCursor: 'default',
};

export interface IMapData {
  position: MapPosition;
  sigla: string[];
  NoUnits: number;
  unitMatrix: number[][];
  imageMatrix: number[][];
  currentRow: number;
}

export interface IMapEvents {
  onRowClicked: (row: number) => void | Promise<void>;
  onRowHovered: (row: number, x: number, y: number) => void | Promise<void>;
}

export function render(
  canvas: fabric.Canvas,
  positionMarker: fabric.Rect,
  headerSigla: fabric.Text[],
  {
    sigla,
    NoUnits,
    unitMatrix,
    position,
    currentRow,
    onRowClicked,
    onRowHovered,
    imageMatrix,
  }: IMapData & IMapEvents
) {
  canvas.clear();
  headerSigla.splice(0, headerSigla.length);
  const manuscriptThickness = getManuscriptThickness(
    canvas,
    position,
    sigla.length
  );
  const unitLineThickness = getUnitThickness(canvas, position, NoUnits);
  if (position === 'left-XL') {
    canvas.setHeight(NoUnits * unitLineThickness + siglumLineOffset);
  }

  addUnitNumbers(canvas, position, unitLineThickness, NoUnits);
  addUnits(
    canvas,
    position,
    unitLineThickness,
    manuscriptThickness,
    unitMatrix,
    imageMatrix,
    sigla,
    onRowClicked,
    onRowHovered
  );
  positionMarker.set(
    getPositionMarkerOptions(canvas, position, currentRow, unitLineThickness)
  );
  addManuscripts(canvas, headerSigla, position, manuscriptThickness, sigla);
  canvas.add(positionMarker);
  canvas.setBackgroundColor(
    'rgba(255, 255, 255, 1)',
    canvas.renderAll.bind(canvas)
  );
}
