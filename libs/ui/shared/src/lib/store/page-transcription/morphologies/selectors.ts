import { morphologyAdapter, MorphologyState } from './slice';

const selectMorphologiesState = (state: MorphologyState) => state.morphologies;

export const { selectById: selectMorphologyByLineAndToken } =
  morphologyAdapter.getSelectors<MorphologyState>(selectMorphologiesState);
