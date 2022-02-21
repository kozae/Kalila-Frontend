export interface IPoint {
  X: number;
  Y: number;
}

export interface IFacsimileRegion {
  Rotation: number;
  Points: IPoint[];
}
export type Polygon = [IPoint, IPoint, IPoint, IPoint];
