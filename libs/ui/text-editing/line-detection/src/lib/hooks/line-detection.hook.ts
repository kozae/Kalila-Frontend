import { FacsimileRegion, ILine, IPoint } from '@frontend/domain';
import { chunk } from 'lodash';
import * as uuid from 'uuid';
import { highlightColors, PolygonHelper } from '@frontend/ui/facsimile';

export function detectLines(
  Id: string,
  region: FacsimileRegion,
  detector: any,
  threshold: number,
  density: number
) {
  const lines: (Omit<ILine, 'Tokens'> & { ElementId: string })[] = [];
  const line_regions = detector.detect_lines_in_region(
    new Uint32Array(region),
    threshold,
    density
  ) as number[];
  const points = [
    { X: region[0], Y: region[1] },
    { X: region[2], Y: region[3] },
    { X: region[4], Y: region[5] },
    { X: region[6], Y: region[7] },
  ] as IPoint[];

  chunk(line_regions, 4).forEach((lineRegion) => {
    lines.push({
      Id: 'generated_' + uuid.v4(),
      LineOrder: lines.length,
      ElementId: Id,
      HighlightColor: highlightColors[lines.length % 13],
      FacsimileRegion: PolygonHelper.getSubRegion(points, region[8], {
        top: lineRegion[0],
        left: lineRegion[1],
        width: lineRegion[2],
        height: lineRegion[3],
      }),
    });
  });

  return lines;
}

export function transformKrakenLines(
  Id: string,
  region: FacsimileRegion,
  lineRegions: number[][]
) {
  const lines: (Omit<ILine, 'Tokens'> & { ElementId: string })[] = [];

  const points = [
    { X: region[0], Y: region[1] },
    { X: region[2], Y: region[3] },
    { X: region[4], Y: region[5] },
    { X: region[6], Y: region[7] },
  ] as IPoint[];

  lineRegions.forEach((lineRegion) => {
    lines.push({
      Id: 'generated_' + uuid.v4(),
      LineOrder: lines.length,
      ElementId: Id,
      HighlightColor: highlightColors[lines.length % 13],
      FacsimileRegion: PolygonHelper.getSubRegion(points, region[8], {
        top: lineRegion[0],
        left: lineRegion[1],
        width: lineRegion[2] - lineRegion[0],
        height: lineRegion[3] - lineRegion[1],
      }),
    });
  });

  return lines;
}
