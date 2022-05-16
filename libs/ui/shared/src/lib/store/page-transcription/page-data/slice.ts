import { IPageTranscriptionInfo } from '@frontend/domain';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  saveDescriptionChanges,
  saveSegmentation,
} from '../../text-editing-page';

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
  },
  extraReducers: (builder) => {
    builder.addCase(saveSegmentation.fulfilled, (state, action) => {
      if (action.payload.nearestOpenUnitClosed) {
        state.pageInfo.NearestOpenUnit = undefined;
      }
    });
    builder.addCase(saveDescriptionChanges.fulfilled, (state, action) => {
      state.pageInfo.EditionProgress = action.payload.EditionProgress;
      state.pageInfo.Pagination = action.payload.Pagination;
      state.pageInfo.PresentPageNumbering = action.payload.PresentPageNumbering;
      state.pageInfo.FacsimileImageUrl = action.payload.FacsimileImageUrl;
      state.pageInfo.Tags = action.payload.Tags;
    });
  },
});

export const { loadPageData, clearPageData, pageDataLoaded, setImageSize } =
  pageDataSlice.actions;
