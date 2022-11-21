import { IPageTranscriptionInfo, IUnitSummary } from '@frontend/domain';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  discardSegmentationChanges,
  saveDescriptionChanges,
  saveSegmentation,
} from '../../text-editing-page';
import { closeUnit, removeUnitEndTag } from '../units-summary';

const initialState: {
  pageInfo: IPageTranscriptionInfo;
  imageSize: { Width: number; Height: number };
  loading: boolean;
} = {
  imageSize: {
    Height: 0,
    Width: 0,
  },
  pageInfo: {
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
    NearestOpenUnit: null,
  },
  loading: true,
};

export const pageDataSlice = createSlice({
  name: 'pageData',
  initialState,
  reducers: {
    loadPageData: (
      state,
      action: PayloadAction<{
        pageInfo: IPageTranscriptionInfo;
        imageSize: { Width: number; Height: number };
      }>
    ) => {
      state.pageInfo = { ...action.payload.pageInfo };
      state.imageSize = { ...action.payload.imageSize };
    },
    setImageSize: (
      state,
      action: PayloadAction<{ Width: number; Height: number }>
    ) => {
      state.imageSize = { ...action.payload };
    },
    pageDataLoaded: (state) => {
      state.loading = false;
    },
    clearPageData: () => initialState,
    updateNearestOpenUnit: (state, action: PayloadAction<IUnitSummary>) => {
      state.pageInfo.NearestOpenUnit = { ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(closeUnit.fulfilled, (state, action) => {
      if (
        action.payload.data &&
        state.pageInfo.NearestOpenUnit &&
        action.payload.data.Id &&
        action.payload.data.Id === state.pageInfo.NearestOpenUnit.Id
      ) {
        state.pageInfo.NearestOpenUnit = null;
      }
    });
    builder.addCase(discardSegmentationChanges.fulfilled, (state, action) => {
      state.pageInfo.NearestOpenUnit = action.payload.nearestOpenUnit;
    });
    builder.addCase(saveSegmentation.fulfilled, (state, action) => {
      if (action.payload.nearestOpenUnitClosed) {
        state.pageInfo.NearestOpenUnit = null;
      }
    });
    builder.addCase(removeUnitEndTag.fulfilled, (state, action) => {
      if (action.payload.openUnitFromPreviousPage) {
        state.pageInfo.NearestOpenUnit =
          action.payload.openUnitFromPreviousPage;
      }
    });
    builder.addCase(saveDescriptionChanges.fulfilled, (state, action) => {
      state.pageInfo.EditionProgress = action.payload.EditionProgress;
      state.pageInfo.Pagination = action.payload.Pagination;
      state.pageInfo.PresentPageNumbering = action.payload.PresentPageNumbering;
      state.pageInfo.FacsimileImageUrl = action.payload.FacsimileImageUrl;
      state.pageInfo.Tags = action.payload.Tags;
      state.pageInfo.AdditionalCommentary = action.payload.AdditionalCommentary;
    });
  },
});

export type PageDataState = {
  [pageDataSlice.name]: {
    pageInfo: IPageTranscriptionInfo;
    imageSize: { Width: number; Height: number };
    loading: boolean;
  };
};

export const {
  loadPageData,
  clearPageData,
  pageDataLoaded,
  setImageSize,
  updateNearestOpenUnit,
} = pageDataSlice.actions;
