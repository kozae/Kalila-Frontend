import { IPageInfo } from '@frontend/domain';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  discardLayoutChanges,
  discardThunk,
} from '../../text-editing-page/thunks';

const initialState: {
  pageInfo: IPageInfo;
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
        pageInfo: IPageInfo;
        imageSize: { Width: number; Height: number };
      }>
    ) => {
      state.pageInfo = { ...action.payload.pageInfo };
      state.imageSize = { ...action.payload.imageSize };
    },
    pageDataLoaded: (state) => {
      state.loading = false;
    },
    clearPageData: (state) => {
      state.pageInfo = initialState.pageInfo;
      state.loading = true;
    },
  },
});

export const { loadPageData, clearPageData, pageDataLoaded } =
  pageDataSlice.actions;
