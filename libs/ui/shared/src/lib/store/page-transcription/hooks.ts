import {
  IFacsimileRegion,
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
import { useEffect, useState } from 'react';
import { clearPageData, loadPageData, pageDataLoaded } from './page-data';
import { addDataUrl, clearDataUrls } from './region-data-urls';
import {
  createRegionsDataUrls,
  highlightColors,
  loadImageAsFabricObject,
} from '@frontend/ui/facsimile';
import { clearTextEditingPageStore } from '../text-editing-page';
import { fabric } from 'fabric';

function useImageAsFabricObject(url: string) {
  const [fabricImg, setFabricImg] = useState<null | fabric.Image>(null);
  useEffect(() => {
    loadImageAsFabricObject(url, setFabricImg);
  }, [url]);
  return fabricImg;
}

export function useTextEditingWorkspaceStore(
  data: IPageTranscription,
  imageSize: { Width: number; Height: number }
) {
  const dispatch = useAppDispatch();
  const fabricImg = useImageAsFabricObject(data.FacsimileImageUrl);
  const { TextElements, ImageElements, Units, ...pageInfo } = data;
  const textElements: Omit<ITextElement, 'Lines'>[] = [];
  const lines: Array<Omit<ILine, 'Tokens'> & { ElementId: string }> = [];
  const tokens: IToken[] = [];
  TextElements.forEach((te, i) => {
    const { Lines, ...rest } = te;
    textElements.push({ ...rest, HighlightColor: highlightColors[i % 13] });
    Lines.forEach((l, i) => {
      const { Tokens, ...rest } = l;
      tokens.push(...Tokens);
      lines.push({
        ...rest,
        ElementId: te._id,
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
    dispatch(clearDataUrls());
    dispatch(clearUnitSummaries());
    dispatch(clearImageElements());
    dispatch(clearTextElements());
    dispatch(clearLines());
    dispatch(clearTokens());
    dispatch(clearTextEditingPageStore());
  };

  useEffect(() => {
    dispatch(loadPageData({ pageInfo, imageSize }));
    dispatch(loadUnitSummaries(Units));
    dispatch(loadImageElements(imageElements));
    dispatch(loadTextElements(textElements));
    dispatch(loadLines(lines));
    dispatch(loadTokens(tokens));

    setTimeout(() => {
      dispatch(pageDataLoaded());
    }, 1000);

    return clearAll;
  }, [data, imageSize]);

  const onUrlCreated = (id: string, data: string) =>
    dispatch(addDataUrl({ id, data }));
  useEffect(() => {
    if (fabricImg !== null) {
      const data = [...textElements, ...imageElements, ...lines].map(
        (el) =>
          el && {
            Id: el._id,
            HighlightColor: el.HighlightColor,
            ...el.FacsimileRegion,
          }
      ) as Array<IFacsimileRegion & { Id: string; HighlightColor?: string }>;
      createRegionsDataUrls(data, fabricImg, onUrlCreated);
    }
  }, [data, fabricImg]);

  useEffect(() => {
    return clearAll;
  }, []);
}
