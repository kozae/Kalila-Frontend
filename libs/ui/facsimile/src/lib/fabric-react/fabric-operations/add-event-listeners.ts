import { fabric } from 'fabric';
import { FacsimileRegion } from '@frontend/domain';
import { IEvent } from 'fabric/fabric-impl';

export interface IRegionEvents {
  onMouseOver: (
    region: { Region: FacsimileRegion; Id: string },
    e: IEvent
  ) => void;
  onMouseOut: (e: IEvent) => void;
  onClicked: (
    id: string,
    region: { Region: FacsimileRegion; Id: string }
  ) => void;
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
      onClicked(p.data.Id, p.data);
    });
  });
}
