import { IFacsimileRegion } from './facsimile-region';

export interface IImageElement {
  Id: string;
  Position: string;
  FacsimileRegion?: IFacsimileRegion;
  HighlightColor?: string;
  Order: number;
}
