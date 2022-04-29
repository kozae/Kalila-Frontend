import { RootState } from '../../../config';

export function getParams(state: RootState) {
  const accessToken = state.session.session.accessToken;
  const manuscriptId = state.pageData.pageInfo.ManuscriptId;
  const pageId = state.pageData.pageInfo.Id;

  return { accessToken, manuscriptId, pageId };
}

export function getUnitParams(state: RootState) {
  const accessToken = state.session.session.accessToken;
  const manuscriptId = state.pageData.pageInfo.ManuscriptId;

  return { accessToken, manuscriptId };
}

export type PageParams = ReturnType<typeof getParams>;
