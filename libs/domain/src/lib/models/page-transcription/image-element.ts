import { IFacsimileRegion } from './facsimile-region';

export interface IImageElement {
  _id: string;
  Position: string;
  FacsimileRegion?: IFacsimileRegion;
  HighlightColor?: string;
}
