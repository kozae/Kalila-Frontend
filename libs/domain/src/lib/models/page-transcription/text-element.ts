import { FacsimileRegion } from './facsimile-region';
import { ILine } from './line';

export interface ITextElement {
  Id: string;
  Position: string;
  Order: number;
  FacsimileRegion: FacsimileRegion;
  HighlightColor?: string;
  Lines: ILine[];
}
