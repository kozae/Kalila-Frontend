import { createAsyncThunk } from '@reduxjs/toolkit';
import { ILine, IToken } from '@frontend/domain';
import { ThunkApi } from '@frontend/shared-ui';
import { saveThunk } from './save';
import { deleteLines, postLines, putLines } from './requests';
import { omit } from 'lodash';
import { postTokens } from './requests/tokens';

export const saveLineChanges = createAsyncThunk<
  {
    Lines: (Omit<ILine, 'Tokens'> & { ElementId: string })[];
    Tokens: (IToken & { LineId: string })[];
    dataUrls: {
      id: string;
      data: string;
    }[];
    withTokens: boolean;
  },
  { withTokens: boolean },
  ThunkApi
>(saveThunk.lineChanges, async ({ withTokens }, { getState }) => {
  const state = getState();
  const changes = await postLines(state);
  await deleteLines(state);
  await putLines(state);
  if (withTokens) {
    await postTokens(state);
  }

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
        (l: any) => !changes.Ids.includes(l.Id)
      ),
      ...changes.Lines,
    ] as (Omit<ILine, 'Tokens'> & { ElementId: string })[],
    dataUrls,
    Tokens:
      withTokens && state.textEditingPageState.postTokens.length !== 0
        ? Object.values(state.tokens)
        : [],
    withTokens:
      withTokens && state.textEditingPageState.postTokens.length !== 0,
  };
});
