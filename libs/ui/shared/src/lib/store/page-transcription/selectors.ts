import { createSelector } from '@reduxjs/toolkit';
import { selectAllImageElementsRegions } from './image-elements';
import { selectAllTextElementsRegions } from './text-elements';
import { selectAllLinesRegions } from './lines';
import { IFacsimileRegion } from '@frontend/domain';
import { TextEditingActiveWorkspace } from '../text-editing-page';

export const selectLayoutRegions = createSelector(
  selectAllTextElementsRegions,
  selectAllImageElementsRegions,
  (te, ie) => [...te, ...ie]
);

const spaceToGroupMap: Record<
  TextEditingActiveWorkspace,
  'layout' | 'lines' | undefined
> = {
  description: undefined,
  segmentation: undefined,
  layout: 'layout',
  lines: 'lines',
  transcription: 'lines',
};

export const selectRegions = createSelector(
  [
    selectLayoutRegions,
    selectAllLinesRegions,
    (state, activeWorkspace: TextEditingActiveWorkspace) => activeWorkspace,
  ],
  (layout, lines, activeWorkspace) => {
    const group = spaceToGroupMap[activeWorkspace];
    const data =
      group === 'layout'
        ? (layout.filter((_) => _.Points !== undefined) as Array<
            IFacsimileRegion & {
              Id: string;
              HighlightColor: string | undefined;
            }
          >)
        : group === 'lines'
        ? (lines.filter((_) => _.Points !== undefined) as Array<
            IFacsimileRegion & {
              Id: string;
              HighlightColor: string | undefined;
            }
          >)
        : [];

    return { data, activeWorkspace };
  }
);
