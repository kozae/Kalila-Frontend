import { fabric } from 'fabric';
import { IFacsimileRegion } from '@frontend/domain';

export interface IRegionEvents {
  onMouseOver: (region: IFacsimileRegion & { Id: string }) => void;
  onMouseOut: () => void;
}

export function addEventListeners(
  polygons: fabric.Polygon[],
  { onMouseOver, onMouseOut }: IRegionEvents
) {
  polygons.forEach((p) => {
    p.on('mouseover', (e) => {
      onMouseOver(p.data);
    });
    p.on('mouseout', (e) => {
      onMouseOut();
    });
  });
}
