export interface IPoint {
  X: number;
  Y: number;
}

export interface IFacsimileRegion {
  Rotation: number;
  Points: IPoint[];
}

export type Polygon = [IPoint, IPoint, IPoint, IPoint];

export function pointToSmallXAndY(
  points: { X?: number; Y?: number; x?: number; y?: number }[]
) {
  return points.map(({ X, Y, x, y }) => ({ x: X ?? x, y: Y ?? x }));
}
