import {
  ILine,
  IPageTranscription,
  ITextElement,
  IToken,
} from '@frontend/domain';
import { useAppDispatch } from '../hooks';
import { clearUnitSummaries, loadUnitSummaries } from './units-summary';
import { clearImageElements, loadImageElements } from './image-elements';
import { clearTextElements, loadTextElements } from './text-elements';
import { clearLines, loadLines } from './lines';
import { clearTokens, loadTokens } from './tokens';
import { useEffect } from 'react';
import { clearPageData, loadPageData, pageDataLoaded } from './page-data';

export function useTextEditingWorkspaceStore(
  data: IPageTranscription,
  imageSize: { Width: number; Height: number }
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

  useEffect(() => {
    dispatch(loadPageData({ pageInfo, imageSize }));
    dispatch(loadUnitSummaries(Units));
    dispatch(loadImageElements(ImageElements));
    dispatch(loadTextElements(textElements));
    dispatch(loadLines(lines));
    dispatch(loadTokens(tokens));

    setTimeout(() => {
      dispatch(pageDataLoaded());
    }, 1000);
  }, [data, imageSize]);

  useEffect(() => {
    return () => {
      dispatch(clearPageData());
      dispatch(clearUnitSummaries());
      dispatch(clearImageElements());
      dispatch(clearTextElements());
      dispatch(clearLines());
      dispatch(clearTokens());
    };
  }, []);
}
