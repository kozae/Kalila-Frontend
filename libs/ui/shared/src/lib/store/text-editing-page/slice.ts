import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  IFacsimileRegion,
  IImageElement,
  ITextElement,
} from '@frontend/domain';
import {
  ITextEditingPageState,
  TextEditingAccessMode,
  TextEditingActiveWorkspace,
} from './models';
import { Update } from '@reduxjs/toolkit/src/entities/models';

const initialState: ITextEditingPageState = {
  accessMode: 'view',
  activeWorkspace: 'description',
  regionHoveredInToolSpace: null,
  regionHoveredInFacsimileSpace: null,
  selectedElementId: null,
  regionUnderEditPolygon: null,
  regionUnderEditUrl: null,
  deleteLayoutImages: [],
  deleteLayoutTextElements: [],
  deleteLines: [],
  postLayoutImages: [],
  postLayoutTextElements: [],
  postLines: [],
  postTokens: [],
  putImages: [],
  putLines: [],
  putTextElements: [],
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
    onElementSelected: (
      state,
      action: PayloadAction<{
        id: string | null;
        region: IFacsimileRegion | null;
      }>
    ) => {
      state.selectedElementId = action.payload.id;
      state.regionUnderEditPolygon = action.payload.region;
      if (action.payload.id === null) {
        state.regionUnderEditPolygon = null;
        state.regionUnderEditUrl = null;
      }
    },
    setRegionUnderEditPolygon: (
      state,
      action: PayloadAction<IFacsimileRegion>
    ) => {
      state.regionUnderEditPolygon = action.payload;
    },
    setRegionUnderEditUrl: (state, action: PayloadAction<string | null>) => {
      state.regionUnderEditUrl = action.payload;
    },
    clearTextEditingPageStore: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => action.type === 'textElements/addTextElement',
      (state, action: PayloadAction<ITextElement>) => {
        state.postLayoutTextElements.push(action.payload._id);
      }
    );
    builder.addMatcher(
      (action) => action.type === 'textElements/updateTextElement',
      (state, action: PayloadAction<Update<ITextElement>>) => {
        const id = action.payload.id as string;
        if (id.length === 24) {
          // mongo object id, i.e. existing item
          if (!state.putTextElements.includes(id)) {
            state.putTextElements.push(id);
          }
        }
      }
    );
    builder.addMatcher(
      (action) => action.type === 'textElements/addImageElement',
      (state, action: PayloadAction<IImageElement>) => {
        state.postLayoutImages.push(action.payload._id);
      }
    );
    builder.addMatcher(
      (action) => action.type === 'textElements/updateImageElement',
      (state, action: PayloadAction<Update<IImageElement>>) => {
        const id = action.payload.id as string;
        if (id.length === 24) {
          // mongo object id, i.e. existing item
          if (!state.putImages.includes(id)) {
            state.putImages.push(id);
          }
        }
      }
    );
  },
});

export const {
  setTextEditingAccessMode,
  setTextEditingWorkspace,
  onRegionHoveredInToolSpace,
  onRegionHoveredInFacsimileSpace,
  onElementSelected,
  setRegionUnderEditUrl,
  setRegionUnderEditPolygon,
  clearTextEditingPageStore,
} = textEditingPageSlice.actions;
