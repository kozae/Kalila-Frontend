import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { AutomaticLineDetection } from './automatic-line-detection';
import { useSingleLineGenerationHandler } from './hooks';
import {
  loadGeneratedLines,
  selectFirstTextElement,
  selectTextEditingToolMode,
  setTextEditingToolMode,
  useAppDispatch,
  useAppSelector,
} from '@frontend/shared-ui';
import { LineGeneration } from './line-generation';
import Paper from '@mui/material/Paper';
import React from 'react';
import Typography from '@mui/material/Typography';
import * as uuid from 'uuid';

const OptionContainer: React.FC<{ instruction: string }> = ({
  children,
  instruction,
}) => {
  return (
    <Paper sx={{ width: '80%' }}>
      <Stack sx={{ mt: '5px' }} spacing={1} alignItems="center">
        {children}
        <Typography sx={{ p: '5px' }} variant="h4">
          {instruction}
        </Typography>
      </Stack>
    </Paper>
  );
};

export const DefineLinesChoices = () => {
  const toolMode = useAppSelector(selectTextEditingToolMode);
  const firstTextElement = useAppSelector(selectFirstTextElement);
  const dispatch = useAppDispatch();

  const createASingleLine = useSingleLineGenerationHandler();

  const handleSingleLineGeneration = () => {
    const line = createASingleLine(firstTextElement, 'generated_' + uuid.v4());
    dispatch(loadGeneratedLines([line]));
  };

  return toolMode === 'default' ? (
    <Stack
      sx={{
        mt: '5px',
        width: '100%',
        height: '100%',
        bgcolor: '#DDDDDD',
        overflowY: 'scroll',
      }}
      spacing={3}
      alignItems="center"
    >
      <Alert sx={{ width: '80%', mt: '5px' }} severity="info">
        No lines defined yet, choose an option below
      </Alert>
      <OptionContainer instruction="Enter the number of lines per element, then spread lines evenly on each element.">
        <Button
          variant="contained"
          onClick={() => dispatch(setTextEditingToolMode('generate'))}
        >
          Generate lines
        </Button>
      </OptionContainer>
      <OptionContainer instruction="Run an image processing algorithm to detect the bounding box of each line.">
        <Button
          variant="contained"
          onClick={() =>
            dispatch(setTextEditingToolMode('automatic-detection'))
          }
        >
          Run automatic detection
        </Button>
      </OptionContainer>
      <OptionContainer instruction="Add one line, then proceed manually adding line by line.">
        <Button variant="contained" onClick={handleSingleLineGeneration}>
          Manually define lines
        </Button>
      </OptionContainer>
    </Stack>
  ) : toolMode === 'automatic-detection' ? (
    <AutomaticLineDetection />
  ) : toolMode === 'generate' ? (
    <LineGeneration />
  ) : (
    <></>
  );
};
