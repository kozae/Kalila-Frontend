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
import { highlightColors } from '@frontend/ui/facsimile';
import { clearTextEditingPageStore } from '../text-editing-page';

export function useTextEditingWorkspaceStore(
  data: IPageTranscription,
  imageSize: { Width: number; Height: number }
) {
  const dispatch = useAppDispatch();
  const { TextElements, ImageElements, Units, ...pageInfo } = data;
  const textElements: Omit<ITextElement, 'Lines'>[] = [];
  const lines: Array<Omit<ILine, 'Tokens'> & { ElementId: string }> = [];
  const tokens: (IToken & { LineId: string })[] = [];
  TextElements.forEach((te, i) => {
    const { Lines, ...rest } = te;
    textElements.push({ ...rest, HighlightColor: highlightColors[i % 13] });
    Lines.forEach((l, i) => {
      const { Tokens, ...rest } = l;
      tokens.push(...Tokens.map((t) => ({ ...t, LineId: l.Id })));
      lines.push({
        ...rest,
        ElementId: te.Id,
        HighlightColor: highlightColors[i % 13],
      });
    });
  });

  const imageElements = ImageElements.map((el, i) => ({
    ...el,
    HighlightColor: highlightColors[(i + 5) % 13],
  }));
  const clearAll = () => {
    console.log('clearing page transcription store');
    dispatch(clearPageData());
    dispatch(clearTextEditingPageStore());
    dispatch(clearUnitSummaries());
    dispatch(clearImageElements());
    dispatch(clearTextElements());
    dispatch(clearLines());
    dispatch(clearTokens());
  };

  useEffect(() => {
    dispatch(
      loadPageData({
        pageInfo,
        imageSize,
      })
    );
    dispatch(loadUnitSummaries(Units));
    dispatch(loadImageElements(imageElements));
    dispatch(loadTextElements(textElements));
    dispatch(loadLines(lines));
    dispatch(loadTokens(tokens));

    setTimeout(() => {
      dispatch(pageDataLoaded());
    }, 100);

    return clearAll;
  }, [data, imageSize]);

  useEffect(() => {
    return clearAll;
  }, []);
}
