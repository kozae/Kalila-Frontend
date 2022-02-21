import { createSelector } from '@reduxjs/toolkit';
import { selectAllImageElementsRegions } from './image-elements/selectors';
import { selectAllTextElementsRegions } from './text-elements/selectors';
import { selectAllLinesRegions } from './lines';

export const selectLayoutRegions = createSelector(
  selectAllTextElementsRegions,
  selectAllImageElementsRegions,
  (te, ie) => [...te, ...ie]
);

export const selectRegions = (group: 'layout' | 'lines' | undefined) =>
  createSelector(selectLayoutRegions, selectAllLinesRegions, (layout, lines) =>
    group === 'layout' ? layout : group === 'lines' ? lines : []
  );
