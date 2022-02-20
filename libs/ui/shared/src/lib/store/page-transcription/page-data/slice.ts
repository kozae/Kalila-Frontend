import { IIIFInfo, IPageInfo } from '@frontend/domain';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { pageInfo: IPageInfo; imageInfo: IIIFInfo } = {
  imageInfo: {
    context: '',
    height: 0,
    id: '',
    profile: [],
    protocol: '',
    sizes: [],
    tiles: [],
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
    loadImageInfo: (state, action: PayloadAction<IIIFInfo>) => {
      state.imageInfo = { ...action.payload };
    },
    clearImageInfo: (state) => {
      state.imageInfo = initialState.imageInfo;
    },
  },
});

export const { loadPageInfo, clearPageInfo, loadImageInfo, clearImageInfo } =
  pageDataSlice.actions;
