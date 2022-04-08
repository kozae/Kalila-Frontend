import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { IMorphology } from '@frontend/domain';

export const morphologyAdapter = createEntityAdapter<
  Partial<IMorphology> & { LineId: string; TokenOrder: number }
>({
  selectId: (m) => `${m.LineId}_${m.TokenOrder}`,
});

const initialState = morphologyAdapter.getInitialState();

export const morphologySlice = createSlice({
  name: 'morphologies',
  initialState,
  reducers: {
    loadMorphologies: morphologyAdapter.setAll,
    upsertTokenMorphology: morphologyAdapter.upsertOne,
    clearMorphologies: morphologyAdapter.removeAll,
  },
});

export const { loadMorphologies, clearMorphologies, upsertTokenMorphology } =
  morphologySlice.actions;
