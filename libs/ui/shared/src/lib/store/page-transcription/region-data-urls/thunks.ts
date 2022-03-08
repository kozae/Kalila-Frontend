import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkApi } from '@frontend/shared-ui';
import { fabric } from 'fabric';
import { IFacsimileRegion } from '@frontend/domain';

export const generateDataUrls = createAsyncThunk<
  {
    data: Array<IFacsimileRegion & { Id: string; HighlightColor?: string }>;
    fabricImg: fabric.Image;
  },
  { fabricImg: fabric.Image },
  ThunkApi
>('regionDataUrls/generateDataUrls', async ({ fabricImg }, { getState }) => {
  const state = getState();

  return {
    data: [
      ...Object.values(state.imageElements.entities),
      ...Object.values(state.textElements.entities),
      ...Object.values(state.lines.entities),
    ].map(
      (el) =>
        el && {
          Id: el._id,
          HighlightColor: el.HighlightColor,
          ...el.FacsimileRegion,
        }
    ) as Array<IFacsimileRegion & { Id: string; HighlightColor?: string }>,
    fabricImg,
  };
});
