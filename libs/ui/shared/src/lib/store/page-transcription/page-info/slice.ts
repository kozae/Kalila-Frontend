import { IPageInfo } from '@frontend/domain';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { data: IPageInfo } = {
  data: {
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

export const pageInfoSlice = createSlice({
  name: 'pageInfo',
  initialState,
  reducers: {
    loadPageInfo: (state, action: PayloadAction<IPageInfo>) => {
      state.data = { ...action.payload };
    },
    clearPageInfo: (state) => {
      state.data = initialState.data;
    },
  },
});

export const { loadPageInfo, clearPageInfo } = pageInfoSlice.actions;
