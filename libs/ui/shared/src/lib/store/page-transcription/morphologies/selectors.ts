import { RootState } from '@frontend/shared-ui';
import { morphologyAdapter } from './slice';

const selectMorphologiesState = (state: RootState) => state.morphologies;

export const { selectById: selectMorphologyByLineAndToken } =
  morphologyAdapter.getSelectors<RootState>(selectMorphologiesState);
