import {
  createSlice,
  isFulfilled,
  isPending,
  PayloadAction,
} from '@reduxjs/toolkit';
import { IFacsimileRegion } from '@frontend/domain';
import {
  ITextEditingPageState,
  TextEditingAccessMode,
  TextEditingActiveWorkspace,
  TextEditingToolMode,
} from './models';
import {
  addDataBeforeChangeSetters,
  addDiscardReducers,
  addSaveReducers,
  addUpdateCollectors,
} from './extra-reducers';
import {
  saveLayoutChanges,
  saveLineChanges,
  saveSegmentation,
  saveTokenChanges,
} from './thunks';

const savePending = isPending(
  saveLineChanges,
  saveLayoutChanges,
  saveTokenChanges,
  saveSegmentation
);
const saveComplete = isFulfilled(
  saveLineChanges,
  saveLayoutChanges,
  saveTokenChanges,
  saveSegmentation
);

const initialState: ITextEditingPageState = {
  accessMode: 'view',
  activeWorkspace: 'description',
  toolMode: 'default',
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
  textSegmentationTouched: false,
  imageElementsBeforeChanges: [],
  linesBeforeChanges: [],
  textElementsBeforeChanges: [],
  tokensBeforeChanges: [],
  unitSummariesBeforeChanges: [],
  deleteLayoutImages: [],
  deleteLayoutTextElements: [],
  deleteLines: [],
  moveLines: {},
  postLayoutImages: [],
  postLayoutTextElements: [],
  postLines: [],
  postTokens: [],
  putImages: [],
  putLines: [],
  putTextElements: [],
  saving: false,
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
    setTextEditingToolMode: (
      state,
      action: PayloadAction<TextEditingToolMode>
    ) => {
      state.toolMode = action.payload;
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
    clearTextEditingPageStore: () => initialState,
  },
  extraReducers: (builder) => {
    addDiscardReducers(builder);
    addSaveReducers(builder);
    addDataBeforeChangeSetters(builder);
    addUpdateCollectors(builder);
    builder.addMatcher(savePending, (state) => {
      state.saving = true;
    });
    builder.addMatcher(saveComplete, (state) => {
      state.saving = false;
    });
  },
});

export const {
  setTextEditingAccessMode,
  setTextEditingWorkspace,
  setTextEditingToolMode,
  onRegionHoveredInToolSpace,
  onRegionHoveredInFacsimileSpace,
  onElementSelected,
  setRegionUnderEditUrl,
  setRegionUnderEditPolygon,
  clearTextEditingPageStore,
} = textEditingPageSlice.actions;
