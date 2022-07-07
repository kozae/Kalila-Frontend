import { FacsimileRegion } from './facsimile-region';

export interface IImageElement {
  Id: string;
  Position: string;
  FacsimileRegion: FacsimileRegion;
  HighlightColor?: string;
  Order: number;
}
