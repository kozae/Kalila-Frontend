import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFacsimileRegion } from '@frontend/domain';

export type TextEditingActiveWorkspace =
  | 'description'
  | 'transcription'
  | 'layout'
  | 'lines'
  | 'segmentation';

export type TextEditingAccessMode = 'view' | 'edit';

interface ITextEditingPageState {
  accessMode: TextEditingAccessMode;
  activeWorkspace: TextEditingActiveWorkspace;
  regionHoveredInToolSpace: (IFacsimileRegion & { Id: string }) | null;
  regionHoveredInFacsimileSpace: (IFacsimileRegion & { Id: string }) | null;
  selectedElementId: string | null;
  regionUnderEditUrl: string | null;
  imageDisplayHeight: number;
  imageDisplayWidth: number;
  scaleRatio: number;
}

const initialState: ITextEditingPageState = {
  accessMode: 'view',
  activeWorkspace: 'description',
  regionHoveredInToolSpace: null,
  regionHoveredInFacsimileSpace: null,
  selectedElementId: null,
  regionUnderEditUrl: null,
  imageDisplayHeight: 1,
  imageDisplayWidth: 1,
  scaleRatio: 1,
};

export const textEditingPageSlice = createSlice({
  name: 'textEditingPageState',
  initialState,
  reducers: {
    setTextEditingAccessMode: (
      state,
      action: PayloadAction<TextEditingAccessMode>
    ) => {
      state.accessMode = action.payload;
    },
    setTextEditingWorkspace: (
      state,
      action: PayloadAction<TextEditingActiveWorkspace>
    ) => {
      state.activeWorkspace = action.payload;
    },
    onRegionHoveredInToolSpace: (
      state,
      action: PayloadAction<(IFacsimileRegion & { Id: string }) | null>
    ) => {
      state.regionHoveredInToolSpace = action.payload;
    },
    onRegionHoveredInFacsimileSpace: (
      state,
      action: PayloadAction<(IFacsimileRegion & { Id: string }) | null>
    ) => {
      state.regionHoveredInFacsimileSpace = action.payload;
    },
    onElementSelected: (state, action: PayloadAction<string | null>) => {
      state.selectedElementId = action.payload;
    },
    setRegionUnderEditUrl: (state, action: PayloadAction<string | null>) => {
      state.regionUnderEditUrl = action.payload;
    },
    textEditingPageState: (state) => {
      state = initialState;
    },
    setImageDimensions: (
      state,
      action: PayloadAction<{
        imageDisplayHeight: number;
        imageDisplayWidth: number;
        scaleRatio: number;
      }>
    ) => {
      state.imageDisplayHeight = action.payload.imageDisplayHeight;
      state.imageDisplayWidth = action.payload.imageDisplayWidth;
      state.scaleRatio = action.payload.scaleRatio;
    },
  },
});

export const {
  setTextEditingAccessMode,
  setTextEditingWorkspace,
  onRegionHoveredInToolSpace,
  onRegionHoveredInFacsimileSpace,
  onElementSelected,
  setRegionUnderEditUrl,
  textEditingPageState,
  setImageDimensions,
} = textEditingPageSlice.actions;
