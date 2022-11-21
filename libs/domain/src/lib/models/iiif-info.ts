export interface Size {
  width: number;
  height: number;
}

export interface Tile {
  width: number;
  height: number;
  scaleFactors: number[];
}

export interface IIIFInfo {
  context?: string;
  id?: string;
  protocol?: string;
  width: number;
  height: number;
  sizes?: Size[];
  tiles?: Tile[];
  profile?: any[];
}
