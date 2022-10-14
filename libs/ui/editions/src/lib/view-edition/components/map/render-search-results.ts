import {
  getManuscriptThickness,
  getUnitBoxMarkerOptions,
  getUnitRowMarkerOptions,
  getUnitThickness,
} from './render-helpers';
import { fabric } from 'fabric';
import { MapPosition } from '@frontend/ui/editions';

export function renderSearchResults(
  canvas: fabric.Canvas,
  headerSigla: fabric.Text[],
  searchResults: [number, number, number][],
  position: MapPosition,
  NoUnits: number,
  NoSigla: number,
  searchResultsMarkers: fabric.Rect[]
) {
  const unitLineThickness = getUnitThickness(canvas, position, NoUnits);
  // @ts-ignore
  if (searchResults.every((r: any) => r[1] === -1)) {
    console.log('Highlighting row only');
    searchResults.forEach((r) => {
      const options = getUnitRowMarkerOptions(
        canvas,
        position,
        r[0],
        position.endsWith('XL') ? unitLineThickness / 4 : unitLineThickness
      );
      searchResultsMarkers.push(new fabric.Rect(options));
    });
    // @ts-ignore
  } else if (searchResults.every((r: any) => r[1] !== -1)) {
    const manuscriptThickness = getManuscriptThickness(
      canvas,
      position,
      NoSigla
    );
    searchResults.forEach((r) => {
      const options = getUnitBoxMarkerOptions(
        canvas,
        position,
        r[0],
        r[1],
        position.endsWith('XL') ? unitLineThickness / 4 : unitLineThickness,
        manuscriptThickness
      );
      searchResultsMarkers.push(new fabric.Rect(options));
    });
  }
  canvas.add(...searchResultsMarkers);
  searchResultsMarkers.forEach((box) => box.bringToFront());
  headerSigla.forEach((box) => box.bringToFront());
  canvas.renderAll();
}
