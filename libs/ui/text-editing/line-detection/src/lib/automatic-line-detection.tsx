import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useState } from 'react';
import { useAutomaticLineDetectionExecution } from './hooks';
import {
  selectAllTextElements,
  selectManyRegionDataUrlById,
  useAppSelector,
} from '@frontend/ui/store';

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
