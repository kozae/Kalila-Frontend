import { createAsyncThunk } from '@reduxjs/toolkit';
import { PageDescription } from '@frontend/domain';
import { ThunkApi } from '@frontend/shared-ui';
import { saveThunk } from './save';
import { patchDescription } from './requests';

export const saveDescriptionChanges = createAsyncThunk<
  {
    EditionProgress: string;
    Pagination?: number | string;
    Foliation: string;
    PresentPageNumbering: string[];
    Tags: string[];
    FacsimileImageUrl: string;
    AdditionalCommentary: string;
  },
  PageDescription,
  ThunkApi
>(saveThunk.descriptionChanges, async (data, { getState }) => {
  await patchDescription(data, getState());
  return {
    EditionProgress: data.EditionProgress,
    Foliation: data.Foliation,
    PresentPageNumbering: data.PresentPageNumbering,
    Tags: data.Tags,
    Pagination: data.Pagination,
    FacsimileImageUrl: data.FacsimileImageUrl,
    AdditionalCommentary: data.AdditionalCommentary,
  };
});
