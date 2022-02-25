import { fabric } from 'fabric';
import { IFacsimileRegion } from '@frontend/domain';
import { IEvent } from 'fabric/fabric-impl';

export interface IRegionEvents {
  onMouseOver: (region: IFacsimileRegion & { Id: string }, e: IEvent) => void;
  onMouseOut: (e: IEvent) => void;
  onClicked: (id: string, e: IEvent) => void;
}

export function addEventListeners(
  polygons: fabric.Polygon[],
  { onMouseOver, onMouseOut, onClicked }: IRegionEvents
) {
  polygons.forEach((p) => {
    p.on('mouseover', (e) => {
      onMouseOver(p.data, e);
    });
    p.on('mouseout', (e) => {
      onMouseOut(e);
    });
    p.on('mousedown', (e) => {
      onClicked(p.data.Id, e);
    });
  });
}
