import {
  addDataUrl,
  loadLines,
  selectAllTextElements,
  selectManyRegionDataUrlById,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import Tesseract, { createWorker, createScheduler, PSM } from 'tesseract.js';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useState } from 'react';
import { ILine, IPoint, ITextElement } from '@frontend/domain';
import * as uuid from 'uuid';
import { highlightColors, PolygonHelper } from '@frontend/ui/facsimile';

export const SemiAutomatedLineDetector = () => {
  const [progress, setProgress] = useState(0);
  const [detectionStarted, setDetectionStarted] = useState(false);
  const textElements = useAppSelector(selectAllTextElements);
  const dispatch = useAppDispatch();
  const urls = useAppSelector((state) =>
    selectManyRegionDataUrlById(
      state,
      textElements.map((el) => el._id)
    )
  );

  const onUrlCreated = (id: string, data: string) =>
    dispatch(addDataUrl({ id, data }));

  const handleRunDetectionClick = async () => {
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
        tessedit_pageseg_mode: PSM.AUTO_ONLY,
      });
      return await scheduler.addJob('recognize', url);
    };

    const result: { [id: string]: Tesseract.Line[] } = {};
    setDetectionStarted(true);
    for (let [id, url] of Object.entries(urls)) {
      const { data } = await doDetection(url);
      result[id] = data.lines;
    }
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
        (Math.sqrt(Math.pow(Width, 2) + Math.pow(Height, 2)) * 3) / 100
      );
      lines.push(
        ...tesseractLines.map(({ bbox }, index) => ({
          _id: uuid.v4(),
          LineOrder: index + 1,
          ElementId: id,
          HighlightColor: highlightColors[index % 13],
          FacsimileRegion: {
            Points: PolygonHelper.fromRect(
              {
                X:
                  (el.FacsimileRegion?.Points[0].X as number) -
                  padding +
                  bbox.x0,
                Y:
                  (el.FacsimileRegion?.Points[0].Y as number) -
                  padding +
                  bbox.y0,
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

    dispatch(loadLines(lines));
    await scheduler.terminate();
    await worker.terminate();
  };

  // keep fabricImg in context to reuse it
  // keep padding in store to reuse it
  // create a transfotmation pipeline from tesseract.Line.bbox to Kalila.ILine
  return detectionStarted ? (
    <Stack alignItems="center" spacing={3}>
      <Alert severity="info">
        running detection for {textElements.length} element(s)
      </Alert>
      <Box sx={{ width: '80%' }}>
        <LinearProgress variant="determinate" value={progress} />
      </Box>
    </Stack>
  ) : (
    <Stack spacing={3}>
      <Alert severity="info"> No lines defined yet </Alert>
      <Button onClick={handleRunDetectionClick}>Run automatic detection</Button>
      <Button>Generate lines</Button>
      <Button>Manually add lines </Button>
    </Stack>
  );
};
