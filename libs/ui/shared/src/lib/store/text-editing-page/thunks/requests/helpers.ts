import { RootState } from '../../../config';

export function getParams(state: RootState) {
  const manuscriptId = state.pageData.pageInfo.ManuscriptId;
  const pageId = state.pageData.pageInfo.Id;

  return { manuscriptId, pageId };
}

export function getUnitParams(state: RootState) {
  const manuscriptId = state.pageData.pageInfo.ManuscriptId;

  return { manuscriptId };
}

export type PageParams = ReturnType<typeof getParams>;
