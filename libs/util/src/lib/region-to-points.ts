import { FacsimileRegion, IPoint } from '@frontend/domain';

export function regionToPoints(region: FacsimileRegion) {
  return [
    { X: region[0], Y: region[1] },
    { X: region[2], Y: region[3] },
    { X: region[4], Y: region[5] },
    { X: region[6], Y: region[7] },
  ] as IPoint[];
}
