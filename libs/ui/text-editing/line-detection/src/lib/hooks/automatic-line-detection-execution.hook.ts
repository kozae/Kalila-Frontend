import Tesseract, { createScheduler, createWorker, PSM } from 'tesseract.js';
import { useContext, useEffect } from 'react';
import { ILine, IPoint, ITextElement } from '@frontend/domain';
import {
  highlightColors,
  PADDING_PERCENTAGE,
  PolygonHelper,
} from '@frontend/ui/facsimile';
import * as uuid from 'uuid';
import {
  loadGeneratedLines,
  setTextEditingToolMode,
  useAppDispatch,
} from '@frontend/shared-ui';
import { TextEditingWorkspaceContext } from '@frontend/ui/text-editing/shared';
import { createAndDispatchLineDataUrl } from './helpers';

const runDetectionFactory = (setProgress: (v: number) => void) => {
  const scheduler = createScheduler();
  const worker = createWorker({
    logger: (m) => {
      setProgress(Math.round(parseFloat(m.progress) * 100));
    },
  });
  scheduler.addWorker(worker);
  const doDetection = async (url: string) => {
    await worker.load();
    await worker.loadLanguage('ara');
    await worker.initialize('ara');
    await worker.setParameters({
      //@ts-ignore
      tessedit_pageseg_mode: '2',
    });
    return await scheduler.addJob('recognize', url);
  };
  return async (urls: Record<string, string>) => {
    const result: { [id: string]: Tesseract.Line[] } = {};
    for (let [id, url] of Object.entries(urls)) {
      const { data } = await doDetection(url);
      result[id] = data.lines;
    }
    await scheduler.terminate();
    await worker.terminate();
    return result;
  };
};

const transformResultsToKalilaLines = (
  result: {
    [id: string]: Tesseract.Line[];
  },
  textElements: Array<Omit<ITextElement, 'Lines'>>
) => {
  const lines: Array<Omit<ILine, 'Tokens'> & { ElementId: string }> = [];
  for (let [id, tesseractLines] of Object.entries(result)) {
    console.log({ tesseractLines });
    const el = textElements.find((el) => el._id === id) as Omit<
      ITextElement,
      'Lines'
    >;
    const { Width, Height } = PolygonHelper.getWidthAndHeight(
      el.FacsimileRegion?.Points as IPoint[]
    );
    const padding = Math.floor(
      (Math.sqrt(Math.pow(Width, 2) + Math.pow(Height, 2)) *
        PADDING_PERCENTAGE) /
        100
    );
    lines.push(
      ...tesseractLines.map(({ bbox }, index) => ({
        _id: 'generated_' + uuid.v4(),
        LineOrder: index + 1,
        ElementId: id,
        HighlightColor: highlightColors[index % 13],
        FacsimileRegion: {
          Points: PolygonHelper.fromRect(
            {
              X:
                (el.FacsimileRegion?.Points[0].X as number) - padding + bbox.x0,
              Y:
                (el.FacsimileRegion?.Points[0].Y as number) - padding + bbox.y0,
              Width: bbox.x1 - bbox.x0,
              Height: bbox.y1 - bbox.y0,
            },
            el.FacsimileRegion?.Rotation as number
          ),
          Rotation: el.FacsimileRegion?.Rotation as number,
        },
      }))
    );
  }

  return lines;
};

export function useAutomaticLineDetectionExecution(
  textElements: Array<Omit<ITextElement, 'Lines'>>,
  urls: Record<string, string>,
  setProgress: (v: number) => void
) {
  const { fabricImg } = useContext(TextEditingWorkspaceContext);
  const runDetection = runDetectionFactory(setProgress);
  const dispatch = useAppDispatch();
  useEffect(() => {
    runDetection(urls).then((result) => {
      const lines = transformResultsToKalilaLines(result, textElements);
      dispatch(loadGeneratedLines(lines));
      createAndDispatchLineDataUrl(lines, fabricImg, dispatch);
      dispatch(setTextEditingToolMode('default'));
    });
  }, []);
}
