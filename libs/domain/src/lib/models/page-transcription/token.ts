import { IMorphology } from './morphology';

export type TokenState =
  | 'sound'
  | 'corrupt'
  | 'emended'
  | 'illegible'
  | 'dittography'
  | 'dittography_begin'
  | 'dittography_in_range'
  | 'dittography_end'
  | 'cross-out'
  | 'cross-out_begin'
  | 'cross-out_in_range'
  | 'cross-out_end'
  | 'suppletion'
  | 'suppletion_begin'
  | 'suppletion_in_range'
  | 'suppletion_end'
  | 'added'
  | 'added_begin'
  | 'added_in_range'
  | 'added_end';

export interface IToken {
  _id: string;
  RawToken: string;
  MorphemeType: string;
  SpaceFollows: boolean;
  OrderInLine: number;
  State: string | TokenState;
  OrderInPage: number;
  MorphologyId: string;
  Morphology: IMorphology;
}
