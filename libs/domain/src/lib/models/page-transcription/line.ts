import { FacsimileRegion } from './facsimile-region';
import { IToken } from './token';

export interface ILine {
  Id: string;
  LineOrder: number;
  FacsimileRegion: FacsimileRegion;
  LineText?: string;
  Locked?: boolean;
  HighlightColor?: string;
  Tokens: IToken[];
}
