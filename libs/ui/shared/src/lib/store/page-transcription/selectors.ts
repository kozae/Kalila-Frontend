import { createSelector } from '@reduxjs/toolkit';
import { selectAllImageElementsRegions } from './image-elements';
import { selectAllTextElementsRegions } from './text-elements';
import { selectAllLinesRegions } from './lines';
import { IFacsimileRegion } from '@frontend/domain';

export const selectLayoutRegions = createSelector(
  selectAllTextElementsRegions,
  selectAllImageElementsRegions,
  (te, ie) => [...te, ...ie]
);

export const selectRegions = (group: 'layout' | 'lines' | undefined) =>
  createSelector(selectLayoutRegions, selectAllLinesRegions, (layout, lines) =>
    group === 'layout'
      ? (layout.filter((_) => _.Points !== undefined) as Array<
          IFacsimileRegion & { Id: string; HighlightColor: string | undefined }
        >)
      : group === 'lines'
      ? (lines.filter((_) => _.Points !== undefined) as Array<
          IFacsimileRegion & { Id: string; HighlightColor: string | undefined }
        >)
      : []
  );
