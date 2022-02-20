import {
  ILine,
  IPageTranscription,
  ITextElement,
  IToken,
} from '@frontend/domain';
import { useAppDispatch } from '../hooks';
import {
  clearImageSize,
  clearPageInfo,
  loadImageSize,
  loadPageInfo,
} from './page-data';
import { clearUnitSummaries, loadUnitSummaries } from './units-summary';
import { clearImageElements, loadImageElements } from './image-elements';
import { clearTextElements, loadTextElements } from './text-elements';
import { clearLines, loadLines } from './lines';
import { clearTokens, loadTokens } from './tokens';
import { useEffect } from 'react';

export function useTextEditingWorkspaceStore(
  data: IPageTranscription,
  imageSize: { width: number; height: number }
) {
  const dispatch = useAppDispatch();
  const { TextElements, ImageElements, Units, ...pageInfo } = data;
  const textElements: Omit<ITextElement, 'Lines'>[] = [];
  const lines: Omit<ILine, 'Tokens'>[] = [];
  const tokens: IToken[] = [];
  TextElements.forEach((te) => {
    const { Lines, ...rest } = te;
    textElements.push(rest);
    Lines.forEach((l) => {
      const { Tokens, ...rest } = l;
      tokens.push(...Tokens);
      lines.push(rest);
    });
  });
  dispatch(loadPageInfo(pageInfo));
  dispatch(loadImageSize(imageSize));
  dispatch(loadUnitSummaries(Units));
  dispatch(loadImageElements(ImageElements));
  dispatch(loadTextElements(textElements));
  dispatch(loadLines(lines));
  dispatch(loadTokens(tokens));

  useEffect(() => {
    return () => {
      dispatch(clearPageInfo());
      dispatch(clearImageSize());
      dispatch(clearUnitSummaries());
      dispatch(clearImageElements());
      dispatch(clearTextElements());
      dispatch(clearLines());
      dispatch(clearTokens());
    };
  }, []);
}
