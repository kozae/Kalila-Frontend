import { createAsyncThunk } from '@reduxjs/toolkit';
import { ILine } from '@frontend/domain';
import { ThunkApi } from '@frontend/shared-ui';
import { saveThunk } from './save';
import { deleteLines, postLines, putLines } from './requests';
import { omit } from 'lodash';

export const saveLineChanges = createAsyncThunk<
  {
    Lines: (Omit<ILine, 'Tokens'> & { ElementId: string })[];
    dataUrls: {
      id: string;
      data: string;
    }[];
  },
  any,
  ThunkApi
>(saveThunk.lineChanges, async ({}, { getState }) => {
  const state = getState();
  const changes = await postLines(state);
  await deleteLines(state);
  await putLines(state);
  const dataUrls: {
    id: string;
    data: string;
  }[] = [];

  Object.values(state.regionDataUrls.entities).forEach((item) => {
    if (item) {
      const lineIndex = changes.Ids.indexOf(item.id);
      if (lineIndex !== -1) {
        dataUrls.push({
          id: changes.Lines[lineIndex].Id,
          data: item.data,
        });
      }

      dataUrls.push(item);
    }
  });

  return {
    Lines: [
      ...Object.values(state.lines.entities).filter(
        (l: any) => !changes.Ids.includes(l._id)
      ),
      ...changes.Lines.map(
        (l) =>
          ({ ...omit(l, 'Id'), _id: l.Id } as Omit<ILine, 'Tokens'> & {
            ElementId: string;
          })
      ),
    ] as (Omit<ILine, 'Tokens'> & { ElementId: string })[],
    dataUrls,
  };
});
