import { IMorphology } from './morphology';

export interface IToken {
  _id: string;
  RawToken: string;
  MorphemeType: string;
  SpaceFollows: boolean;
  OrderInLine: number;
  State: string;
  OrderInPage: number;
  MorphologyId: string;
  Morphology: IMorphology;
}
