import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFacsimileRegion } from '@frontend/domain';
import {
  ITextEditingPageState,
  TextEditingAccessMode,
  TextEditingActiveWorkspace,
} from './models';
import {
  addDataBeforeChangeSetters,
  addDiscardReducers,
  addSaveReducers,
  addUpdateCollectors,
} from './extra-reducers';

const initialState: ITextEditingPageState = {
  accessMode: 'view',
  activeWorkspace: 'description',
  regionHoveredInToolSpace: null,
  regionHoveredInFacsimileSpace: null,
  selectedElementId: null,
  regionUnderEditPolygon: null,
  regionUnderEditUrl: null,
  pageInfoBeforeChange: {
    AdditionalCommentary: '',
    Body: '',
    CreatedAt: undefined,
    EditionProgress: '',
    Editor: '',
    FacsimileImageUrl: '',
    Foliation: '',
    Id: '',
    ManuscriptId: '',
    ManuscriptSiglum: '',
    Number: 0,
    Pagination: 0,
    PresentPageNumbering: [],
    Tags: [],
    TranscriptionFinalized: false,
    Version: undefined,
  },
  imageElementsBeforeChanges: [],
  linesBeforeChanges: [],
  textElementsBeforeChanges: [],
  tokensBeforeChanges: [],
  unitSummariesBeforeChanges: [],
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
    addDiscardReducers(builder);
    addSaveReducers(builder);
    addDataBeforeChangeSetters(builder);
    addUpdateCollectors(builder);
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
