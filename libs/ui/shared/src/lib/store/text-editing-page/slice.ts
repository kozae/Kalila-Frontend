import {
  createSlice,
  isFulfilled,
  isPending,
  PayloadAction,
} from '@reduxjs/toolkit';
import { FacsimileRegion } from '@frontend/domain';
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
  saveDescriptionChanges,
  saveLayoutChanges,
  saveLineChanges,
  saveSegmentation,
  saveTokenChanges,
} from './thunks';

const savePending = isPending(
  saveLineChanges,
  saveLayoutChanges,
  saveTokenChanges,
  saveSegmentation,
  saveDescriptionChanges
);
const saveComplete = isFulfilled(
  saveLineChanges,
  saveLayoutChanges,
  saveTokenChanges,
  saveSegmentation,
  saveDescriptionChanges
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
  textSegmentationTouched: false,
  deleteLacunae: [],
  imageElementsBeforeChanges: [],
  linesBeforeChanges: [],
  textElementsBeforeChanges: [],
  tokensBeforeChanges: [],
  unitSummariesBeforeChanges: [],
  nearestOpenUnitBeforeChanges: null,
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
      action: PayloadAction<{ Region: FacsimileRegion; Id: string } | null>
    ) => {
      state.regionHoveredInToolSpace = action.payload;
    },
    onRegionHoveredInFacsimileSpace: (
      state,
      action: PayloadAction<{ Region: FacsimileRegion; Id: string } | null>
    ) => {
      state.regionHoveredInFacsimileSpace = action.payload;
    },
    onElementSelected: (
      state,
      action: PayloadAction<{
        Id: string | null;
        Region: FacsimileRegion | null;
      }>
    ) => {
      state.selectedElementId = action.payload.Id;
      state.regionUnderEditPolygon = action.payload.Region;
      if (action.payload.Id === null) {
        state.regionUnderEditPolygon = null;
        state.regionUnderEditUrl = null;
      }
    },
    setRegionUnderEditPolygon: (
      state,
      action: PayloadAction<FacsimileRegion>
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

export type TextEditingPageState = {
  [textEditingPageSlice.name]: ITextEditingPageState;
};

export const {
  setTextEditingAccessMode,
  setTextEditingWorkspace,
  setTextEditingToolMode,
  onRegionHoveredInToolSpace,
  onRegionHoveredInFacsimileSpace,
  onElementSelected,
  setRegionUnderEditPolygon,
  clearTextEditingPageStore,
} = textEditingPageSlice.actions;
