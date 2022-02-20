import { IIIFInfo, IPageInfo } from '@frontend/domain';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: {
  pageInfo: IPageInfo;
  imageSize: { width: number; height: number };
} = {
  imageSize: {
    height: 0,
    width: 0,
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
};

export const pageDataSlice = createSlice({
  name: 'pageData',
  initialState,
  reducers: {
    loadPageInfo: (state, action: PayloadAction<IPageInfo>) => {
      state.pageInfo = { ...action.payload };
    },
    clearPageInfo: (state) => {
      state.pageInfo = initialState.pageInfo;
    },
    loadImageSize: (state, action: PayloadAction<IIIFInfo>) => {
      state.imageSize = { ...action.payload };
    },
    clearImageSize: (state) => {
      state.imageSize = initialState.imageSize;
    },
  },
});

export const { loadPageInfo, clearPageInfo, loadImageSize, clearImageSize } =
  pageDataSlice.actions;
