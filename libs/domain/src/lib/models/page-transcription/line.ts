import { IFacsimileRegion } from './facsimile-region';
import { IToken } from './token';

export interface ILine {
  _id: string;
  LineOrder: number;
  FacsimileRegion: IFacsimileRegion;
  LineText?: string;
  Locked?: boolean;
  HighlightColor?: string;
  Tokens: IToken[];
}
