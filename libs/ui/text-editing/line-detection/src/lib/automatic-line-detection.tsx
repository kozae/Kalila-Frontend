import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useContext, useEffect, useState } from 'react';
import { TextEditingWorkspaceContext } from '@frontend/ui/text-editing/shared';
import {
  addDataUrl,
  loadLines,
  selectAllTextElements,
  selectManyRegionDataUrlById,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import Tesseract, { createScheduler, createWorker, PSM } from 'tesseract.js';
import {
  IFacsimileRegion,
  ILine,
  IPoint,
  ITextElement,
} from '@frontend/domain';
import {
  createRegionsDataUrls,
  highlightColors,
  PolygonHelper,
} from '@frontend/ui/facsimile';
import * as uuid from 'uuid';
import { useAutomaticLineDetectionExecution } from './hooks';

export const AutomaticLineDetection = () => {
  const [progress, setProgress] = useState(0);
  const textElements = useAppSelector(selectAllTextElements);
  const urls = useAppSelector((state) =>
    selectManyRegionDataUrlById(
      state,
      textElements.map((el) => el._id)
    )
  );
  // improve transfotmation pipeline from tesseract.Line.bbox to Kalila.ILine
  useAutomaticLineDetectionExecution(textElements, urls, setProgress);

  return (
    <Stack alignItems="center" spacing={3}>
      <Alert severity="info">
        running detection for {textElements.length} element(s)
      </Alert>
      <Box sx={{ width: '80%' }}>
        <LinearProgress variant="determinate" value={progress} />
      </Box>
    </Stack>
  );
};
