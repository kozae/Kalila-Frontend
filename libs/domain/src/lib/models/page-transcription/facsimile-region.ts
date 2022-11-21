export interface IPoint {
  X: number;
  Y: number;
}

export type Polygon = [IPoint, IPoint, IPoint, IPoint];

export function pointToSmallXAndY(
  points: { X?: number; Y?: number; x?: number; y?: number }[]
) {
  return points.map(({ X, Y, x, y }) => ({ x: X ?? x, y: Y ?? x }));
}

export type FacsimileRegion = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

export const NULL_REGION: FacsimileRegion = [
  -1, -1, -1, -1, -1, -1, -1, -1, -1,
];
