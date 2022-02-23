import { IFacsimileRegion } from './facsimile-region';
import { ILine } from './line';

export interface ITextElement {
  _id: string;
  Position: string;
  Order: number;
  FacsimileRegion: IFacsimileRegion;
  HighlightColor?: string;
  Lines: ILine[];
}
