import { IMorphology } from './morphology';

export type TokenState =
  | 'sound'
  | 'corrupt'
  | 'emended'
  | 'unintelligible'
  | 'dittography'
  | 'dittography_begin'
  | 'dittography_end'
  | 'cross-out'
  | 'cross-out_begin'
  | 'cross-out_end'
  | 'suppletion'
  | 'suppletion_begin'
  | 'suppletion_end'
  | 'added'
  | 'added_begin'
  | 'added_end';

export interface IToken {
  Id: string;
  RawToken: string;
  MorphemeType: string;
  SpaceFollows: boolean;
  OrderInLine: number;
  State: string | TokenState;
  OrderInPage: number;
  MorphologyId?: string;
  Morphology?: IMorphology;
}
